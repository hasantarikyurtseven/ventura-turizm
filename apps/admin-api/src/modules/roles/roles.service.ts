import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role.name) private roleModel: Model<Role>) { }

    async findAll(page = 1, limit = 10, search?: string): Promise<{ data: Role[]; total: number }> {
        const skip = (page - 1) * limit;
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const [data, total] = await Promise.all([
            this.roleModel.find(query).skip(skip).limit(limit).populate('permissions.permissionId').exec(),
            this.roleModel.countDocuments(query),
        ]);

        return { data, total };
    }

    async findById(id: string): Promise<Role | null> {
        return this.roleModel.findById(id).populate('permissions.permissionId').exec();
    }

    async create(roleData: Partial<Role>): Promise<Role> {
        const newRole = new this.roleModel(roleData);
        return newRole.save();
    }

    async update(id: string, roleData: Partial<Role>): Promise<Role | null> {
        return this.roleModel.findByIdAndUpdate(id, roleData, { new: true }).populate('permissions.permissionId').exec();
    }

    async delete(id: string): Promise<void> {
        await this.roleModel.findByIdAndDelete(id);
    }
}
