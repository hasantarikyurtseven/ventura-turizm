import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminNotification, AdminNotificationDocument } from './schemas/admin-notification.schema';

export interface AdminNotificationDto {
    id: string;
    message: string;
    icon: string;
    read: boolean;
    time: string;
    bookingCode: string | null;
    reservationId: string | null;
    createdAt: Date;
}

@Injectable()
export class AdminNotificationsService {
    constructor(
        @InjectModel(AdminNotification.name)
        private readonly model: Model<AdminNotificationDocument>,
    ) {}

    async listForAdmin(limit = 50): Promise<AdminNotificationDto[]> {
        const n = Math.min(Math.max(Number(limit) || 50, 1), 100);
        const rows = await this.model
            .find()
            .sort({ createdAt: -1 })
            .limit(n)
            .lean()
            .exec();

        return rows.map((doc: any) => ({
            id: doc._id.toString(),
            message: doc.message,
            icon: doc.icon || 'notifications',
            read: !!doc.read,
            time: this.getTimeAgo(doc.createdAt),
            bookingCode: doc.bookingCode ?? null,
            reservationId: doc.reservationId ?? null,
            createdAt: doc.createdAt,
        }));
    }

    async markRead(id: string): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: { read: true } }).exec();
    }

    async markAllRead(): Promise<void> {
        await this.model.updateMany({ read: false }, { $set: { read: true } }).exec();
    }

    private getTimeAgo(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} gün önce`;
        if (hours > 0) return `${hours} saat önce`;
        if (minutes > 0) return `${minutes} dakika önce`;
        if (seconds > 5) return `${seconds} saniye önce`;
        return 'Az önce';
    }
}
