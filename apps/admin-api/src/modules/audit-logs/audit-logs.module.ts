import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogService } from './audit-logs.service';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
        UsersModule,
    ],
    providers: [AuditLogService],
    exports: [AuditLogService],
})
export class AuditLogsModule { }
