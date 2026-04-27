import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from '../roles/schemas/role.schema';
import { Permission } from '../permissions/schemas/permission.schema';
import { PermissionCacheService } from '../roles/services/permission-cache.service';

@Injectable()
export class PermissionsService {
    private readonly logger = new Logger(PermissionsService.name);

    constructor(
        @InjectModel(Role.name) private roleModel: Model<Role>,
        @InjectModel(Permission.name) private permissionModel: Model<Permission>,
        private permissionCacheService: PermissionCacheService,
    ) { }

    async findAll(page = 1, limit = 10, search?: string): Promise<{ data: Permission[]; total: number }> {
        const skip = (page - 1) * limit;
        const query = search
            ? {
                $or: [
                    { code: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { module: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const [data, total] = await Promise.all([
            this.permissionModel.find(query).skip(skip).limit(limit).exec(),
            this.permissionModel.countDocuments(query),
        ]);

        return { data, total };
    }

    async findById(id: string): Promise<Permission | null> {
        return this.permissionModel.findById(id).exec();
    }

    async create(permissionData: Partial<Permission>): Promise<Permission> {
        const newPermission = new this.permissionModel(permissionData);
        return newPermission.save();
    }

    async update(id: string, permissionData: Partial<Permission>): Promise<Permission | null> {
        return this.permissionModel.findByIdAndUpdate(id, permissionData, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.permissionModel.findByIdAndDelete(id);
    }

    async getPermissionsForRoles(roleIds: string[]): Promise<string[]> {
        const allPermissions = new Set<string>();

        for (const roleId of roleIds) {
            let permissions = await this.permissionCacheService.getPermissions(roleId);

            if (!permissions) {
                permissions = await this.resolveRolePermissionsFromDb(roleId);
                await this.permissionCacheService.setPermissions(roleId, permissions);
            }

            permissions.forEach((p) => allPermissions.add(p));
        }

        return Array.from(allPermissions);
    }

    private async resolveRolePermissionsFromDb(roleId: string): Promise<string[]> {
        const role = await this.roleModel
            .findById(roleId)
            .populate('permissions')
            .exec();

        if (!role) return [];

        return (role.permissions as unknown as Permission[])
            .filter((p) => p.status === 'active')
            .map((p) => p.code);
    }
}
