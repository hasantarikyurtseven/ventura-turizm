import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuditLogService } from '../audit-logs.service';
import { UsersService } from '../../users/users.service';

@Catch()
export class AuditLogExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AuditLogExceptionFilter.name);

    constructor(
        private auditLogService: AuditLogService,
        @Inject(UsersService) private usersService: UsersService,
    ) { }

    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Bilinmeyen bir hata oluştu';

        const errorMessage = typeof message === 'string' ? message : (message as any).message || 'Hata oluştu';
        const errorDetails = typeof message === 'object' ? message : { message: errorMessage };

        // Log failed operations
        await this.logFailedOperation(request, status, errorMessage, exception);

        // Send response
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: errorMessage,
            ...(process.env.NODE_ENV === 'development' && { details: errorDetails }),
        });
    }

    private async logFailedOperation(
        request: Request,
        status: number,
        errorMessage: string,
        exception: unknown,
    ): Promise<void> {
        try {
            const { method, url, body, user } = request;

            // Only log client errors (4xx) and server errors (5xx), skip successful redirects
            if (status < 400) {
                return;
            }

            // Determine action type based on URL and method
            let action = 'UNKNOWN_ERROR';
            let entityType = 'Unknown';
            let actorId: string | null = null;

            // Auth related errors
            if (url.includes('/admin/auth/login') && method === 'POST') {
                action = 'LOGIN_FAILED';
                entityType = 'User';
                const username = body?.username || 'Unknown';
                
                // Try to find user to get actorId
                let actorId: string | null = null;
                try {
                    const user = await this.usersService.findByUsername(username);
                    if (user) {
                        actorId = (user as any)._id.toString();
                    }
                } catch (userError) {
                    // User not found or error, continue with null actorId
                }
                
                try {
                    await this.auditLogService.log({
                        actorId: actorId,
                        action: action,
                        entityType: entityType,
                        message: `Giriş başarısız: ${username} - ${errorMessage}`,
                        metadata: {
                            username: username,
                            statusCode: status,
                            error: errorMessage,
                            ip: request.ip || request.headers['x-forwarded-for'] || 'Unknown',
                        },
                    });
                } catch (logError) {
                    this.logger.error('Failed to log audit entry', logError);
                }
                return;
            }

            // Other authenticated operations
            if (user && (user as any).userId) {
                actorId = (user as any).userId;

                // Determine entity type and action from URL
                if (url.includes('/admin/users')) {
                    entityType = 'User';
                    if (method === 'POST') action = 'CREATE_USER_FAILED';
                    else if (method === 'PUT') action = 'UPDATE_USER_FAILED';
                    else if (method === 'DELETE') action = 'DELETE_USER_FAILED';
                } else if (url.includes('/admin/roles')) {
                    entityType = 'Role';
                    if (method === 'POST') action = 'CREATE_ROLE_FAILED';
                    else if (method === 'PUT') action = 'UPDATE_ROLE_FAILED';
                    else if (method === 'DELETE') action = 'DELETE_ROLE_FAILED';
                } else if (url.includes('/admin/permissions')) {
                    entityType = 'Permission';
                    if (method === 'POST') action = 'CREATE_PERMISSION_FAILED';
                    else if (method === 'PUT') action = 'UPDATE_PERMISSION_FAILED';
                    else if (method === 'DELETE') action = 'DELETE_PERMISSION_FAILED';
                } else if (url.includes('/admin/dashboard')) {
                    entityType = 'Dashboard';
                    action = 'DASHBOARD_ACCESS_FAILED';
                } else if (url.includes('/admin/airlines')) {
                    entityType = 'Airline';
                    if (method === 'POST') action = 'CREATE_AIRLINE_FAILED';
                    else if (method === 'PUT') action = 'UPDATE_AIRLINE_FAILED';
                    else if (method === 'DELETE') action = 'DELETE_AIRLINE_FAILED';
                }

                await this.auditLogService.log({
                    actorId: actorId || undefined,
                    action: action,
                    entityType: entityType,
                    message: `İşlem başarısız: ${errorMessage}`,
                    metadata: {
                        method,
                        url,
                        statusCode: status,
                        error: errorMessage,
                        ip: request.ip || request.headers['x-forwarded-for'] || 'Unknown',
                    },
                });
            }
        } catch (logError) {
            // Don't let logging errors break the request
            this.logger.error('Failed to log audit entry for exception', logError);
        }
    }
}
