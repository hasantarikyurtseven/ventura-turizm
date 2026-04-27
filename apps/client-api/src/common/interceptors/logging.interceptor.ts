import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params, headers } = request;
    const startTime = Date.now();
    const hasAuth = !!headers?.['authorization'];

    // Sanitize request body (remove sensitive data)
    const sanitizedBody = this.sanitizeData(body);
    const sanitizedQuery = this.sanitizeData(query);
    const sanitizedParams = this.sanitizeData(params);

    const requestSummary = this.buildRequestSummary(method, url, sanitizedBody, sanitizedQuery, sanitizedParams, hasAuth);
    this.logger.log(requestSummary);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const responseSummary = this.buildResponseSummary(method, url, response.statusCode, duration, data);
          this.logger.log(responseSummary);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Request Error: ${method} ${url} - Status: ${error.status || 500} - Duration: ${duration}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }

  private sanitizeData(data: any, seen = new WeakSet()): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Circular reference koruması
    if (seen.has(data)) {
      return '[Circular]';
    }
    seen.add(data);

    const sanitized: any = Array.isArray(data) ? [] : {};
    const sensitiveKeys = [
      'password',
      'clientKey',
      'client_key',
      'username',
      'token',
      'secret',
      'apiKey',
      'api_key',
      'authorization',
    ];

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sk => lowerKey.includes(sk.toLowerCase()))) {
          sanitized[key] = '***';
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          sanitized[key] = this.sanitizeData(data[key], seen);
        } else {
          sanitized[key] = data[key];
        }
      }
    }

    return sanitized;
  }

  private buildRequestSummary(
    method: string,
    url: string,
    body: any,
    query: any,
    params: any,
    hasAuth: boolean,
  ): string {
    const segments: string[] = [`Incoming Request: ${method} ${url}`];
    segments.push(`Auth: ${hasAuth ? 'yes' : 'NO'}`);
    if (query && Object.keys(query).length > 0) {
      segments.push(`Query: ${JSON.stringify(query)}`);
    }
    if (params && Object.keys(params).length > 0) {
      segments.push(`Params: ${JSON.stringify(params)}`);
    }

    if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      segments.push(`BodyKeys: ${Object.keys(body).join(',')}`);
    }

    return segments.join(' - ');
  }

  private buildResponseSummary(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    data: any,
  ): string {
    const segments: string[] = [
      `Outgoing Response: ${method} ${url}`,
      `Status: ${statusCode}`,
      `Duration: ${duration}ms`,
    ];

    const sanitizedResponse = this.sanitizeData(data);
    if (sanitizedResponse && typeof sanitizedResponse === 'object') {
      const summary: Record<string, unknown> = {};
      for (const key of ['success', 'message', 'hasError', 'searchId', 'shoppingFileId', 'allocateId', 'productId', 'correlationId']) {
        if (key in sanitizedResponse) {
          summary[key] = sanitizedResponse[key];
        }
      }
      if (Array.isArray(sanitizedResponse.flights)) {
        summary.flightsCount = sanitizedResponse.flights.length;
      }
      if (Object.keys(summary).length > 0) {
        segments.push(`Response: ${JSON.stringify(summary)}`);
      }
    }

    return segments.join(' - ');
  }
}
