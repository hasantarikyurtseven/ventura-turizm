import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('statistics')
    async getStatistics() {
        return this.dashboardService.getStatistics();
    }

    @Get('activities')
    async getRecentActivities() {
        return this.dashboardService.getRecentActivities();
    }

    @Get('recent-reservations')
    async getRecentReservations(@Query('limit') limit?: string) {
        const n = limit ? parseInt(limit, 10) : 8;
        return this.dashboardService.getRecentReservations(
            Number.isFinite(n) && n > 0 ? n : 8,
        );
    }

    @Get('recent-members')
    async getRecentMembers(@Query('limit') limit?: string) {
        const n = limit ? parseInt(limit, 10) : 8;
        return this.dashboardService.getRecentMembers(
            Number.isFinite(n) && n > 0 ? n : 8,
        );
    }
}
