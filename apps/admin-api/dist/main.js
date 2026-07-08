/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.controller.ts"
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ },

/***/ "./src/app.module.ts"
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppModule_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const cache_manager_1 = __webpack_require__(/*! @nestjs/cache-manager */ "@nestjs/cache-manager");
const cache_manager_redis_yet_1 = __webpack_require__(/*! cache-manager-redis-yet */ "cache-manager-redis-yet");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./modules/users/users.module */ "./src/modules/users/users.module.ts");
const audit_logs_module_1 = __webpack_require__(/*! ./modules/audit-logs/audit-logs.module */ "./src/modules/audit-logs/audit-logs.module.ts");
const permissions_module_1 = __webpack_require__(/*! ./modules/permissions/permissions.module */ "./src/modules/permissions/permissions.module.ts");
const roles_module_1 = __webpack_require__(/*! ./modules/roles/roles.module */ "./src/modules/roles/roles.module.ts");
const dashboard_module_1 = __webpack_require__(/*! ./modules/dashboard/dashboard.module */ "./src/modules/dashboard/dashboard.module.ts");
const airlines_module_1 = __webpack_require__(/*! ./modules/airlines/airlines.module */ "./src/modules/airlines/airlines.module.ts");
const countries_module_1 = __webpack_require__(/*! ./modules/countries/countries.module */ "./src/modules/countries/countries.module.ts");
const contracts_module_1 = __webpack_require__(/*! ./modules/contracts/contracts.module */ "./src/modules/contracts/contracts.module.ts");
const members_module_1 = __webpack_require__(/*! ./modules/members/members.module */ "./src/modules/members/members.module.ts");
const reservations_module_1 = __webpack_require__(/*! ./modules/reservations/reservations.module */ "./src/modules/reservations/reservations.module.ts");
const admin_notifications_module_1 = __webpack_require__(/*! ./modules/admin-notifications/admin-notifications.module */ "./src/modules/admin-notifications/admin-notifications.module.ts");
const audit_log_interceptor_1 = __webpack_require__(/*! ./modules/audit-logs/interceptors/audit-log.interceptor */ "./src/modules/audit-logs/interceptors/audit-log.interceptor.ts");
const audit_log_exception_filter_1 = __webpack_require__(/*! ./modules/audit-logs/filters/audit-log-exception.filter */ "./src/modules/audit-logs/filters/audit-log-exception.filter.ts");
let AppModule = AppModule_1 = class AppModule {
    connection;
    logger = new common_1.Logger(AppModule_1.name);
    constructor(connection) {
        this.connection = connection;
    }
    onModuleInit() {
        this.connection.on('connected', () => {
            this.logger.log('✅ MongoDB connected successfully');
        });
        this.connection.on('error', (err) => {
            this.logger.error('❌ MongoDB connection error:', err);
        });
        if (this.connection.readyState === 1) {
            this.logger.log('✅ MongoDB already connected');
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async (configService) => ({
                    store: await (0, cache_manager_redis_yet_1.redisStore)({
                        url: `redis://${configService.get('REDIS_HOST', 'redis')}:${configService.get('REDIS_PORT', 6379)}`,
                    }),
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            audit_logs_module_1.AuditLogsModule,
            permissions_module_1.PermissionsModule,
            roles_module_1.RolesModule,
            dashboard_module_1.DashboardModule,
            airlines_module_1.AirlinesModule,
            countries_module_1.CountriesModule,
            contracts_module_1.ContractsModule,
            members_module_1.MembersModule,
            reservations_module_1.ReservationsModule,
            admin_notifications_module_1.AdminNotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_log_interceptor_1.AuditLogInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: audit_log_exception_filter_1.AuditLogExceptionFilter,
            },
        ],
    }),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Connection !== "undefined" && mongoose_2.Connection) === "function" ? _a : Object])
], AppModule);


/***/ },

/***/ "./src/app.service.ts"
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ },

/***/ "./src/modules/admin-notifications/admin-notifications.controller.ts"
/*!***************************************************************************!*\
  !*** ./src/modules/admin-notifications/admin-notifications.controller.ts ***!
  \***************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminNotificationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const admin_notifications_service_1 = __webpack_require__(/*! ./admin-notifications.service */ "./src/modules/admin-notifications/admin-notifications.service.ts");
let AdminNotificationsController = class AdminNotificationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async list(limit) {
        const n = limit ? parseInt(limit, 10) : 50;
        return this.service.listForAdmin(Number.isFinite(n) && n > 0 ? n : 50);
    }
    async markOneRead(id) {
        await this.service.markRead(id);
        return { success: true };
    }
    async markAllRead() {
        await this.service.markAllRead();
        return { success: true };
    }
};
exports.AdminNotificationsController = AdminNotificationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminNotificationsController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminNotificationsController.prototype, "markOneRead", null);
__decorate([
    (0, common_1.Post)('mark-all-read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminNotificationsController.prototype, "markAllRead", null);
exports.AdminNotificationsController = AdminNotificationsController = __decorate([
    (0, common_1.Controller)('admin/notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_notifications_service_1.AdminNotificationsService !== "undefined" && admin_notifications_service_1.AdminNotificationsService) === "function" ? _a : Object])
], AdminNotificationsController);


/***/ },

/***/ "./src/modules/admin-notifications/admin-notifications.module.ts"
/*!***********************************************************************!*\
  !*** ./src/modules/admin-notifications/admin-notifications.module.ts ***!
  \***********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminNotificationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const admin_notification_schema_1 = __webpack_require__(/*! ./schemas/admin-notification.schema */ "./src/modules/admin-notifications/schemas/admin-notification.schema.ts");
const admin_notifications_service_1 = __webpack_require__(/*! ./admin-notifications.service */ "./src/modules/admin-notifications/admin-notifications.service.ts");
const admin_notifications_controller_1 = __webpack_require__(/*! ./admin-notifications.controller */ "./src/modules/admin-notifications/admin-notifications.controller.ts");
let AdminNotificationsModule = class AdminNotificationsModule {
};
exports.AdminNotificationsModule = AdminNotificationsModule;
exports.AdminNotificationsModule = AdminNotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: admin_notification_schema_1.AdminNotification.name, schema: admin_notification_schema_1.AdminNotificationSchema },
            ]),
        ],
        controllers: [admin_notifications_controller_1.AdminNotificationsController],
        providers: [admin_notifications_service_1.AdminNotificationsService],
        exports: [admin_notifications_service_1.AdminNotificationsService],
    })
], AdminNotificationsModule);


/***/ },

/***/ "./src/modules/admin-notifications/admin-notifications.service.ts"
/*!************************************************************************!*\
  !*** ./src/modules/admin-notifications/admin-notifications.service.ts ***!
  \************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminNotificationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const admin_notification_schema_1 = __webpack_require__(/*! ./schemas/admin-notification.schema */ "./src/modules/admin-notifications/schemas/admin-notification.schema.ts");
let AdminNotificationsService = class AdminNotificationsService {
    model;
    constructor(model) {
        this.model = model;
    }
    async listForAdmin(limit = 50) {
        const n = Math.min(Math.max(Number(limit) || 50, 1), 100);
        const rows = await this.model
            .find()
            .sort({ createdAt: -1 })
            .limit(n)
            .lean()
            .exec();
        return rows.map((doc) => ({
            id: doc._id.toString(),
            message: doc.message,
            icon: doc.icon || 'notifications',
            read: !!doc.read,
            time: this.getTimeAgo(doc.createdAt),
            bookingCode: doc.bookingCode ?? null,
            reservationId: doc.reservationId ?? null,
            createdAt: doc.createdAt,
        }));
    }
    async markRead(id) {
        await this.model.updateOne({ _id: id }, { $set: { read: true } }).exec();
    }
    async markAllRead() {
        await this.model.updateMany({ read: false }, { $set: { read: true } }).exec();
    }
    getTimeAgo(date) {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0)
            return `${days} gün önce`;
        if (hours > 0)
            return `${hours} saat önce`;
        if (minutes > 0)
            return `${minutes} dakika önce`;
        if (seconds > 5)
            return `${seconds} saniye önce`;
        return 'Az önce';
    }
};
exports.AdminNotificationsService = AdminNotificationsService;
exports.AdminNotificationsService = AdminNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_notification_schema_1.AdminNotification.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AdminNotificationsService);


/***/ },

/***/ "./src/modules/admin-notifications/schemas/admin-notification.schema.ts"
/*!******************************************************************************!*\
  !*** ./src/modules/admin-notifications/schemas/admin-notification.schema.ts ***!
  \******************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminNotificationSchema = exports.AdminNotification = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let AdminNotification = class AdminNotification {
    kind;
    message;
    icon;
    read;
    bookingCode;
    reservationId;
};
exports.AdminNotification = AdminNotification;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdminNotification.prototype, "kind", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdminNotification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'confirmation_number' }),
    __metadata("design:type", String)
], AdminNotification.prototype, "icon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], AdminNotification.prototype, "read", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], AdminNotification.prototype, "bookingCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], AdminNotification.prototype, "reservationId", void 0);
exports.AdminNotification = AdminNotification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'admin_notifications' })
], AdminNotification);
exports.AdminNotificationSchema = mongoose_1.SchemaFactory.createForClass(AdminNotification);
exports.AdminNotificationSchema.index({ createdAt: -1 });
exports.AdminNotificationSchema.index({ read: 1, createdAt: -1 });


/***/ },

/***/ "./src/modules/airlines/airlines.controller.ts"
/*!*****************************************************!*\
  !*** ./src/modules/airlines/airlines.controller.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirlinesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const airlines_service_1 = __webpack_require__(/*! ./airlines.service */ "./src/modules/airlines/airlines.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let AirlinesController = class AirlinesController {
    airlinesService;
    constructor(airlinesService) {
        this.airlinesService = airlinesService;
    }
    async findAll(page = 1, limit = 50, search) {
        return this.airlinesService.findAll(+page, +limit, search);
    }
    async findOne(id) {
        return this.airlinesService.findById(id);
    }
    async create(data) {
        return this.airlinesService.create(data);
    }
    async update(id, data) {
        return this.airlinesService.update(id, data);
    }
    async delete(id) {
        await this.airlinesService.delete(id);
        return { message: 'Havayolu silindi.' };
    }
};
exports.AirlinesController = AirlinesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AirlinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AirlinesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AirlinesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AirlinesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AirlinesController.prototype, "delete", null);
exports.AirlinesController = AirlinesController = __decorate([
    (0, common_1.Controller)('admin/airlines'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof airlines_service_1.AirlinesService !== "undefined" && airlines_service_1.AirlinesService) === "function" ? _a : Object])
], AirlinesController);


/***/ },

/***/ "./src/modules/airlines/airlines.module.ts"
/*!*************************************************!*\
  !*** ./src/modules/airlines/airlines.module.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirlinesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const airlines_service_1 = __webpack_require__(/*! ./airlines.service */ "./src/modules/airlines/airlines.service.ts");
const airlines_controller_1 = __webpack_require__(/*! ./airlines.controller */ "./src/modules/airlines/airlines.controller.ts");
const airline_schema_1 = __webpack_require__(/*! ./schemas/airline.schema */ "./src/modules/airlines/schemas/airline.schema.ts");
let AirlinesModule = class AirlinesModule {
};
exports.AirlinesModule = AirlinesModule;
exports.AirlinesModule = AirlinesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: airline_schema_1.Airline.name, schema: airline_schema_1.AirlineSchema }])],
        controllers: [airlines_controller_1.AirlinesController],
        providers: [airlines_service_1.AirlinesService],
        exports: [airlines_service_1.AirlinesService],
    })
], AirlinesModule);


/***/ },

/***/ "./src/modules/airlines/airlines.service.ts"
/*!**************************************************!*\
  !*** ./src/modules/airlines/airlines.service.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirlinesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const airline_schema_1 = __webpack_require__(/*! ./schemas/airline.schema */ "./src/modules/airlines/schemas/airline.schema.ts");
let AirlinesService = class AirlinesService {
    airlineModel;
    constructor(airlineModel) {
        this.airlineModel = airlineModel;
    }
    async findAll(page = 1, limit = 50, search) {
        const skip = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit));
        const l = Math.min(100, Math.max(1, limit));
        const query = {};
        if (search && search.trim()) {
            const s = search.trim();
            query.$or = [
                { code: new RegExp(s, 'i') },
                { name: new RegExp(s, 'i') },
            ];
        }
        const [data, total] = await Promise.all([
            this.airlineModel.find(query).sort({ code: 1 }).skip(skip).limit(l).lean().exec(),
            this.airlineModel.countDocuments(query),
        ]);
        return { data: data, total };
    }
    async findById(id) {
        return this.airlineModel.findById(id).lean().exec();
    }
    async findByCode(code) {
        return this.airlineModel.findOne({ code: code?.trim().toUpperCase() }).lean().exec();
    }
    async create(data) {
        const code = (data.code || '').trim().toUpperCase();
        const existing = await this.airlineModel.findOne({ code }).exec();
        if (existing) {
            throw new Error('Bu havayolu kodu zaten kayıtlı.');
        }
        const doc = new this.airlineModel({ ...data, code });
        return doc.save();
    }
    async update(id, data) {
        if (data.code)
            data.code = data.code.trim().toUpperCase();
        return this.airlineModel
            .findByIdAndUpdate(id, data, { new: true })
            .lean()
            .exec();
    }
    async delete(id) {
        await this.airlineModel.findByIdAndDelete(id).exec();
    }
};
exports.AirlinesService = AirlinesService;
exports.AirlinesService = AirlinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(airline_schema_1.Airline.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AirlinesService);


/***/ },

/***/ "./src/modules/airlines/schemas/airline.schema.ts"
/*!********************************************************!*\
  !*** ./src/modules/airlines/schemas/airline.schema.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirlineSchema = exports.Airline = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Airline = class Airline extends mongoose_2.Document {
    code;
    name;
    logoUrl;
    status;
    createdBy;
    updatedBy;
};
exports.Airline = Airline;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, uppercase: true, trim: true }),
    __metadata("design:type", String)
], Airline.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Airline.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Airline.prototype, "logoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active', enum: ['active', 'passive'] }),
    __metadata("design:type", String)
], Airline.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Airline.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Airline.prototype, "updatedBy", void 0);
exports.Airline = Airline = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'airlines' })
], Airline);
exports.AirlineSchema = mongoose_1.SchemaFactory.createForClass(Airline);


/***/ },

/***/ "./src/modules/audit-logs/audit-logs.module.ts"
/*!*****************************************************!*\
  !*** ./src/modules/audit-logs/audit-logs.module.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const audit_logs_service_1 = __webpack_require__(/*! ./audit-logs.service */ "./src/modules/audit-logs/audit-logs.service.ts");
const audit_log_schema_1 = __webpack_require__(/*! ./schemas/audit-log.schema */ "./src/modules/audit-logs/schemas/audit-log.schema.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
let AuditLogsModule = class AuditLogsModule {
};
exports.AuditLogsModule = AuditLogsModule;
exports.AuditLogsModule = AuditLogsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema }]),
            users_module_1.UsersModule,
        ],
        providers: [audit_logs_service_1.AuditLogService],
        exports: [audit_logs_service_1.AuditLogService],
    })
], AuditLogsModule);


/***/ },

/***/ "./src/modules/audit-logs/audit-logs.service.ts"
/*!******************************************************!*\
  !*** ./src/modules/audit-logs/audit-logs.service.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const audit_log_schema_1 = __webpack_require__(/*! ./schemas/audit-log.schema */ "./src/modules/audit-logs/schemas/audit-log.schema.ts");
let AuditLogService = class AuditLogService {
    auditLogModel;
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async log(data) {
        const actorIdStr = data.actorId;
        const entityIdStr = data.entityId;
        const log = new this.auditLogModel({
            ...data,
            actorType: 'admin',
            actorId: typeof actorIdStr === 'string' && mongoose_2.Types.ObjectId.isValid(actorIdStr)
                ? new mongoose_2.Types.ObjectId(actorIdStr)
                : null,
            entityId: typeof entityIdStr === 'string' && mongoose_2.Types.ObjectId.isValid(entityIdStr)
                ? new mongoose_2.Types.ObjectId(entityIdStr)
                : null,
        });
        return log.save();
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AuditLogService);


/***/ },

/***/ "./src/modules/audit-logs/filters/audit-log-exception.filter.ts"
/*!**********************************************************************!*\
  !*** ./src/modules/audit-logs/filters/audit-log-exception.filter.ts ***!
  \**********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuditLogExceptionFilter_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const audit_logs_service_1 = __webpack_require__(/*! ../audit-logs.service */ "./src/modules/audit-logs/audit-logs.service.ts");
const users_service_1 = __webpack_require__(/*! ../../users/users.service */ "./src/modules/users/users.service.ts");
let AuditLogExceptionFilter = AuditLogExceptionFilter_1 = class AuditLogExceptionFilter {
    auditLogService;
    usersService;
    logger = new common_1.Logger(AuditLogExceptionFilter_1.name);
    constructor(auditLogService, usersService) {
        this.auditLogService = auditLogService;
        this.usersService = usersService;
    }
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Bilinmeyen bir hata oluştu';
        const errorMessage = typeof message === 'string' ? message : message.message || 'Hata oluştu';
        const errorDetails = typeof message === 'object' ? message : { message: errorMessage };
        await this.logFailedOperation(request, status, errorMessage, exception);
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: errorMessage,
            ...(process.env.NODE_ENV === 'development' && { details: errorDetails }),
        });
    }
    async logFailedOperation(request, status, errorMessage, exception) {
        try {
            const { method, url, body, user } = request;
            if (status < 400) {
                return;
            }
            let action = 'UNKNOWN_ERROR';
            let entityType = 'Unknown';
            let actorId = null;
            if (url.includes('/admin/auth/login') && method === 'POST') {
                action = 'LOGIN_FAILED';
                entityType = 'User';
                const username = body?.username || 'Unknown';
                let actorId = null;
                try {
                    const user = await this.usersService.findByUsername(username);
                    if (user) {
                        actorId = user._id.toString();
                    }
                }
                catch (userError) {
                }
                try {
                    await this.auditLogService.log({
                        actorId: actorId,
                        action: action,
                        entityType: entityType,
                        message: `Giriş başarısız: ${username} - ${errorMessage}`,
                        metadata: {
                            username: username,
                            statusCode: status,
                            error: errorMessage,
                            ip: request.ip || request.headers['x-forwarded-for'] || 'Unknown',
                        },
                    });
                }
                catch (logError) {
                    this.logger.error('Failed to log audit entry', logError);
                }
                return;
            }
            if (user && user.userId) {
                actorId = user.userId;
                if (url.includes('/admin/users')) {
                    entityType = 'User';
                    if (method === 'POST')
                        action = 'CREATE_USER_FAILED';
                    else if (method === 'PUT')
                        action = 'UPDATE_USER_FAILED';
                    else if (method === 'DELETE')
                        action = 'DELETE_USER_FAILED';
                }
                else if (url.includes('/admin/roles')) {
                    entityType = 'Role';
                    if (method === 'POST')
                        action = 'CREATE_ROLE_FAILED';
                    else if (method === 'PUT')
                        action = 'UPDATE_ROLE_FAILED';
                    else if (method === 'DELETE')
                        action = 'DELETE_ROLE_FAILED';
                }
                else if (url.includes('/admin/permissions')) {
                    entityType = 'Permission';
                    if (method === 'POST')
                        action = 'CREATE_PERMISSION_FAILED';
                    else if (method === 'PUT')
                        action = 'UPDATE_PERMISSION_FAILED';
                    else if (method === 'DELETE')
                        action = 'DELETE_PERMISSION_FAILED';
                }
                else if (url.includes('/admin/dashboard')) {
                    entityType = 'Dashboard';
                    action = 'DASHBOARD_ACCESS_FAILED';
                }
                else if (url.includes('/admin/airlines')) {
                    entityType = 'Airline';
                    if (method === 'POST')
                        action = 'CREATE_AIRLINE_FAILED';
                    else if (method === 'PUT')
                        action = 'UPDATE_AIRLINE_FAILED';
                    else if (method === 'DELETE')
                        action = 'DELETE_AIRLINE_FAILED';
                }
                await this.auditLogService.log({
                    actorId: actorId || undefined,
                    action: action,
                    entityType: entityType,
                    message: `İşlem başarısız: ${errorMessage}`,
                    metadata: {
                        method,
                        url,
                        statusCode: status,
                        error: errorMessage,
                        ip: request.ip || request.headers['x-forwarded-for'] || 'Unknown',
                    },
                });
            }
        }
        catch (logError) {
            this.logger.error('Failed to log audit entry for exception', logError);
        }
    }
};
exports.AuditLogExceptionFilter = AuditLogExceptionFilter;
exports.AuditLogExceptionFilter = AuditLogExceptionFilter = AuditLogExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __param(1, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [typeof (_a = typeof audit_logs_service_1.AuditLogService !== "undefined" && audit_logs_service_1.AuditLogService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], AuditLogExceptionFilter);


/***/ },

/***/ "./src/modules/audit-logs/interceptors/audit-log.interceptor.ts"
/*!**********************************************************************!*\
  !*** ./src/modules/audit-logs/interceptors/audit-log.interceptor.ts ***!
  \**********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuditLogInterceptor_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
const audit_logs_service_1 = __webpack_require__(/*! ../audit-logs.service */ "./src/modules/audit-logs/audit-logs.service.ts");
let AuditLogInterceptor = AuditLogInterceptor_1 = class AuditLogInterceptor {
    auditLogService;
    logger = new common_1.Logger(AuditLogInterceptor_1.name);
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const { method, url, user, body, params } = req;
        return next.handle().pipe((0, operators_1.tap)(async (data) => {
            try {
                if (url.includes('/admin/auth/login') && method === 'POST') {
                    if (data?.accessToken) {
                        try {
                            const payload = JSON.parse(Buffer.from(data.accessToken.split('.')[1], 'base64').toString());
                            await this.auditLogService.log({
                                actorId: payload.sub,
                                action: 'LOGIN_SUCCESS',
                                entityType: 'User',
                                entityId: payload.sub,
                                message: `Başarılı giriş: ${payload.username}`,
                            });
                        }
                        catch (error) {
                        }
                    }
                    return;
                }
                if (url.includes('/admin/auth/logout') && method === 'POST') {
                    if (user && user.userId) {
                        await this.auditLogService.log({
                            actorId: user.userId,
                            action: 'LOGOUT',
                            entityType: 'User',
                            entityId: user.userId,
                            message: `Çıkış yapıldı: ${user.username}`,
                        });
                    }
                    return;
                }
                if (user && user.userId) {
                    const actorId = user.userId;
                    let action = '';
                    let entityType = '';
                    let entityId = null;
                    let message = '';
                    if (url.includes('/admin/users')) {
                        entityType = 'User';
                        if (method === 'POST') {
                            action = 'CREATE_USER';
                            entityId = data?._id || null;
                            message = `Yeni kullanıcı oluşturuldu: ${body?.username || body?.email || 'Bilinmeyen'}`;
                        }
                        else if (method === 'PUT') {
                            action = 'UPDATE_USER';
                            entityId = params?.id || null;
                            message = `Kullanıcı güncellendi: ${params?.id || 'Bilinmeyen'}`;
                        }
                        else if (method === 'DELETE') {
                            action = 'DELETE_USER';
                            entityId = params?.id || null;
                            message = `Kullanıcı silindi: ${params?.id || 'Bilinmeyen'}`;
                        }
                        else if (method === 'GET' && params?.id) {
                            action = 'VIEW_USER';
                            entityId = params.id;
                            message = `Kullanıcı görüntülendi: ${params.id}`;
                        }
                    }
                    else if (url.includes('/admin/roles')) {
                        entityType = 'Role';
                        if (method === 'POST') {
                            action = 'CREATE_ROLE';
                            entityId = data?._id || null;
                            message = `Yeni rol oluşturuldu: ${body?.name || 'Bilinmeyen'}`;
                        }
                        else if (method === 'PUT') {
                            action = 'UPDATE_ROLE';
                            entityId = params?.id || null;
                            message = `Rol güncellendi: ${params?.id || 'Bilinmeyen'}`;
                        }
                        else if (method === 'DELETE') {
                            action = 'DELETE_ROLE';
                            entityId = params?.id || null;
                            message = `Rol silindi: ${params?.id || 'Bilinmeyen'}`;
                        }
                    }
                    else if (url.includes('/admin/permissions')) {
                        entityType = 'Permission';
                        if (method === 'POST') {
                            action = 'CREATE_PERMISSION';
                            entityId = data?._id || null;
                            message = `Yeni izin oluşturuldu: ${body?.code || body?.name || 'Bilinmeyen'}`;
                        }
                        else if (method === 'PUT') {
                            action = 'UPDATE_PERMISSION';
                            entityId = params?.id || null;
                            message = `İzin güncellendi: ${params?.id || 'Bilinmeyen'}`;
                        }
                        else if (method === 'DELETE') {
                            action = 'DELETE_PERMISSION';
                            entityId = params?.id || null;
                            message = `İzin silindi: ${params?.id || 'Bilinmeyen'}`;
                        }
                    }
                    else if (url.includes('/admin/users') && url.includes('/password') && method === 'PUT') {
                        entityType = 'User';
                        action = 'CHANGE_PASSWORD';
                        entityId = params?.id || null;
                        message = `Şifre değiştirildi: ${params?.id || 'Bilinmeyen'}`;
                    }
                    else if (url.includes('/admin/airlines')) {
                        entityType = 'Airline';
                        if (method === 'POST') {
                            action = 'CREATE_AIRLINE';
                            entityId = data?._id || null;
                            message = `Havayolu eklendi: ${body?.code || body?.name || 'Bilinmeyen'}`;
                        }
                        else if (method === 'PUT') {
                            action = 'UPDATE_AIRLINE';
                            entityId = params?.id || null;
                            message = `Havayolu güncellendi: ${params?.id || 'Bilinmeyen'}`;
                        }
                        else if (method === 'DELETE') {
                            action = 'DELETE_AIRLINE';
                            entityId = params?.id || null;
                            message = `Havayolu silindi: ${params?.id || 'Bilinmeyen'}`;
                        }
                    }
                    if (action && entityType) {
                        await this.auditLogService.log({
                            actorId: actorId,
                            action: action,
                            entityType: entityType,
                            entityId: entityId || undefined,
                            message: message,
                        });
                    }
                }
            }
            catch (error) {
                this.logger.error('Audit log error', error);
            }
        }));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = AuditLogInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof audit_logs_service_1.AuditLogService !== "undefined" && audit_logs_service_1.AuditLogService) === "function" ? _a : Object])
], AuditLogInterceptor);


/***/ },

/***/ "./src/modules/audit-logs/schemas/audit-log.schema.ts"
/*!************************************************************!*\
  !*** ./src/modules/audit-logs/schemas/audit-log.schema.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogSchema = exports.AuditLog = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let AuditLog = class AuditLog extends mongoose_2.Document {
    actorType;
    actorId;
    action;
    entityType;
    entityId;
    message;
    metadata;
};
exports.AuditLog = AuditLog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'admin' }),
    __metadata("design:type", String)
], AuditLog.prototype, "actorType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: false }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], AuditLog.prototype, "actorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AuditLog.prototype, "metadata", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: { createdAt: true, updatedAt: false }, collection: 'audit_logs' })
], AuditLog);
exports.AuditLogSchema = mongoose_1.SchemaFactory.createForClass(AuditLog);


/***/ },

/***/ "./src/modules/auth/auth.controller.ts"
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ./guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        return this.authService.login(body.username, body.password);
    }
    async refresh(body) {
        return this.authService.refresh(body.refreshToken);
    }
    async logout(body) {
        return this.authService.logout(body.refreshToken);
    }
    async getMe(req) {
        return req.user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ },

/***/ "./src/modules/auth/auth.module.ts"
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
const refresh_token_schema_1 = __webpack_require__(/*! ./schemas/refresh-token.schema */ "./src/modules/auth/schemas/refresh-token.schema.ts");
const permissions_module_1 = __webpack_require__(/*! ../permissions/permissions.module */ "./src/modules/permissions/permissions.module.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            permissions_module_1.PermissionsModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET', 'secret'),
                    signOptions: { expiresIn: '15m' },
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([{ name: refresh_token_schema_1.RefreshToken.name, schema: refresh_token_schema_1.RefreshTokenSchema }]),
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ },

/***/ "./src/modules/auth/auth.service.ts"
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/modules/users/users.service.ts");
const refresh_token_schema_1 = __webpack_require__(/*! ./schemas/refresh-token.schema */ "./src/modules/auth/schemas/refresh-token.schema.ts");
let AuthService = class AuthService {
    usersService;
    jwtService;
    refreshTokenModel;
    constructor(usersService, jwtService, refreshTokenModel) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.refreshTokenModel = refreshTokenModel;
    }
    async login(username, password) {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new common_1.UnauthorizedException({
                message: 'Kullanıcı adı veya şifre hatalı',
                error: 'INVALID_CREDENTIALS',
                statusCode: 401,
            });
        }
        if (user.status !== 'active') {
            throw new common_1.ForbiddenException({
                message: 'Hesabınız pasif durumda. Lütfen yönetici ile iletişime geçin.',
                error: 'USER_INACTIVE',
                statusCode: 403,
            });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException({
                message: 'Kullanıcı adı veya şifre hatalı',
                error: 'INVALID_CREDENTIALS',
                statusCode: 401,
            });
        }
        await this.usersService.updateLastLogin(user._id);
        return this.generateTokens(user);
    }
    async refresh(token) {
        const hash = this.hashToken(token);
        const storedToken = await this.refreshTokenModel.findOne({
            tokenHash: hash,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException({
                message: 'Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.',
                error: 'INVALID_REFRESH_TOKEN',
                statusCode: 401,
            });
        }
        const user = await this.usersService.findById(storedToken.ownerId.toString());
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException({
                message: 'Kullanıcı hesabı artık aktif değil veya bulunamadı.',
                error: 'USER_UNAVAILABLE',
                statusCode: 401,
            });
        }
        storedToken.revokedAt = new Date();
        await storedToken.save();
        return this.generateTokens(user);
    }
    async logout(token) {
        const hash = this.hashToken(token);
        await this.refreshTokenModel.findOneAndUpdate({ tokenHash: hash }, { revokedAt: new Date() });
    }
    async generateTokens(user) {
        const payload = {
            sub: user._id,
            username: user.username,
            name: user.name,
            surName: user.surName,
            roles: user.roles.map((r) => r.roleId.toString()),
            tokenType: 'admin_access',
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 12);
        await new this.refreshTokenModel({
            ownerId: user._id,
            ownerType: 'admin',
            tokenHash: this.hashToken(refreshToken),
            expiresAt,
        }).save();
        return {
            accessToken,
            refreshToken,
            expiresIn: 900,
        };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(refresh_token_schema_1.RefreshToken.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], AuthService);


/***/ },

/***/ "./src/modules/auth/guards/jwt-auth.guard.ts"
/*!***************************************************!*\
  !*** ./src/modules/auth/guards/jwt-auth.guard.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ },

/***/ "./src/modules/auth/schemas/refresh-token.schema.ts"
/*!**********************************************************!*\
  !*** ./src/modules/auth/schemas/refresh-token.schema.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenSchema = exports.RefreshToken = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let RefreshToken = class RefreshToken extends mongoose_2.Document {
    ownerType;
    ownerId;
    tokenHash;
    expiresAt;
    revokedAt;
};
exports.RefreshToken = RefreshToken;
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'admin' }),
    __metadata("design:type", String)
], RefreshToken.prototype, "ownerType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], RefreshToken.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], RefreshToken.prototype, "tokenHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], RefreshToken.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], RefreshToken.prototype, "revokedAt", void 0);
exports.RefreshToken = RefreshToken = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'refresh_tokens' })
], RefreshToken);
exports.RefreshTokenSchema = mongoose_1.SchemaFactory.createForClass(RefreshToken);


/***/ },

/***/ "./src/modules/auth/strategies/jwt.strategy.ts"
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET', 'secret'),
        });
    }
    async validate(payload) {
        if (payload.tokenType !== 'admin_access') {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
        return { userId: payload.sub, username: payload.username, roles: payload.roles };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ },

/***/ "./src/modules/contracts/contracts.controller.ts"
/*!*******************************************************!*\
  !*** ./src/modules/contracts/contracts.controller.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const contracts_service_1 = __webpack_require__(/*! ./contracts.service */ "./src/modules/contracts/contracts.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let ContractsController = class ContractsController {
    contractsService;
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    async findAll() {
        const data = await this.contractsService.findAll();
        return { data };
    }
    async findOne(id) {
        return this.contractsService.findById(id);
    }
    async create(body) {
        return this.contractsService.create(body);
    }
    async update(id, body) {
        return this.contractsService.update(id, body);
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "update", null);
exports.ContractsController = ContractsController = __decorate([
    (0, common_1.Controller)('admin/contracts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof contracts_service_1.ContractsService !== "undefined" && contracts_service_1.ContractsService) === "function" ? _a : Object])
], ContractsController);


/***/ },

/***/ "./src/modules/contracts/contracts.module.ts"
/*!***************************************************!*\
  !*** ./src/modules/contracts/contracts.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const contracts_service_1 = __webpack_require__(/*! ./contracts.service */ "./src/modules/contracts/contracts.service.ts");
const contracts_controller_1 = __webpack_require__(/*! ./contracts.controller */ "./src/modules/contracts/contracts.controller.ts");
const contract_schema_1 = __webpack_require__(/*! ./schemas/contract.schema */ "./src/modules/contracts/schemas/contract.schema.ts");
let ContractsModule = class ContractsModule {
};
exports.ContractsModule = ContractsModule;
exports.ContractsModule = ContractsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: contract_schema_1.Contract.name, schema: contract_schema_1.ContractSchema }])],
        controllers: [contracts_controller_1.ContractsController],
        providers: [contracts_service_1.ContractsService],
        exports: [contracts_service_1.ContractsService],
    })
], ContractsModule);


/***/ },

/***/ "./src/modules/contracts/contracts.service.ts"
/*!****************************************************!*\
  !*** ./src/modules/contracts/contracts.service.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const contract_schema_1 = __webpack_require__(/*! ./schemas/contract.schema */ "./src/modules/contracts/schemas/contract.schema.ts");
function slugify(title) {
    const tr = {
        ı: 'i', İ: 'i', ğ: 'g', Ğ: 'g', ü: 'u', Ü: 'u',
        ş: 's', Ş: 's', ö: 'o', Ö: 'o', ç: 'c', Ç: 'c',
    };
    let s = (title || '').trim();
    Object.keys(tr).forEach((key) => {
        s = s.split(key).join(tr[key]);
    });
    s = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return s || 'contract';
}
let ContractsService = class ContractsService {
    contractModel;
    constructor(contractModel) {
        this.contractModel = contractModel;
    }
    async findAll() {
        return this.contractModel.find().sort({ order: 1, title: 1 }).lean().exec();
    }
    async findById(id) {
        return this.contractModel.findById(id).lean().exec();
    }
    async findBySlug(slug) {
        return this.contractModel.findOne({ slug: (slug || '').trim().toLowerCase() }).lean().exec();
    }
    async create(data) {
        const title = (data.title || '').trim();
        if (!title)
            throw new Error('Başlık zorunludur.');
        let slug = slugify(title);
        let exists = await this.contractModel.findOne({ slug }).exec();
        let n = 1;
        while (exists) {
            slug = `${slugify(title)}-${n}`;
            exists = await this.contractModel.findOne({ slug }).exec();
            n++;
        }
        const order = (await this.contractModel.countDocuments()) + 1;
        const doc = new this.contractModel({
            slug,
            title,
            content: (data.content || '').trim(),
            order,
            active: true,
        });
        return doc.save();
    }
    async update(id, data) {
        const update = {};
        if (data.title !== undefined)
            update.title = (data.title || '').trim();
        if (data.content !== undefined)
            update.content = (data.content || '').trim();
        return this.contractModel
            .findByIdAndUpdate(id, update, { new: true })
            .lean()
            .exec();
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contract_schema_1.Contract.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ContractsService);


/***/ },

/***/ "./src/modules/contracts/schemas/contract.schema.ts"
/*!**********************************************************!*\
  !*** ./src/modules/contracts/schemas/contract.schema.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContractSchema = exports.Contract = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Contract = class Contract extends mongoose_2.Document {
    slug;
    title;
    content;
    order;
    active;
    createdBy;
    updatedBy;
};
exports.Contract = Contract;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, lowercase: true }),
    __metadata("design:type", String)
], Contract.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Contract.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Contract.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Contract.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Contract.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Contract.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Contract.prototype, "updatedBy", void 0);
exports.Contract = Contract = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'contracts' })
], Contract);
exports.ContractSchema = mongoose_1.SchemaFactory.createForClass(Contract);


/***/ },

/***/ "./src/modules/countries/countries.controller.ts"
/*!*******************************************************!*\
  !*** ./src/modules/countries/countries.controller.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const countries_service_1 = __webpack_require__(/*! ./countries.service */ "./src/modules/countries/countries.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let CountriesController = class CountriesController {
    countriesService;
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    async findAll(page = 1, limit = 50, search) {
        return this.countriesService.findAll(+page, +limit, search);
    }
    async findAirports(code) {
        return this.countriesService.findAirportsByCountry(code);
    }
};
exports.CountriesController = CountriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':code/airports'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "findAirports", null);
exports.CountriesController = CountriesController = __decorate([
    (0, common_1.Controller)('admin/countries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _a : Object])
], CountriesController);


/***/ },

/***/ "./src/modules/countries/countries.module.ts"
/*!***************************************************!*\
  !*** ./src/modules/countries/countries.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const countries_controller_1 = __webpack_require__(/*! ./countries.controller */ "./src/modules/countries/countries.controller.ts");
const countries_service_1 = __webpack_require__(/*! ./countries.service */ "./src/modules/countries/countries.service.ts");
const airport_schema_1 = __webpack_require__(/*! ./schemas/airport.schema */ "./src/modules/countries/schemas/airport.schema.ts");
let CountriesModule = class CountriesModule {
};
exports.CountriesModule = CountriesModule;
exports.CountriesModule = CountriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: airport_schema_1.Airport.name, schema: airport_schema_1.AirportSchema }]),
        ],
        controllers: [countries_controller_1.CountriesController],
        providers: [countries_service_1.CountriesService],
        exports: [countries_service_1.CountriesService],
    })
], CountriesModule);


/***/ },

/***/ "./src/modules/countries/countries.service.ts"
/*!****************************************************!*\
  !*** ./src/modules/countries/countries.service.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const airport_schema_1 = __webpack_require__(/*! ./schemas/airport.schema */ "./src/modules/countries/schemas/airport.schema.ts");
let CountriesService = class CountriesService {
    airportModel;
    constructor(airportModel) {
        this.airportModel = airportModel;
    }
    async findAll(page = 1, limit = 50, search) {
        const p = Math.max(1, +page || 1);
        const l = Math.min(200, Math.max(1, +limit || 50));
        const skip = (p - 1) * l;
        const match = {};
        if (search && search.trim()) {
            const s = search.trim();
            match.$or = [
                { countryCode: new RegExp(s, 'i') },
                { countryName: new RegExp(s, 'i') },
            ];
        }
        const [data, totalResult] = await Promise.all([
            this.airportModel
                .aggregate([
                { $match: match },
                {
                    $group: {
                        _id: '$countryCode',
                        countryCode: { $first: '$countryCode' },
                        countryName: { $first: '$countryName' },
                        airportCount: { $sum: 1 },
                        cities: { $addToSet: '$cityCode' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        countryCode: 1,
                        countryName: 1,
                        airportCount: 1,
                        cityCount: { $size: '$cities' },
                    },
                },
                { $sort: { countryName: 1 } },
                { $skip: skip },
                { $limit: l },
            ])
                .exec(),
            this.airportModel
                .aggregate([
                { $match: match },
                { $group: { _id: '$countryCode' } },
                { $count: 'total' },
            ])
                .exec(),
        ]);
        return {
            data,
            total: totalResult[0]?.total ?? 0,
        };
    }
    async findAirportsByCountry(countryCode) {
        const code = (countryCode || '').trim().toUpperCase();
        if (!code)
            return [];
        const list = await this.airportModel
            .aggregate([
            { $match: { countryCode: code } },
            {
                $project: {
                    _id: 0,
                    airportCode: '$airportCode',
                    airportName: '$airportName',
                    cityCode: '$cityCode',
                    cityName: '$cityName',
                },
            },
            { $sort: { cityName: 1, airportName: 1 } },
        ])
            .exec();
        return list;
    }
    async count() {
        const r = await this.airportModel
            .aggregate([
            { $group: { _id: '$countryCode' } },
            { $count: 'total' },
        ])
            .exec();
        return r[0]?.total ?? 0;
    }
};
exports.CountriesService = CountriesService;
exports.CountriesService = CountriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(airport_schema_1.Airport.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CountriesService);


/***/ },

/***/ "./src/modules/countries/schemas/airport.schema.ts"
/*!*********************************************************!*\
  !*** ./src/modules/countries/schemas/airport.schema.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirportSchema = exports.Airport = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Airport = class Airport extends mongoose_2.Document {
    cityCode;
    cityName;
    airportCode;
    airportName;
    countryCode;
    countryName;
    timeZoneId;
    rating;
    searchName;
};
exports.Airport = Airport;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Airport.prototype, "cityCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Airport.prototype, "cityName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Airport.prototype, "airportCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Airport.prototype, "airportName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Airport.prototype, "countryCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Airport.prototype, "countryName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Airport.prototype, "timeZoneId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Airport.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Airport.prototype, "searchName", void 0);
exports.Airport = Airport = __decorate([
    (0, mongoose_1.Schema)({ collection: 'airports', timestamps: true })
], Airport);
exports.AirportSchema = mongoose_1.SchemaFactory.createForClass(Airport);


/***/ },

/***/ "./src/modules/dashboard/dashboard.controller.ts"
/*!*******************************************************!*\
  !*** ./src/modules/dashboard/dashboard.controller.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/modules/dashboard/dashboard.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getStatistics() {
        return this.dashboardService.getStatistics();
    }
    async getRecentActivities() {
        return this.dashboardService.getRecentActivities();
    }
    async getRecentReservations(limit) {
        const n = limit ? parseInt(limit, 10) : 8;
        return this.dashboardService.getRecentReservations(Number.isFinite(n) && n > 0 ? n : 8);
    }
    async getRecentMembers(limit) {
        const n = limit ? parseInt(limit, 10) : 8;
        return this.dashboardService.getRecentMembers(Number.isFinite(n) && n > 0 ? n : 8);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('activities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentActivities", null);
__decorate([
    (0, common_1.Get)('recent-reservations'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentReservations", null);
__decorate([
    (0, common_1.Get)('recent-members'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getRecentMembers", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('admin/dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof dashboard_service_1.DashboardService !== "undefined" && dashboard_service_1.DashboardService) === "function" ? _a : Object])
], DashboardController);


/***/ },

/***/ "./src/modules/dashboard/dashboard.module.ts"
/*!***************************************************!*\
  !*** ./src/modules/dashboard/dashboard.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const dashboard_controller_1 = __webpack_require__(/*! ./dashboard.controller */ "./src/modules/dashboard/dashboard.controller.ts");
const dashboard_service_1 = __webpack_require__(/*! ./dashboard.service */ "./src/modules/dashboard/dashboard.service.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const audit_log_schema_1 = __webpack_require__(/*! ../audit-logs/schemas/audit-log.schema */ "./src/modules/audit-logs/schemas/audit-log.schema.ts");
const reservations_module_1 = __webpack_require__(/*! ../reservations/reservations.module */ "./src/modules/reservations/reservations.module.ts");
const members_module_1 = __webpack_require__(/*! ../members/members.module */ "./src/modules/members/members.module.ts");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
            ]),
            reservations_module_1.ReservationsModule,
            members_module_1.MembersModule,
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
        exports: [dashboard_service_1.DashboardService]
    })
], DashboardModule);


/***/ },

/***/ "./src/modules/dashboard/dashboard.service.ts"
/*!****************************************************!*\
  !*** ./src/modules/dashboard/dashboard.service.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const audit_log_schema_1 = __webpack_require__(/*! ../audit-logs/schemas/audit-log.schema */ "./src/modules/audit-logs/schemas/audit-log.schema.ts");
const reservations_service_1 = __webpack_require__(/*! ../reservations/reservations.service */ "./src/modules/reservations/reservations.service.ts");
const members_service_1 = __webpack_require__(/*! ../members/members.service */ "./src/modules/members/members.service.ts");
let DashboardService = class DashboardService {
    userModel;
    auditLogModel;
    reservationsService;
    membersService;
    constructor(userModel, auditLogModel, reservationsService, membersService) {
        this.userModel = userModel;
        this.auditLogModel = auditLogModel;
        this.reservationsService = reservationsService;
        this.membersService = membersService;
    }
    async getStatistics() {
        const [memberStats, reservationStats] = await Promise.all([
            this.membersService.getStats(),
            this.reservationsService.getStats(),
        ]);
        return {
            totalMembers: memberStats.total,
            totalReservations: reservationStats.total,
            totalRevenue: reservationStats.totalRevenue,
            faultyReservations: reservationStats.cancelled,
        };
    }
    async getRecentActivities() {
        const activities = await this.auditLogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('actorId', 'username name surName')
            .lean();
        return activities.map(activity => {
            const actor = activity.actorId;
            const actionIconMap = {
                'create': 'add_circle',
                'update': 'edit',
                'delete': 'delete',
                'login': 'login',
                'logout': 'logout',
            };
            let actionType = 'info';
            let icon = 'info';
            let status = 'Başarılı';
            let statusClass = 'success';
            const isFailed = activity.action.includes('FAILED') ||
                activity.action.includes('_FAILED') ||
                activity.message.includes('başarısız') ||
                activity.message.includes('hata');
            if (isFailed) {
                status = 'Başarısız';
                statusClass = 'error';
                icon = 'error';
            }
            else if (activity.action.includes('LOGIN_SUCCESS')) {
                icon = 'login';
            }
            else if (activity.action.includes('LOGOUT')) {
                icon = 'logout';
            }
            else if (activity.action.includes('CHANGE_PASSWORD')) {
                icon = 'lock';
            }
            else if (activity.action.includes('create') || activity.action.includes('CREATE')) {
                actionType = 'create';
                icon = 'add_circle';
            }
            else if (activity.action.includes('update') || activity.action.includes('UPDATE')) {
                actionType = 'update';
                icon = 'edit';
            }
            else if (activity.action.includes('delete') || activity.action.includes('DELETE')) {
                actionType = 'delete';
                icon = 'delete';
            }
            let user = 'System';
            let userName = null;
            if (actor && typeof actor === 'object') {
                user = actor.username || 'System';
                if (actor.name && actor.surName) {
                    userName = `${actor.name} ${actor.surName}`.trim();
                }
                else if (actor.name) {
                    userName = actor.name;
                }
                else if (actor.surName) {
                    userName = actor.surName;
                }
                if (!userName || userName === '') {
                    userName = null;
                }
            }
            return {
                _id: activity._id,
                action: activity.message,
                user: user,
                userName: userName,
                entity: activity.entityType,
                time: this.getTimeAgo(activity.createdAt),
                status: status,
                statusClass: statusClass,
                icon: icon,
                createdAt: activity.createdAt
            };
        });
    }
    async getRecentReservations(limit = 8) {
        return this.reservationsService.findRecent(limit);
    }
    async getRecentMembers(limit = 8) {
        return this.membersService.findRecent(limit);
    }
    getTimeAgo(date) {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days} gün önce`;
        }
        else if (hours > 0) {
            return `${hours} saat önce`;
        }
        else if (minutes > 0) {
            return `${minutes} dakika önce`;
        }
        else {
            return `${seconds} saniye önce`;
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof reservations_service_1.ReservationsService !== "undefined" && reservations_service_1.ReservationsService) === "function" ? _c : Object, typeof (_d = typeof members_service_1.MembersService !== "undefined" && members_service_1.MembersService) === "function" ? _d : Object])
], DashboardService);


/***/ },

/***/ "./src/modules/members/members.controller.ts"
/*!***************************************************!*\
  !*** ./src/modules/members/members.controller.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MembersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const members_service_1 = __webpack_require__(/*! ./members.service */ "./src/modules/members/members.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let MembersController = class MembersController {
    membersService;
    constructor(membersService) {
        this.membersService = membersService;
    }
    async findAll(page = 1, limit = 10, search, status, emailVerified) {
        return this.membersService.findAll(+page, +limit, search, status, emailVerified);
    }
    async getStats() {
        return this.membersService.getStats();
    }
    async findOne(id) {
        return this.membersService.findById(id);
    }
    async updateStatus(id, status) {
        return this.membersService.updateStatus(id, status);
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('emailVerified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "updateStatus", null);
exports.MembersController = MembersController = __decorate([
    (0, common_1.Controller)('admin/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof members_service_1.MembersService !== "undefined" && members_service_1.MembersService) === "function" ? _a : Object])
], MembersController);


/***/ },

/***/ "./src/modules/members/members.module.ts"
/*!***********************************************!*\
  !*** ./src/modules/members/members.module.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MembersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const member_schema_1 = __webpack_require__(/*! ./schemas/member.schema */ "./src/modules/members/schemas/member.schema.ts");
const members_controller_1 = __webpack_require__(/*! ./members.controller */ "./src/modules/members/members.controller.ts");
const members_service_1 = __webpack_require__(/*! ./members.service */ "./src/modules/members/members.service.ts");
let MembersModule = class MembersModule {
};
exports.MembersModule = MembersModule;
exports.MembersModule = MembersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: member_schema_1.Member.name, schema: member_schema_1.MemberSchema }]),
        ],
        controllers: [members_controller_1.MembersController],
        providers: [members_service_1.MembersService],
        exports: [members_service_1.MembersService],
    })
], MembersModule);


/***/ },

/***/ "./src/modules/members/members.service.ts"
/*!************************************************!*\
  !*** ./src/modules/members/members.service.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MembersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const member_schema_1 = __webpack_require__(/*! ./schemas/member.schema */ "./src/modules/members/schemas/member.schema.ts");
let MembersService = class MembersService {
    memberModel;
    constructor(memberModel) {
        this.memberModel = memberModel;
    }
    async findAll(page = 1, limit = 10, search, status, emailVerified) {
        const filter = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { firstName: regex },
                { lastName: regex },
                { email: regex },
                { phone: regex },
            ];
        }
        if (status) {
            filter.status = status;
        }
        if (emailVerified === 'true') {
            filter.emailVerified = true;
        }
        else if (emailVerified === 'false') {
            filter.emailVerified = false;
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.memberModel
                .find(filter)
                .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.memberModel.countDocuments(filter).exec(),
        ]);
        return { data, total };
    }
    async findById(id) {
        const member = await this.memberModel
            .findById(id)
            .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
            .lean()
            .exec();
        if (!member) {
            throw new common_1.NotFoundException('Müşteri bulunamadı');
        }
        return member;
    }
    async updateStatus(id, status) {
        const member = await this.memberModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
            .lean()
            .exec();
        if (!member) {
            throw new common_1.NotFoundException('Müşteri bulunamadı');
        }
        return member;
    }
    async findRecent(limit = 8) {
        const n = Math.min(Math.max(Number(limit) || 8, 1), 50);
        return this.memberModel
            .find()
            .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
            .sort({ createdAt: -1 })
            .limit(n)
            .lean()
            .exec();
    }
    async getStats() {
        const [total, active, pending, suspended] = await Promise.all([
            this.memberModel.countDocuments().exec(),
            this.memberModel.countDocuments({ status: 'active' }).exec(),
            this.memberModel.countDocuments({ status: 'pending' }).exec(),
            this.memberModel.countDocuments({ status: 'suspended' }).exec(),
        ]);
        return { total, active, pending, suspended };
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_schema_1.Member.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], MembersService);


/***/ },

/***/ "./src/modules/members/schemas/member.schema.ts"
/*!******************************************************!*\
  !*** ./src/modules/members/schemas/member.schema.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberSchema = exports.Member = exports.ContractAcceptance = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let ContractAcceptance = class ContractAcceptance {
    slug;
    acceptedAt;
    ipAddress;
};
exports.ContractAcceptance = ContractAcceptance;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ContractAcceptance.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ContractAcceptance.prototype, "acceptedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ContractAcceptance.prototype, "ipAddress", void 0);
exports.ContractAcceptance = ContractAcceptance = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ContractAcceptance);
let Member = class Member extends mongoose_2.Document {
    firstName;
    lastName;
    email;
    phone;
    passwordHash;
    emailVerified;
    verificationToken;
    verificationTokenExpiresAt;
    status;
    contractAcceptances;
    marketingConsent;
};
exports.Member = Member;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Member.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Member.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Member.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Member.prototype, "passwordHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Member.prototype, "emailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Member.prototype, "verificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Member.prototype, "verificationTokenExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending', enum: ['pending', 'active', 'suspended'] }),
    __metadata("design:type", String)
], Member.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ContractAcceptance], default: [] }),
    __metadata("design:type", Array)
], Member.prototype, "contractAcceptances", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Member.prototype, "marketingConsent", void 0);
exports.Member = Member = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'members' })
], Member);
exports.MemberSchema = mongoose_1.SchemaFactory.createForClass(Member);
exports.MemberSchema.index({ email: 1 }, { unique: true });
exports.MemberSchema.index({ status: 1 });
exports.MemberSchema.index({ createdAt: -1 });


/***/ },

/***/ "./src/modules/permissions/permissions.controller.ts"
/*!***********************************************************!*\
  !*** ./src/modules/permissions/permissions.controller.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const permissions_service_1 = __webpack_require__(/*! ./permissions.service */ "./src/modules/permissions/permissions.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async findAll(page = 1, limit = 10, search) {
        return this.permissionsService.findAll(+page, +limit, search);
    }
    async findOne(id) {
        return this.permissionsService.findById(id);
    }
    async create(permissionData) {
        return this.permissionsService.create(permissionData);
    }
    async update(id, permissionData) {
        return this.permissionsService.update(id, permissionData);
    }
    async delete(id) {
        await this.permissionsService.delete(id);
        return { message: 'Permission deleted successfully' };
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "delete", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('admin/permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof permissions_service_1.PermissionsService !== "undefined" && permissions_service_1.PermissionsService) === "function" ? _a : Object])
], PermissionsController);


/***/ },

/***/ "./src/modules/permissions/permissions.module.ts"
/*!*******************************************************!*\
  !*** ./src/modules/permissions/permissions.module.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const permissions_service_1 = __webpack_require__(/*! ./permissions.service */ "./src/modules/permissions/permissions.service.ts");
const permissions_controller_1 = __webpack_require__(/*! ./permissions.controller */ "./src/modules/permissions/permissions.controller.ts");
const permission_schema_1 = __webpack_require__(/*! ./schemas/permission.schema */ "./src/modules/permissions/schemas/permission.schema.ts");
const roles_module_1 = __webpack_require__(/*! ../roles/roles.module */ "./src/modules/roles/roles.module.ts");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: permission_schema_1.Permission.name, schema: permission_schema_1.PermissionSchema }]),
            roles_module_1.RolesModule,
        ],
        controllers: [permissions_controller_1.PermissionsController],
        providers: [permissions_service_1.PermissionsService],
        exports: [permissions_service_1.PermissionsService],
    })
], PermissionsModule);


/***/ },

/***/ "./src/modules/permissions/permissions.service.ts"
/*!********************************************************!*\
  !*** ./src/modules/permissions/permissions.service.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PermissionsService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const role_schema_1 = __webpack_require__(/*! ../roles/schemas/role.schema */ "./src/modules/roles/schemas/role.schema.ts");
const permission_schema_1 = __webpack_require__(/*! ../permissions/schemas/permission.schema */ "./src/modules/permissions/schemas/permission.schema.ts");
const permission_cache_service_1 = __webpack_require__(/*! ../roles/services/permission-cache.service */ "./src/modules/roles/services/permission-cache.service.ts");
let PermissionsService = PermissionsService_1 = class PermissionsService {
    roleModel;
    permissionModel;
    permissionCacheService;
    logger = new common_1.Logger(PermissionsService_1.name);
    constructor(roleModel, permissionModel, permissionCacheService) {
        this.roleModel = roleModel;
        this.permissionModel = permissionModel;
        this.permissionCacheService = permissionCacheService;
    }
    async findAll(page = 1, limit = 10, search) {
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
    async findById(id) {
        return this.permissionModel.findById(id).exec();
    }
    async create(permissionData) {
        const newPermission = new this.permissionModel(permissionData);
        return newPermission.save();
    }
    async update(id, permissionData) {
        return this.permissionModel.findByIdAndUpdate(id, permissionData, { new: true }).exec();
    }
    async delete(id) {
        await this.permissionModel.findByIdAndDelete(id);
    }
    async getPermissionsForRoles(roleIds) {
        const allPermissions = new Set();
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
    async resolveRolePermissionsFromDb(roleId) {
        const role = await this.roleModel
            .findById(roleId)
            .populate('permissions')
            .exec();
        if (!role)
            return [];
        return role.permissions
            .filter((p) => p.status === 'active')
            .map((p) => p.code);
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = PermissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __param(1, (0, mongoose_1.InjectModel)(permission_schema_1.Permission.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof permission_cache_service_1.PermissionCacheService !== "undefined" && permission_cache_service_1.PermissionCacheService) === "function" ? _c : Object])
], PermissionsService);


/***/ },

/***/ "./src/modules/permissions/schemas/permission.schema.ts"
/*!**************************************************************!*\
  !*** ./src/modules/permissions/schemas/permission.schema.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionSchema = exports.Permission = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Permission = class Permission extends mongoose_2.Document {
    code;
    name;
    description;
    modules;
    status;
    createdBy;
    updatedBy;
};
exports.Permission = Permission;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Permission.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Permission.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Permission.prototype, "modules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active', enum: ['active', 'passive'] }),
    __metadata("design:type", String)
], Permission.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Permission.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Permission.prototype, "updatedBy", void 0);
exports.Permission = Permission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'permissions' })
], Permission);
exports.PermissionSchema = mongoose_1.SchemaFactory.createForClass(Permission);


/***/ },

/***/ "./src/modules/reservations/reservation-normalizer.ts"
/*!************************************************************!*\
  !*** ./src/modules/reservations/reservation-normalizer.ts ***!
  \************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.combinePointDateTime = combinePointDateTime;
exports.normalizeReservationDoc = normalizeReservationDoc;
exports.statusFilterValues = statusFilterValues;
function combinePointDateTime(dateStr, timeStr) {
    if (!dateStr)
        return undefined;
    const time = (timeStr || '00:00').trim();
    const normalizedTime = time.split(':').length === 2 ? `${time}:00` : time;
    const dmY = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(dateStr.trim());
    if (dmY) {
        const [, dd, mm, yyyy] = dmY;
        const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${normalizedTime}`;
        const d = new Date(iso);
        if (!isNaN(d.getTime()))
            return d;
    }
    const raw = `${dateStr} ${normalizedTime}`.trim();
    let d = new Date(raw);
    if (!isNaN(d.getTime()))
        return d;
    d = new Date(`${dateStr}T${normalizedTime}`);
    if (!isNaN(d.getTime()))
        return d;
    d = new Date(dateStr);
    return isNaN(d.getTime()) ? undefined : d;
}
function mapFlightToSegments(flight) {
    if (!flight || typeof flight !== 'object')
        return [];
    const dep = flight.departure;
    const arr = flight.arrival;
    const departureAt = combinePointDateTime(dep?.date, dep?.time);
    const arrivalAt = combinePointDateTime(arr?.date, arr?.time);
    return [
        {
            airline: flight.airline,
            flightNo: flight.flightNumber || flight.flightNo,
            origin: dep?.airportCode || dep?.airport,
            destination: arr?.airportCode || arr?.airport,
            departureAt,
            arrivalAt,
            cabinClass: flight.cabinClass,
        },
    ];
}
function mapPassengers(raw) {
    if (!Array.isArray(raw))
        return [];
    return raw.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        birthDate: p.birthDate,
        gender: p.gender,
        nationality: p.nationality,
        tcNo: p.tcNo || p.citizenNo,
        citizenNoSha256: p.citizenNoSha256,
        passportNo: p.passportNo,
        passportCountry: p.passportCountry,
        passportValidDate: p.passportValidDate,
        idType: p.idType,
        email: p.email,
        phone: p.phone,
        passengerType: p.passengerType ?? p.type,
    }));
}
function mapPayment(doc) {
    const pay = doc.payment;
    const fallbackAmount = (typeof doc.totalAmount === 'number' ? doc.totalAmount : undefined) ??
        (typeof doc.totalFare === 'number' ? doc.totalFare : undefined) ??
        (pay && typeof pay.amount === 'number' ? pay.amount : 0);
    let method;
    if (pay) {
        if (pay.cardNumber || pay.cardHolder)
            method = 'credit_card';
        else if (pay.bankName)
            method = 'bank_transfer';
        else if (pay.paymentId || pay.amount != null)
            method = 'credit_card';
    }
    if (!method && fallbackAmount > 0)
        method = 'credit_card';
    const transactionId = pay?.transactionId ?? pay?.paymentId;
    let paidAt;
    if (pay?.paidAt)
        paidAt = new Date(pay.paidAt);
    else if (pay?.finalizedDate)
        paidAt = new Date(pay.finalizedDate);
    const amount = pay && typeof pay.amount === 'number' ? pay.amount : fallbackAmount;
    const currency = doc.currency ?? pay?.currency ?? 'TRY';
    return {
        method,
        transactionId,
        paidAt,
        amount,
        currency,
    };
}
function normalizeType(t) {
    if (!t)
        return 'flight';
    const lower = String(t).toLowerCase();
    if (lower === 'car')
        return 'car_rental';
    if (lower === 'hotel')
        return 'hotel';
    return lower;
}
function normalizeStatus(s) {
    if (!s)
        return 'pending';
    const u = String(s).toUpperCase();
    if (u === 'CONFIRMED')
        return 'confirmed';
    if (u === 'PENDING')
        return 'pending';
    if (u === 'CANCELLED' || u === 'CANCELED')
        return 'cancelled';
    if (u === 'COMPLETED')
        return 'completed';
    if (u === 'PAYMENT_FAILED')
        return 'payment_failed';
    return String(s).toLowerCase();
}
function normalizeReservationDoc(doc, member) {
    if (!doc)
        return doc;
    const reservationNo = doc.reservationNo || doc.bookingCode || '';
    const segments = Array.isArray(doc.segments) && doc.segments.length > 0
        ? doc.segments
        : mapFlightToSegments(doc.flight);
    const passengers = mapPassengers(doc.passengers || []);
    const payment = mapPayment(doc);
    let memberFirstName = doc.memberFirstName;
    let memberLastName = doc.memberLastName;
    let memberEmail = doc.memberEmail;
    let memberPhone = doc.memberPhone;
    if (member) {
        memberFirstName = memberFirstName || member.firstName;
        memberLastName = memberLastName || member.lastName;
        memberEmail = memberEmail || member.email;
        memberPhone = memberPhone || member.phone;
    }
    if (!String(memberFirstName || '').trim() && passengers.length > 0) {
        const p0 = passengers[0];
        if (p0?.firstName) {
            memberFirstName = p0.firstName;
            memberLastName = p0.lastName || '';
        }
    }
    if (passengers.length > 0) {
        const p0 = passengers[0];
        if (!String(memberEmail || '').trim() && p0?.email) {
            memberEmail = p0.email;
        }
        if (!String(memberPhone || '').trim() && p0?.phone) {
            memberPhone = p0.phone;
        }
    }
    const totalAmount = typeof doc.totalAmount === 'number' && !isNaN(doc.totalAmount)
        ? doc.totalAmount
        : typeof doc.totalFare === 'number' && !isNaN(doc.totalFare)
            ? doc.totalFare
            : typeof payment.amount === 'number'
                ? payment.amount
                : 0;
    return {
        ...doc,
        reservationNo,
        type: normalizeType(doc.type),
        status: normalizeStatus(doc.status),
        segments,
        passengers,
        payment,
        totalAmount,
        currency: doc.currency || payment.currency || 'TRY',
        memberFirstName: memberFirstName || '',
        memberLastName: memberLastName || '',
        memberEmail: memberEmail || '',
        memberPhone: memberPhone || '',
    };
}
function statusFilterValues(uiStatus) {
    const s = uiStatus.toLowerCase();
    switch (s) {
        case 'confirmed':
            return ['confirmed', 'CONFIRMED'];
        case 'pending':
            return ['pending', 'PENDING'];
        case 'cancelled':
            return ['cancelled', 'CANCELLED', 'CANCELED'];
        case 'completed':
            return ['completed', 'COMPLETED'];
        case 'payment_failed':
            return ['PAYMENT_FAILED', 'payment_failed'];
        default:
            return [uiStatus];
    }
}


/***/ },

/***/ "./src/modules/reservations/reservations.controller.ts"
/*!*************************************************************!*\
  !*** ./src/modules/reservations/reservations.controller.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const reservations_service_1 = __webpack_require__(/*! ./reservations.service */ "./src/modules/reservations/reservations.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let ReservationsController = class ReservationsController {
    reservationsService;
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    findAll(page = 1, limit = 10, search, status, type, startDate, endDate) {
        return this.reservationsService.findAll(+page, +limit, search, status, type, startDate, endDate);
    }
    getStats() {
        return this.reservationsService.getStats();
    }
    findOne(id) {
        return this.reservationsService.findOne(id);
    }
    updateStatus(id, status, reason) {
        return this.reservationsService.updateStatus(id, status, reason);
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "updateStatus", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, common_1.Controller)('admin/reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof reservations_service_1.ReservationsService !== "undefined" && reservations_service_1.ReservationsService) === "function" ? _a : Object])
], ReservationsController);


/***/ },

/***/ "./src/modules/reservations/reservations.module.ts"
/*!*********************************************************!*\
  !*** ./src/modules/reservations/reservations.module.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const reservation_schema_1 = __webpack_require__(/*! ./schemas/reservation.schema */ "./src/modules/reservations/schemas/reservation.schema.ts");
const member_schema_1 = __webpack_require__(/*! ../members/schemas/member.schema */ "./src/modules/members/schemas/member.schema.ts");
const reservations_service_1 = __webpack_require__(/*! ./reservations.service */ "./src/modules/reservations/reservations.service.ts");
const reservations_controller_1 = __webpack_require__(/*! ./reservations.controller */ "./src/modules/reservations/reservations.controller.ts");
let ReservationsModule = class ReservationsModule {
};
exports.ReservationsModule = ReservationsModule;
exports.ReservationsModule = ReservationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: reservation_schema_1.Reservation.name, schema: reservation_schema_1.ReservationSchema },
                { name: member_schema_1.Member.name, schema: member_schema_1.MemberSchema },
            ]),
        ],
        controllers: [reservations_controller_1.ReservationsController],
        providers: [reservations_service_1.ReservationsService],
        exports: [reservations_service_1.ReservationsService],
    })
], ReservationsModule);


/***/ },

/***/ "./src/modules/reservations/reservations.service.ts"
/*!**********************************************************!*\
  !*** ./src/modules/reservations/reservations.service.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const reservation_schema_1 = __webpack_require__(/*! ./schemas/reservation.schema */ "./src/modules/reservations/schemas/reservation.schema.ts");
const member_schema_1 = __webpack_require__(/*! ../members/schemas/member.schema */ "./src/modules/members/schemas/member.schema.ts");
const reservation_normalizer_1 = __webpack_require__(/*! ./reservation-normalizer */ "./src/modules/reservations/reservation-normalizer.ts");
let ReservationsService = class ReservationsService {
    reservationModel;
    memberModel;
    constructor(reservationModel, memberModel) {
        this.reservationModel = reservationModel;
        this.memberModel = memberModel;
    }
    async normalizeMany(documents) {
        const ids = new Set();
        for (const d of documents) {
            if (d?.memberId)
                ids.add(String(d.memberId));
        }
        const idList = [...ids]
            .filter((id) => mongoose_2.Types.ObjectId.isValid(id))
            .map((id) => new mongoose_2.Types.ObjectId(id));
        const members = idList.length > 0
            ? await this.memberModel
                .find({ _id: { $in: idList } })
                .select('firstName lastName email phone')
                .lean()
                .exec()
            : [];
        const membersById = new Map(members.map((m) => [String(m._id), m]));
        return documents.map((doc) => (0, reservation_normalizer_1.normalizeReservationDoc)(doc, doc?.memberId ? membersById.get(String(doc.memberId)) || null : null));
    }
    async normalizeOne(doc) {
        const m = doc?.memberId
            ? await this.memberModel
                .findById(doc.memberId)
                .select('firstName lastName email phone')
                .lean()
                .exec()
            : null;
        return (0, reservation_normalizer_1.normalizeReservationDoc)(doc, m);
    }
    async findAll(page = 1, limit = 10, search, status, type, startDate, endDate) {
        const filter = {};
        if (search) {
            const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [
                { reservationNo: regex },
                { bookingCode: regex },
                { memberFirstName: regex },
                { memberLastName: regex },
                { memberEmail: regex },
                { 'passengers.firstName': regex },
                { 'passengers.lastName': regex },
            ];
        }
        if (status) {
            filter.status = { $in: (0, reservation_normalizer_1.statusFilterValues)(status) };
        }
        if (type) {
            if (type === 'car_rental') {
                filter.type = { $in: ['car_rental', 'car'] };
            }
            else {
                filter.type = type;
            }
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.$gte = new Date(startDate);
            if (endDate)
                filter.createdAt.$lte = new Date(endDate);
        }
        const skip = (page - 1) * limit;
        const [raw, total] = await Promise.all([
            this.reservationModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.reservationModel.countDocuments(filter).exec(),
        ]);
        const data = await this.normalizeMany(raw);
        return { data, total };
    }
    async findOne(id) {
        const reservation = await this.reservationModel.findById(id).lean().exec();
        if (!reservation)
            throw new common_1.NotFoundException('Rezervasyon bulunamadı');
        return this.normalizeOne(reservation);
    }
    async getStats() {
        const approvedStatuses = [
            ...(0, reservation_normalizer_1.statusFilterValues)('confirmed'),
            ...(0, reservation_normalizer_1.statusFilterValues)('completed'),
        ];
        const [total, pending, approved, cancelled, paymentFailed] = await Promise.all([
            this.reservationModel.countDocuments().exec(),
            this.reservationModel.countDocuments({
                status: { $in: (0, reservation_normalizer_1.statusFilterValues)('pending') },
            }).exec(),
            this.reservationModel
                .countDocuments({
                status: { $in: approvedStatuses },
            })
                .exec(),
            this.reservationModel.countDocuments({
                status: { $in: (0, reservation_normalizer_1.statusFilterValues)('cancelled') },
            }).exec(),
            this.reservationModel.countDocuments({
                status: { $in: (0, reservation_normalizer_1.statusFilterValues)('payment_failed') },
            }).exec(),
        ]);
        const revenueAgg = await this.reservationModel.aggregate([
            {
                $match: {
                    status: {
                        $in: approvedStatuses,
                    },
                },
            },
            {
                $project: {
                    amt: {
                        $ifNull: [
                            '$totalAmount',
                            { $ifNull: ['$totalFare', { $ifNull: ['$payment.amount', 0] }] },
                        ],
                    },
                },
            },
            { $group: { _id: null, total: { $sum: '$amt' } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total ?? 0;
        return {
            total,
            pending,
            approved,
            cancelled,
            paymentFailed,
            totalRevenue,
        };
    }
    async updateStatus(id, status, reason) {
        const update = { status };
        if (status === 'completed')
            update.completedAt = new Date();
        if (status === 'cancelled') {
            update.cancelledAt = new Date();
            if (reason)
                update.cancellationReason = reason;
        }
        const reservation = await this.reservationModel
            .findByIdAndUpdate(id, update, { new: true })
            .lean()
            .exec();
        if (!reservation)
            throw new common_1.NotFoundException('Rezervasyon bulunamadı');
        return this.normalizeOne(reservation);
    }
    async create(dto) {
        const reservation = new this.reservationModel(dto);
        return reservation.save();
    }
    async findRecent(limit = 8) {
        const safe = Math.min(Math.max(Number(limit) || 8, 1), 50);
        const raw = await this.reservationModel
            .find()
            .sort({ createdAt: -1 })
            .limit(safe)
            .lean()
            .exec();
        return this.normalizeMany(raw);
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reservation_schema_1.Reservation.name)),
    __param(1, (0, mongoose_1.InjectModel)(member_schema_1.Member.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], ReservationsService);


/***/ },

/***/ "./src/modules/reservations/schemas/reservation.schema.ts"
/*!****************************************************************!*\
  !*** ./src/modules/reservations/schemas/reservation.schema.ts ***!
  \****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationSchema = exports.Reservation = exports.PaymentInfo = exports.FlightSegment = exports.Passenger = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Passenger = class Passenger {
    firstName;
    lastName;
    birthDate;
    gender;
    tcNo;
    passportNo;
    nationality;
};
exports.Passenger = Passenger;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Passenger.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Passenger.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Passenger.prototype, "birthDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Passenger.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Passenger.prototype, "tcNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Passenger.prototype, "passportNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Passenger.prototype, "nationality", void 0);
exports.Passenger = Passenger = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Passenger);
let FlightSegment = class FlightSegment {
    airline;
    flightNo;
    origin;
    destination;
    departureAt;
    arrivalAt;
    cabinClass;
};
exports.FlightSegment = FlightSegment;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlightSegment.prototype, "airline", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlightSegment.prototype, "flightNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlightSegment.prototype, "origin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlightSegment.prototype, "destination", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], FlightSegment.prototype, "departureAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], FlightSegment.prototype, "arrivalAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FlightSegment.prototype, "cabinClass", void 0);
exports.FlightSegment = FlightSegment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FlightSegment);
let PaymentInfo = class PaymentInfo {
    method;
    transactionId;
    paidAt;
    amount;
    currency;
};
exports.PaymentInfo = PaymentInfo;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentInfo.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentInfo.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], PaymentInfo.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], PaymentInfo.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentInfo.prototype, "currency", void 0);
exports.PaymentInfo = PaymentInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PaymentInfo);
let Reservation = class Reservation extends mongoose_2.Document {
    reservationNo;
    type;
    status;
    memberId;
    memberFirstName;
    memberLastName;
    memberEmail;
    memberPhone;
    passengers;
    segments;
    payment;
    totalAmount;
    currency;
    completedAt;
    cancelledAt;
    cancellationReason;
    notes;
};
exports.Reservation = Reservation;
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Reservation.prototype, "reservationNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: 'flight' }),
    __metadata("design:type", String)
], Reservation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: 'pending' }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Member', required: false, default: null }),
    __metadata("design:type", Object)
], Reservation.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Reservation.prototype, "memberFirstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Reservation.prototype, "memberLastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Reservation.prototype, "memberEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reservation.prototype, "memberPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Passenger], default: [] }),
    __metadata("design:type", Array)
], Reservation.prototype, "passengers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FlightSegment], default: [] }),
    __metadata("design:type", Array)
], Reservation.prototype, "segments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentInfo, default: null }),
    __metadata("design:type", PaymentInfo)
], Reservation.prototype, "payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: 0 }),
    __metadata("design:type", Number)
], Reservation.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'TRY' }),
    __metadata("design:type", String)
], Reservation.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Reservation.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Reservation.prototype, "cancelledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reservation.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reservation.prototype, "notes", void 0);
exports.Reservation = Reservation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'reservations', strict: false })
], Reservation);
exports.ReservationSchema = mongoose_1.SchemaFactory.createForClass(Reservation);
exports.ReservationSchema.index({ reservationNo: 1 }, { unique: true, sparse: true });
exports.ReservationSchema.index({ bookingCode: 1 }, { unique: true, sparse: true });
exports.ReservationSchema.index({ memberId: 1 });
exports.ReservationSchema.index({ status: 1 });
exports.ReservationSchema.index({ type: 1 });
exports.ReservationSchema.index({ createdAt: -1 });


/***/ },

/***/ "./src/modules/roles/roles.controller.ts"
/*!***********************************************!*\
  !*** ./src/modules/roles/roles.controller.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const roles_service_1 = __webpack_require__(/*! ./roles.service */ "./src/modules/roles/roles.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let RolesController = class RolesController {
    rolesService;
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async findAll(page = 1, limit = 10, search) {
        return this.rolesService.findAll(+page, +limit, search);
    }
    async findOne(id) {
        return this.rolesService.findById(id);
    }
    async create(roleData) {
        return this.rolesService.create(roleData);
    }
    async update(id, roleData) {
        return this.rolesService.update(id, roleData);
    }
    async delete(id) {
        await this.rolesService.delete(id);
        return { message: 'Role deleted successfully' };
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "delete", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('admin/roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof roles_service_1.RolesService !== "undefined" && roles_service_1.RolesService) === "function" ? _a : Object])
], RolesController);


/***/ },

/***/ "./src/modules/roles/roles.module.ts"
/*!*******************************************!*\
  !*** ./src/modules/roles/roles.module.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const role_schema_1 = __webpack_require__(/*! ./schemas/role.schema */ "./src/modules/roles/schemas/role.schema.ts");
const roles_service_1 = __webpack_require__(/*! ./roles.service */ "./src/modules/roles/roles.service.ts");
const roles_controller_1 = __webpack_require__(/*! ./roles.controller */ "./src/modules/roles/roles.controller.ts");
const permission_cache_service_1 = __webpack_require__(/*! ./services/permission-cache.service */ "./src/modules/roles/services/permission-cache.service.ts");
let RolesModule = class RolesModule {
};
exports.RolesModule = RolesModule;
exports.RolesModule = RolesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: role_schema_1.Role.name, schema: role_schema_1.RoleSchema }])],
        controllers: [roles_controller_1.RolesController],
        providers: [roles_service_1.RolesService, permission_cache_service_1.PermissionCacheService],
        exports: [mongoose_1.MongooseModule, permission_cache_service_1.PermissionCacheService, roles_service_1.RolesService],
    })
], RolesModule);


/***/ },

/***/ "./src/modules/roles/roles.service.ts"
/*!********************************************!*\
  !*** ./src/modules/roles/roles.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const role_schema_1 = __webpack_require__(/*! ./schemas/role.schema */ "./src/modules/roles/schemas/role.schema.ts");
let RolesService = class RolesService {
    roleModel;
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    async findAll(page = 1, limit = 10, search) {
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
    async findById(id) {
        return this.roleModel.findById(id).populate('permissions.permissionId').exec();
    }
    async create(roleData) {
        const newRole = new this.roleModel(roleData);
        return newRole.save();
    }
    async update(id, roleData) {
        return this.roleModel.findByIdAndUpdate(id, roleData, { new: true }).populate('permissions.permissionId').exec();
    }
    async delete(id) {
        await this.roleModel.findByIdAndDelete(id);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], RolesService);


/***/ },

/***/ "./src/modules/roles/schemas/role.schema.ts"
/*!**************************************************!*\
  !*** ./src/modules/roles/schemas/role.schema.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleSchema = exports.Role = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Role = class Role extends mongoose_2.Document {
    name;
    description;
    permissions;
    status;
    createdBy;
    updatedBy;
};
exports.Role = Role;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Permission' }] }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active', enum: ['active', 'passive'] }),
    __metadata("design:type", String)
], Role.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Role.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Role.prototype, "updatedBy", void 0);
exports.Role = Role = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'roles' })
], Role);
exports.RoleSchema = mongoose_1.SchemaFactory.createForClass(Role);


/***/ },

/***/ "./src/modules/roles/services/permission-cache.service.ts"
/*!****************************************************************!*\
  !*** ./src/modules/roles/services/permission-cache.service.ts ***!
  \****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PermissionCacheService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionCacheService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const cache_manager_1 = __webpack_require__(/*! @nestjs/cache-manager */ "@nestjs/cache-manager");
const cache_manager_2 = __webpack_require__(/*! cache-manager */ "cache-manager");
let PermissionCacheService = PermissionCacheService_1 = class PermissionCacheService {
    cacheManager;
    logger = new common_1.Logger(PermissionCacheService_1.name);
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async getPermissions(roleId) {
        const key = `role:${roleId}:permissions`;
        return this.cacheManager.get(key);
    }
    async setPermissions(roleId, permissions) {
        const key = `role:${roleId}:permissions`;
        await this.cacheManager.set(key, permissions, 0);
        this.logger.log(`Permissions cached for role: ${roleId}`);
    }
    async invalidateRole(roleId) {
        const key = `role:${roleId}:permissions`;
        await this.cacheManager.del(key);
        this.logger.log(`Permissions invalidated for role: ${roleId}`);
    }
};
exports.PermissionCacheService = PermissionCacheService;
exports.PermissionCacheService = PermissionCacheService = PermissionCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeof (_a = typeof cache_manager_2.Cache !== "undefined" && cache_manager_2.Cache) === "function" ? _a : Object])
], PermissionCacheService);


/***/ },

/***/ "./src/modules/users/schemas/user.schema.ts"
/*!**************************************************!*\
  !*** ./src/modules/users/schemas/user.schema.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let UserRole = class UserRole {
    roleId;
    assignedAt;
    assignedBy;
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Role', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], UserRole.prototype, "roleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], UserRole.prototype, "assignedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: false }),
    __metadata("design:type", typeof (_c = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _c : Object)
], UserRole.prototype, "assignedBy", void 0);
UserRole = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], UserRole);
let User = class User extends mongoose_2.Document {
    name;
    surName;
    username;
    email;
    phone;
    passwordHash;
    status;
    roles;
    createdBy;
    updatedBy;
    lastLoginAt;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "surName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active', enum: ['active', 'passive'] }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [UserRole], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _d : Object)
], User.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", typeof (_e = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _e : Object)
], User.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], User.prototype, "lastLoginAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'users' })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ },

/***/ "./src/modules/users/users.controller.ts"
/*!***********************************************!*\
  !*** ./src/modules/users/users.controller.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(page = 1, limit = 10, search) {
        return this.usersService.findAll(+page, +limit, search);
    }
    async findOne(id) {
        return this.usersService.findById(id);
    }
    async create(userData) {
        return this.usersService.create(userData);
    }
    async update(id, userData) {
        return this.usersService.update(id, userData);
    }
    async changePassword(id, body) {
        return this.usersService.changePassword(id, body.currentPassword, body.newPassword);
    }
    async delete(id) {
        await this.usersService.delete(id);
        return { message: 'User deleted successfully' };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('admin/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ },

/***/ "./src/modules/users/users.module.ts"
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./src/modules/users/users.controller.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ },

/***/ "./src/modules/users/users.service.ts"
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findAll(page = 1, limit = 10, search) {
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
    async findByUsername(username) {
        return this.userModel.findOne({ username }).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).select('-passwordHash').populate('roles.roleId', 'name description').exec();
    }
    async create(userData) {
        const rounds = 10;
        if (userData.passwordHash) {
            userData.passwordHash = await bcrypt.hash(userData.passwordHash, rounds);
        }
        const newUser = new this.userModel(userData);
        return newUser.save();
    }
    async update(id, userData) {
        if (userData.passwordHash) {
            const rounds = 10;
            userData.passwordHash = await bcrypt.hash(userData.passwordHash, rounds);
        }
        return this.userModel.findByIdAndUpdate(id, userData, { new: true }).select('-passwordHash').populate('roles.roleId', 'name description').exec();
    }
    async delete(id) {
        await this.userModel.findByIdAndDelete(id);
    }
    async updateLastLogin(userId) {
        await this.userModel.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.BadRequestException('Kullanıcı bulunamadı');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Mevcut şifre yanlış');
        }
        const rounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, rounds);
        await this.userModel.findByIdAndUpdate(userId, { passwordHash: hashedPassword });
        return { message: 'Şifre başarıyla değiştirildi' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UsersService);


/***/ },

/***/ "@nestjs/cache-manager"
/*!****************************************!*\
  !*** external "@nestjs/cache-manager" ***!
  \****************************************/
(module) {

module.exports = require("@nestjs/cache-manager");

/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/config"
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/config");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ },

/***/ "@nestjs/jwt"
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
(module) {

module.exports = require("@nestjs/jwt");

/***/ },

/***/ "@nestjs/mongoose"
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
(module) {

module.exports = require("@nestjs/mongoose");

/***/ },

/***/ "@nestjs/passport"
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
(module) {

module.exports = require("@nestjs/passport");

/***/ },

/***/ "bcrypt"
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
(module) {

module.exports = require("bcrypt");

/***/ },

/***/ "cache-manager"
/*!********************************!*\
  !*** external "cache-manager" ***!
  \********************************/
(module) {

module.exports = require("cache-manager");

/***/ },

/***/ "cache-manager-redis-yet"
/*!******************************************!*\
  !*** external "cache-manager-redis-yet" ***!
  \******************************************/
(module) {

module.exports = require("cache-manager-redis-yet");

/***/ },

/***/ "crypto"
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
(module) {

module.exports = require("crypto");

/***/ },

/***/ "mongoose"
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
(module) {

module.exports = require("mongoose");

/***/ },

/***/ "passport-jwt"
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
(module) {

module.exports = require("passport-jwt");

/***/ },

/***/ "rxjs/operators"
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
(module) {

module.exports = require("rxjs/operators");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    if (false) // removed by dead control flow
{}
}
bootstrap();

})();

/******/ })()
;