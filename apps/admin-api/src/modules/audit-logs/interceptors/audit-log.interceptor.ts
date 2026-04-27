import { Injectable, Logger, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from '../audit-logs.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditLogInterceptor.name);
    constructor(private auditLogService: AuditLogService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, user, body, params } = req;

        return next.handle().pipe(
            tap(async (data) => {
                try {
                    // Log successful login
                    if (url.includes('/admin/auth/login') && method === 'POST') {
                        if (data?.accessToken) {
                            try {
                                const payload = JSON.parse(Buffer.from(data.accessToken.split('.')[1], 'base64').toString());
                                await this.auditLogService.log({
                                    actorId: payload.sub,
                                    action: 'LOGIN_SUCCESS',
                                    entityType: 'User',
                                    entityId: payload.sub,
                                    message: `Başarılı giriş: ${payload.username}`,
                                });
                            } catch (error) {
                                // Silently fail if we can't decode the token
                            }
                        }
                        return;
                    }

                    // Log logout
                    if (url.includes('/admin/auth/logout') && method === 'POST') {
                        if (user && (user as any).userId) {
                            await this.auditLogService.log({
                                actorId: (user as any).userId,
                                action: 'LOGOUT',
                                entityType: 'User',
                                entityId: (user as any).userId,
                                message: `Çıkış yapıldı: ${(user as any).username}`,
                            });
                        }
                        return;
                    }

                    // Log authenticated CRUD operations
                    if (user && (user as any).userId) {
                        const actorId = (user as any).userId;
                        let action = '';
                        let entityType = '';
                        let entityId: string | null = null;
                        let message = '';

                        // Users operations
                        if (url.includes('/admin/users')) {
                            entityType = 'User';
                            if (method === 'POST') {
                                action = 'CREATE_USER';
                                entityId = data?._id || null;
                                message = `Yeni kullanıcı oluşturuldu: ${body?.username || body?.email || 'Bilinmeyen'}`;
                            } else if (method === 'PUT') {
                                action = 'UPDATE_USER';
                                entityId = params?.id || null;
                                message = `Kullanıcı güncellendi: ${params?.id || 'Bilinmeyen'}`;
                            } else if (method === 'DELETE') {
                                action = 'DELETE_USER';
                                entityId = params?.id || null;
                                message = `Kullanıcı silindi: ${params?.id || 'Bilinmeyen'}`;
                            } else if (method === 'GET' && params?.id) {
                                action = 'VIEW_USER';
                                entityId = params.id;
                                message = `Kullanıcı görüntülendi: ${params.id}`;
                            }
                        }
                        // Roles operations
                        else if (url.includes('/admin/roles')) {
                            entityType = 'Role';
                            if (method === 'POST') {
                                action = 'CREATE_ROLE';
                                entityId = data?._id || null;
                                message = `Yeni rol oluşturuldu: ${body?.name || 'Bilinmeyen'}`;
                            } else if (method === 'PUT') {
                                action = 'UPDATE_ROLE';
                                entityId = params?.id || null;
                                message = `Rol güncellendi: ${params?.id || 'Bilinmeyen'}`;
                            } else if (method === 'DELETE') {
                                action = 'DELETE_ROLE';
                                entityId = params?.id || null;
                                message = `Rol silindi: ${params?.id || 'Bilinmeyen'}`;
                            }
                        }
                        // Permissions operations
                        else if (url.includes('/admin/permissions')) {
                            entityType = 'Permission';
                            if (method === 'POST') {
                                action = 'CREATE_PERMISSION';
                                entityId = data?._id || null;
                                message = `Yeni izin oluşturuldu: ${body?.code || body?.name || 'Bilinmeyen'}`;
                            } else if (method === 'PUT') {
                                action = 'UPDATE_PERMISSION';
                                entityId = params?.id || null;
                                message = `İzin güncellendi: ${params?.id || 'Bilinmeyen'}`;
                            } else if (method === 'DELETE') {
                                action = 'DELETE_PERMISSION';
                                entityId = params?.id || null;
                                message = `İzin silindi: ${params?.id || 'Bilinmeyen'}`;
                            }
                        }
                        // Password change
                        else if (url.includes('/admin/users') && url.includes('/password') && method === 'PUT') {
                            entityType = 'User';
                            action = 'CHANGE_PASSWORD';
                            entityId = params?.id || null;
                            message = `Şifre değiştirildi: ${params?.id || 'Bilinmeyen'}`;
                        }
                        // Airlines operations
                        else if (url.includes('/admin/airlines')) {
                            entityType = 'Airline';
                            if (method === 'POST') {
                                action = 'CREATE_AIRLINE';
                                entityId = data?._id || null;
                                message = `Havayolu eklendi: ${body?.code || body?.name || 'Bilinmeyen'}`;
                            } else if (method === 'PUT') {
                                action = 'UPDATE_AIRLINE';
                                entityId = params?.id || null;
                                message = `Havayolu güncellendi: ${params?.id || 'Bilinmeyen'}`;
                            } else if (method === 'DELETE') {
                                action = 'DELETE_AIRLINE';
                                entityId = params?.id || null;
                                message = `Havayolu silindi: ${params?.id || 'Bilinmeyen'}`;
                            }
                        }

                        // Log the action if we determined it
                        if (action && entityType) {
                            await this.auditLogService.log({
                                actorId: actorId,
                                action: action,
                                entityType: entityType,
                                entityId: entityId || undefined,
                                message: message,
                            });
                        }
                    }
                } catch (error) {
                    // Don't let logging errors break the request
                    this.logger.error('Audit log error', error);
                }
            }),
        );
    }
}
