import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { AuditLog } from '../audit-logs/schemas/audit-log.schema';
import { ReservationsService } from '../reservations/reservations.service';
import { MembersService } from '../members/members.service';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
        private readonly reservationsService: ReservationsService,
        private readonly membersService: MembersService,
    ) { }

    async getStatistics() {
        const [memberStats, reservationStats] = await Promise.all([
            this.membersService.getStats(),
            this.reservationsService.getStats(),
        ]);

        return {
            totalMembers: memberStats.total,
            totalReservations: reservationStats.total,
            totalRevenue: reservationStats.totalRevenue,
            /** İptal edilmiş rezervasyonlar (client/admin status varyantları dahil) */
            faultyReservations: reservationStats.cancelled,
        };
    }

    async getRecentActivities() {
        const activities = await this.auditLogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('actorId', 'username name surName')
            .lean();

        return activities.map(activity => {
            const actor = activity.actorId as any;
            const actionIconMap: { [key: string]: string } = {
                'create': 'add_circle',
                'update': 'edit',
                'delete': 'delete',
                'login': 'login',
                'logout': 'logout',
            };

            // Determine action type from action string
            let actionType = 'info';
            let icon = 'info';
            let status = 'Başarılı';
            let statusClass = 'success';
            
            // Check if it's a failed operation
            const isFailed = activity.action.includes('FAILED') || 
                            activity.action.includes('_FAILED') ||
                            activity.message.includes('başarısız') ||
                            activity.message.includes('hata');
            
            if (isFailed) {
                status = 'Başarısız';
                statusClass = 'error';
                icon = 'error';
            } else if (activity.action.includes('LOGIN_SUCCESS')) {
                icon = 'login';
            } else if (activity.action.includes('LOGOUT')) {
                icon = 'logout';
            } else if (activity.action.includes('CHANGE_PASSWORD')) {
                icon = 'lock';
            } else if (activity.action.includes('create') || activity.action.includes('CREATE')) {
                actionType = 'create';
                icon = 'add_circle';
            } else if (activity.action.includes('update') || activity.action.includes('UPDATE')) {
                actionType = 'update';
                icon = 'edit';
            } else if (activity.action.includes('delete') || activity.action.includes('DELETE')) {
                actionType = 'delete';
                icon = 'delete';
            }

            // Determine user info
            let user = 'System';
            let userName: string | null = null;
            
            if (actor && typeof actor === 'object') {
                user = actor.username || 'System';
                if (actor.name && actor.surName) {
                    userName = `${actor.name} ${actor.surName}`.trim();
                } else if (actor.name) {
                    userName = actor.name;
                } else if (actor.surName) {
                    userName = actor.surName;
                }
                // If userName is still null or empty, don't set it (will show only username)
                if (!userName || userName === '') {
                    userName = null;
                }
            }

            return {
                _id: activity._id,
                action: activity.message,
                user: user,
                userName: userName,
                entity: activity.entityType,
                time: this.getTimeAgo((activity as any).createdAt as Date),
                status: status,
                statusClass: statusClass,
                icon: icon,
                createdAt: (activity as any).createdAt
            };
        });
    }

    async getRecentReservations(limit = 8) {
        return this.reservationsService.findRecent(limit);
    }

    async getRecentMembers(limit = 8) {
        return this.membersService.findRecent(limit);
    }

    private getTimeAgo(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} gün önce`;
        } else if (hours > 0) {
            return `${hours} saat önce`;
        } else if (minutes > 0) {
            return `${minutes} dakika önce`;
        } else {
            return `${seconds} saniye önce`;
        }
    }
}
