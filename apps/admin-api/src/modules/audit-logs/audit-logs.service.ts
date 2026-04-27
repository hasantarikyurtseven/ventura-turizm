import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
    constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) { }

    async log(data: {
        actorId: string | null | undefined;
        action: string;
        entityType: string;
        entityId?: string | null;
        message: string;
        metadata?: any;
    }) {
        const actorIdStr = data.actorId;
        const entityIdStr = data.entityId;
        const log = new this.auditLogModel({
            ...data,
            actorType: 'admin',
            actorId:
                typeof actorIdStr === 'string' && Types.ObjectId.isValid(actorIdStr)
                    ? new Types.ObjectId(actorIdStr)
                    : null,
            entityId:
                typeof entityIdStr === 'string' && Types.ObjectId.isValid(entityIdStr)
                    ? new Types.ObjectId(entityIdStr)
                    : null,
        });
        return log.save();
    }
}
