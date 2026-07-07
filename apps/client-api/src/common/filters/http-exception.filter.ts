import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // NestJS getResponse() bir string veya { message, error, statusCode } objesi döner.
    // Her zaman düz string mesaj çıkar — Angular tarafında [object Object] sorununu önler.
    const rawResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message: string =
      typeof rawResponse === 'string'
        ? rawResponse
        : typeof (rawResponse as any)?.message === 'string'
          ? (rawResponse as any).message
          : Array.isArray((rawResponse as any)?.message)
            ? ((rawResponse as any).message as string[]).join(', ')
            : 'Bir hata oluştu.';

    // Sanitize error message - remove sensitive information
    const sanitizedMessage = this.sanitizeError(message);

    // Log error (without sensitive data)
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: sanitizedMessage,
    };

    if (status >= 500) {
      this.logger.error(JSON.stringify(errorLog));
      if (exception instanceof Error) {
        this.logger.error(`Stack: ${exception.stack}`);
      }
    } else {
      this.logger.warn(JSON.stringify(errorLog));
    }

    // Don't expose stack trace in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const responseBody: any = {
      statusCode: status,
      timestamp: errorLog.timestamp,
      path: request.url,
      message: sanitizedMessage,
    };

    if (isDevelopment && exception instanceof Error) {
      responseBody.stack = exception.stack;
    }

    response.status(status).json(responseBody);
  }

  private sanitizeError(message: any): any {
    if (typeof message === 'string') {
      // Remove potential credential leaks
      return message
        .replace(/password[=:]\s*\S+/gi, 'password=***')
        .replace(/client[_-]?key[=:]\s*\S+/gi, 'client_key=***')
        .replace(/username[=:]\s*\S+/gi, 'username=***')
        .replace(/token[=:]\s*\S+/gi, 'token=***');
    }

    if (typeof message === 'object' && message !== null) {
      const sanitized: any = Array.isArray(message) ? [] : {};
      for (const key in message) {
        if (Object.prototype.hasOwnProperty.call(message, key)) {
          const lowerKey = key.toLowerCase();
          if (
            lowerKey.includes('password') ||
            lowerKey.includes('client') ||
            lowerKey.includes('key') ||
            lowerKey.includes('token') ||
            lowerKey.includes('secret')
          ) {
            sanitized[key] = '***';
          } else {
            sanitized[key] = this.sanitizeError(message[key]);
          }
        }
      }
      return sanitized;
    }

    return message;
  }
}
