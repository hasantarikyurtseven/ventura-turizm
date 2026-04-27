import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PermissionCacheService {
    private readonly logger = new Logger(PermissionCacheService.name);

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async getPermissions(roleId: string): Promise<string[] | undefined> {
        const key = `role:${roleId}:permissions`;
        return this.cacheManager.get<string[]>(key);
    }

    async setPermissions(roleId: string, permissions: string[]): Promise<void> {
        const key = `role:${roleId}:permissions`;
        await this.cacheManager.set(key, permissions, 0); // No expiry by default
        this.logger.log(`Permissions cached for role: ${roleId}`);
    }

    async invalidateRole(roleId: string): Promise<void> {
        const key = `role:${roleId}:permissions`;
        await this.cacheManager.del(key);
        this.logger.log(`Permissions invalidated for role: ${roleId}`);
    }
}
