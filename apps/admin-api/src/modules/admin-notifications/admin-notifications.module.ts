import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminNotification, AdminNotificationSchema } from './schemas/admin-notification.schema';
import { AdminNotificationsService } from './admin-notifications.service';
import { AdminNotificationsController } from './admin-notifications.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AdminNotification.name, schema: AdminNotificationSchema },
        ]),
    ],
    controllers: [AdminNotificationsController],
    providers: [AdminNotificationsService],
    exports: [AdminNotificationsService],
})
export class AdminNotificationsModule {}
