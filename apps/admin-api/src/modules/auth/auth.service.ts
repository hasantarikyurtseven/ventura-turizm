import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './schemas/refresh-token.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
    ) { }

    async login(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException({
                message: 'Kullanıcı adı veya şifre hatalı',
                error: 'INVALID_CREDENTIALS',
                statusCode: 401,
            });
        }

        if (user.status !== 'active') {
            throw new ForbiddenException({
                message: 'Hesabınız pasif durumda. Lütfen yönetici ile iletişime geçin.',
                error: 'USER_INACTIVE',
                statusCode: 403,
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException({
                message: 'Kullanıcı adı veya şifre hatalı',
                error: 'INVALID_CREDENTIALS',
                statusCode: 401,
            });
        }

        await this.usersService.updateLastLogin((user as any)._id);

        return this.generateTokens(user);
    }

    async refresh(token: string) {
        const hash = this.hashToken(token);
        const storedToken = await this.refreshTokenModel.findOne({
            tokenHash: hash,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        });

        if (!storedToken) {
            throw new UnauthorizedException({
                message: 'Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.',
                error: 'INVALID_REFRESH_TOKEN',
                statusCode: 401,
            });
        }

        const user = await this.usersService.findById(storedToken.ownerId.toString());
        if (!user || user.status !== 'active') {
            throw new UnauthorizedException({
                message: 'Kullanıcı hesabı artık aktif değil veya bulunamadı.',
                error: 'USER_UNAVAILABLE',
                statusCode: 401,
            });
        }

        // Rotate refresh token
        storedToken.revokedAt = new Date();
        await storedToken.save();

        return this.generateTokens(user);
    }

    async logout(token: string) {
        const hash = this.hashToken(token);
        await this.refreshTokenModel.findOneAndUpdate(
            { tokenHash: hash },
            { revokedAt: new Date() },
        );
    }

    private async generateTokens(user: User) {
        const payload = {
            sub: (user as any)._id,
            username: user.username,
            name: user.name,
            surName: user.surName,
            roles: user.roles.map((r) => r.roleId.toString()),
            tokenType: 'admin_access',
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomBytes(40).toString('hex');

        // Store refresh token hash
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 12); // 12 hours absolute expiry

        await new this.refreshTokenModel({
            ownerId: (user as any)._id,
            ownerType: 'admin',
            tokenHash: this.hashToken(refreshToken),
            expiresAt,
        }).save();

        return {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes
        };
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}
