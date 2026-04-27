import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findAll(page = 1, limit = 10, search?: string): Promise<{ data: User[]; total: number }> {
        const skip = (page - 1) * limit;
        const query = search
            ? {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                    { surName: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const [data, total] = await Promise.all([
            this.userModel.find(query).skip(skip).limit(limit).select('-passwordHash').populate('roles.roleId', 'name description').exec(),
            this.userModel.countDocuments(query),
        ]);

        return { data, total };
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).select('-passwordHash').populate('roles.roleId', 'name description').exec();
    }

    async create(userData: Partial<User>): Promise<User> {
        const rounds = 10;
        if (userData.passwordHash) {
            userData.passwordHash = await bcrypt.hash(userData.passwordHash, rounds);
        }
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        if (userData.passwordHash) {
            const rounds = 10;
            userData.passwordHash = await bcrypt.hash(userData.passwordHash, rounds);
        }
        return this.userModel.findByIdAndUpdate(id, userData, { new: true }).select('-passwordHash').populate('roles.roleId', 'name description').exec();
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
        // Get user with password
        const user = await this.userModel.findById(userId).exec();
        
        if (!user) {
            throw new BadRequestException('Kullanıcı bulunamadı');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Mevcut şifre yanlış');
        }

        // Hash and update new password
        const rounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, rounds);
        await this.userModel.findByIdAndUpdate(userId, { passwordHash: hashedPassword });

        return { message: 'Şifre başarıyla değiştirildi' };
    }
}
