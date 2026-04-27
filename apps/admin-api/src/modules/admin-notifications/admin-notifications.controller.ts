import { Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminNotificationsService } from './admin-notifications.service';

@Controller('admin/notifications')
@UseGuards(JwtAuthGuard)
export class AdminNotificationsController {
    constructor(private readonly service: AdminNotificationsService) {}

    @Get()
    async list(@Query('limit') limit?: string) {
        const n = limit ? parseInt(limit, 10) : 50;
        return this.service.listForAdmin(Number.isFinite(n) && n > 0 ? n : 50);
    }

    @Patch(':id/read')
    async markOneRead(@Param('id') id: string) {
        await this.service.markRead(id);
        return { success: true };
    }

    @Post('mark-all-read')
    async markAllRead() {
        await this.service.markAllRead();
        return { success: true };
    }
}
