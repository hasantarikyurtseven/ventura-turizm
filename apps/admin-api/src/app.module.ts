import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Connection } from 'mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Schemas
import { User, UserSchema } from './modules/users/schemas/user.schema';
import { Role, RoleSchema } from './modules/roles/schemas/role.schema';
import { Permission, PermissionSchema } from './modules/permissions/schemas/permission.schema';
import { RefreshToken, RefreshTokenSchema } from './modules/auth/schemas/refresh-token.schema';
import { AuditLog, AuditLogSchema } from './modules/audit-logs/schemas/audit-log.schema';

import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AirlinesModule } from './modules/airlines/airlines.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { MembersModule } from './modules/members/members.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { AdminNotificationsModule } from './modules/admin-notifications/admin-notifications.module';

// Interceptors
import { AuditLogInterceptor } from './modules/audit-logs/interceptors/audit-log.interceptor';

// Filters
import { AuditLogExceptionFilter } from './modules/audit-logs/filters/audit-log-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: `redis://${configService.get('REDIS_HOST', 'redis')}:${configService.get('REDIS_PORT', 6379)}`,
        }),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AuditLogsModule,
    PermissionsModule,
    RolesModule,
    DashboardModule,
    AirlinesModule,
    ContractsModule,
    MembersModule,
    ReservationsModule,
    AdminNotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AuditLogExceptionFilter,
    },
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) { }

  onModuleInit() {
    this.connection.on('connected', () => {
      this.logger.log('✅ MongoDB connected successfully');
    });
    this.connection.on('error', (err) => {
      this.logger.error('❌ MongoDB connection error:', err);
    });

    // If already connected
    if (this.connection.readyState === 1) {
      this.logger.log('✅ MongoDB already connected');
    }
  }
}
