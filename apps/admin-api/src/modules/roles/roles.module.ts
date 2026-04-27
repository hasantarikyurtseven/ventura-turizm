import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionCacheService } from './services/permission-cache.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
    controllers: [RolesController],
    providers: [RolesService, PermissionCacheService],
    exports: [MongooseModule, PermissionCacheService, RolesService],
})
export class RolesModule { }
