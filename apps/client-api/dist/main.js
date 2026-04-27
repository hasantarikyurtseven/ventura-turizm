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
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'client-api',
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
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
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
const biletbank_module_1 = __webpack_require__(/*! ./modules/biletbank/biletbank.module */ "./src/modules/biletbank/biletbank.module.ts");
const airports_module_1 = __webpack_require__(/*! ./modules/airports/airports.module */ "./src/modules/airports/airports.module.ts");
const airlines_module_1 = __webpack_require__(/*! ./modules/airlines/airlines.module */ "./src/modules/airlines/airlines.module.ts");
const contracts_module_1 = __webpack_require__(/*! ./modules/contracts/contracts.module */ "./src/modules/contracts/contracts.module.ts");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const reservations_module_1 = __webpack_require__(/*! ./modules/reservations/reservations.module */ "./src/modules/reservations/reservations.module.ts");
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
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'redis'),
                        port: configService.get('REDIS_PORT', 6379),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 60000,
                    limit: 10,
                },
                {
                    name: 'long',
                    ttl: 3600000,
                    limit: 100,
                },
            ]),
            biletbank_module_1.BiletbankModule,
            airports_module_1.AirportsModule,
            airlines_module_1.AirlinesModule,
            contracts_module_1.ContractsModule,
            auth_module_1.AuthModule,
            reservations_module_1.ReservationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
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

/***/ "./src/common/filters/http-exception.filter.ts"
/*!*****************************************************!*\
  !*** ./src/common/filters/http-exception.filter.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        const sanitizedMessage = this.sanitizeError(message);
        const errorLog = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: sanitizedMessage,
        };
        if (status >= 500) {
            this.logger.error(JSON.stringify(errorLog));
            if (exception instanceof Error) {
                this.logger.error(`Stack: ${exception.stack}`);
            }
        }
        else {
            this.logger.warn(JSON.stringify(errorLog));
        }
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const responseBody = {
            statusCode: status,
            timestamp: errorLog.timestamp,
            path: request.url,
            message: sanitizedMessage,
        };
        if (isDevelopment && exception instanceof Error) {
            responseBody.stack = exception.stack;
        }
        response.status(status).json(responseBody);
    }
    sanitizeError(message) {
        if (typeof message === 'string') {
            return message
                .replace(/password[=:]\s*\S+/gi, 'password=***')
                .replace(/client[_-]?key[=:]\s*\S+/gi, 'client_key=***')
                .replace(/username[=:]\s*\S+/gi, 'username=***')
                .replace(/token[=:]\s*\S+/gi, 'token=***');
        }
        if (typeof message === 'object' && message !== null) {
            const sanitized = Array.isArray(message) ? [] : {};
            for (const key in message) {
                if (Object.prototype.hasOwnProperty.call(message, key)) {
                    const lowerKey = key.toLowerCase();
                    if (lowerKey.includes('password') ||
                        lowerKey.includes('client') ||
                        lowerKey.includes('key') ||
                        lowerKey.includes('token') ||
                        lowerKey.includes('secret')) {
                        sanitized[key] = '***';
                    }
                    else {
                        sanitized[key] = this.sanitizeError(message[key]);
                    }
                }
            }
            return sanitized;
        }
        return message;
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);


/***/ },

/***/ "./src/common/interceptors/logging.interceptor.ts"
/*!********************************************************!*\
  !*** ./src/common/interceptors/logging.interceptor.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    logger = new common_1.Logger(LoggingInterceptor_1.name);
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, body, query, params, headers } = request;
        const startTime = Date.now();
        const hasAuth = !!headers?.['authorization'];
        const sanitizedBody = this.sanitizeData(body);
        const sanitizedQuery = this.sanitizeData(query);
        const sanitizedParams = this.sanitizeData(params);
        const requestSummary = this.buildRequestSummary(method, url, sanitizedBody, sanitizedQuery, sanitizedParams, hasAuth);
        this.logger.log(requestSummary);
        return next.handle().pipe((0, operators_1.tap)({
            next: (data) => {
                const duration = Date.now() - startTime;
                const responseSummary = this.buildResponseSummary(method, url, response.statusCode, duration, data);
                this.logger.log(responseSummary);
            },
            error: (error) => {
                const duration = Date.now() - startTime;
                this.logger.error(`Request Error: ${method} ${url} - Status: ${error.status || 500} - Duration: ${duration}ms - Error: ${error.message}`);
            },
        }));
    }
    sanitizeData(data, seen = new WeakSet()) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        if (seen.has(data)) {
            return '[Circular]';
        }
        seen.add(data);
        const sanitized = Array.isArray(data) ? [] : {};
        const sensitiveKeys = [
            'password',
            'clientKey',
            'client_key',
            'username',
            'token',
            'secret',
            'apiKey',
            'api_key',
            'authorization',
        ];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const lowerKey = key.toLowerCase();
                if (sensitiveKeys.some(sk => lowerKey.includes(sk.toLowerCase()))) {
                    sanitized[key] = '***';
                }
                else if (typeof data[key] === 'object' && data[key] !== null) {
                    sanitized[key] = this.sanitizeData(data[key], seen);
                }
                else {
                    sanitized[key] = data[key];
                }
            }
        }
        return sanitized;
    }
    buildRequestSummary(method, url, body, query, params, hasAuth) {
        const segments = [`Incoming Request: ${method} ${url}`];
        segments.push(`Auth: ${hasAuth ? 'yes' : 'NO'}`);
        if (query && Object.keys(query).length > 0) {
            segments.push(`Query: ${JSON.stringify(query)}`);
        }
        if (params && Object.keys(params).length > 0) {
            segments.push(`Params: ${JSON.stringify(params)}`);
        }
        if (body && typeof body === 'object' && Object.keys(body).length > 0) {
            segments.push(`BodyKeys: ${Object.keys(body).join(',')}`);
        }
        return segments.join(' - ');
    }
    buildResponseSummary(method, url, statusCode, duration, data) {
        const segments = [
            `Outgoing Response: ${method} ${url}`,
            `Status: ${statusCode}`,
            `Duration: ${duration}ms`,
        ];
        const sanitizedResponse = this.sanitizeData(data);
        if (sanitizedResponse && typeof sanitizedResponse === 'object') {
            const summary = {};
            for (const key of ['success', 'message', 'hasError', 'searchId', 'shoppingFileId', 'allocateId', 'productId', 'correlationId']) {
                if (key in sanitizedResponse) {
                    summary[key] = sanitizedResponse[key];
                }
            }
            if (Array.isArray(sanitizedResponse.flights)) {
                summary.flightsCount = sanitizedResponse.flights.length;
            }
            if (Object.keys(summary).length > 0) {
                segments.push(`Response: ${JSON.stringify(summary)}`);
            }
        }
        return segments.join(' - ');
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ },

/***/ "./src/common/privacy/sensitive-identifiers.ts"
/*!*****************************************************!*\
  !*** ./src/common/privacy/sensitive-identifiers.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeTurkishCitizenId = normalizeTurkishCitizenId;
exports.hashCitizenIdForStorage = hashCitizenIdForStorage;
exports.getCitizenIdPepper = getCitizenIdPepper;
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
function normalizeTurkishCitizenId(raw) {
    if (raw == null || raw === '')
        return null;
    const d = String(raw).replace(/\D/g, '');
    if (d.length !== 11)
        return null;
    return d;
}
function hashCitizenIdForStorage(normalizedTc, pepper) {
    return (0, crypto_1.createHmac)('sha256', pepper).update(normalizedTc, 'utf8').digest('hex');
}
function getCitizenIdPepper() {
    const p = process.env.CITIZEN_ID_STORAGE_PEPPER?.trim();
    if (p && p.length >= 16)
        return p;
    return 'ventura-dev-only-pepper-change-me';
}


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
var AdminNotificationsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminNotificationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const admin_notification_schema_1 = __webpack_require__(/*! ./schemas/admin-notification.schema */ "./src/modules/admin-notifications/schemas/admin-notification.schema.ts");
let AdminNotificationsService = AdminNotificationsService_1 = class AdminNotificationsService {
    model;
    logger = new common_1.Logger(AdminNotificationsService_1.name);
    constructor(model) {
        this.model = model;
    }
    async recordNewReservation(params) {
        try {
            await this.model.create({
                kind: 'new_reservation',
                message: `Yeni rezervasyon oluşturuldu: ${params.bookingCode}`,
                icon: 'confirmation_number',
                read: false,
                bookingCode: params.bookingCode,
                reservationId: params.reservationId,
            });
        }
        catch (err) {
            this.logger.warn(`Admin bildirimi yazılamadı (rezervasyon yine de kayıtlı): ${params.bookingCode}`, err instanceof Error ? err.stack : err);
        }
    }
};
exports.AdminNotificationsService = AdminNotificationsService;
exports.AdminNotificationsService = AdminNotificationsService = AdminNotificationsService_1 = __decorate([
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
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let AdminNotification = class AdminNotification extends mongoose_2.Document {
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
let AirlinesController = class AirlinesController {
    airlinesService;
    constructor(airlinesService) {
        this.airlinesService = airlinesService;
    }
    async findAll() {
        const airlines = await this.airlinesService.findAll();
        return { success: true, airlines };
    }
    async findByCode(code) {
        const airline = await this.airlinesService.findByCode(code);
        if (!airline) {
            return { success: false, airline: null };
        }
        return { success: true, airline };
    }
};
exports.AirlinesController = AirlinesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AirlinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AirlinesController.prototype, "findByCode", null);
exports.AirlinesController = AirlinesController = __decorate([
    (0, common_1.Controller)('airlines'),
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
const airlines_schema_1 = __webpack_require__(/*! ./airlines.schema */ "./src/modules/airlines/airlines.schema.ts");
const airlines_service_1 = __webpack_require__(/*! ./airlines.service */ "./src/modules/airlines/airlines.service.ts");
const airlines_controller_1 = __webpack_require__(/*! ./airlines.controller */ "./src/modules/airlines/airlines.controller.ts");
let AirlinesModule = class AirlinesModule {
};
exports.AirlinesModule = AirlinesModule;
exports.AirlinesModule = AirlinesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: airlines_schema_1.Airline.name, schema: airlines_schema_1.AirlineSchema }]),
        ],
        providers: [airlines_service_1.AirlinesService],
        controllers: [airlines_controller_1.AirlinesController],
        exports: [airlines_service_1.AirlinesService],
    })
], AirlinesModule);


/***/ },

/***/ "./src/modules/airlines/airlines.schema.ts"
/*!*************************************************!*\
  !*** ./src/modules/airlines/airlines.schema.ts ***!
  \*************************************************/
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
exports.AirlineSchema = exports.Airline = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Airline = class Airline extends mongoose_2.Document {
    code;
    name;
    logoUrl;
    status;
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
exports.Airline = Airline = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'airlines' })
], Airline);
exports.AirlineSchema = mongoose_1.SchemaFactory.createForClass(Airline);


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
const airlines_schema_1 = __webpack_require__(/*! ./airlines.schema */ "./src/modules/airlines/airlines.schema.ts");
let AirlinesService = class AirlinesService {
    airlineModel;
    constructor(airlineModel) {
        this.airlineModel = airlineModel;
    }
    async findAll() {
        const list = await this.airlineModel
            .find({ status: 'active' })
            .select('code name logoUrl')
            .sort({ code: 1 })
            .lean()
            .exec();
        return list.map((d) => ({
            code: d.code,
            name: d.name,
            logoUrl: d.logoUrl || undefined,
        }));
    }
    async findByCode(code) {
        const d = await this.airlineModel
            .findOne({ code: (code || '').trim().toUpperCase(), status: 'active' })
            .select('code name logoUrl')
            .lean()
            .exec();
        if (!d)
            return null;
        return { code: d.code, name: d.name, logoUrl: d.logoUrl };
    }
};
exports.AirlinesService = AirlinesService;
exports.AirlinesService = AirlinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(airlines_schema_1.Airline.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AirlinesService);


/***/ },

/***/ "./src/modules/airports/airports.controller.ts"
/*!*****************************************************!*\
  !*** ./src/modules/airports/airports.controller.ts ***!
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
exports.AirportsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const airports_service_1 = __webpack_require__(/*! ./airports.service */ "./src/modules/airports/airports.service.ts");
let AirportsController = class AirportsController {
    airportsService;
    constructor(airportsService) {
        this.airportsService = airportsService;
    }
    async importFromExcel() {
        const filePath = '/Users/tarik/Documents/projeler/ventura-turizm/Airports&Cities&Countries EN.xlsx';
        const result = await this.airportsService.importFromExcel(filePath);
        return {
            success: true,
            message: 'Airports imported from Excel',
            inserted: result.inserted,
        };
    }
};
exports.AirportsController = AirportsController;
__decorate([
    (0, common_1.Post)('import'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AirportsController.prototype, "importFromExcel", null);
exports.AirportsController = AirportsController = __decorate([
    (0, common_1.Controller)('admin/airports'),
    __metadata("design:paramtypes", [typeof (_a = typeof airports_service_1.AirportsService !== "undefined" && airports_service_1.AirportsService) === "function" ? _a : Object])
], AirportsController);


/***/ },

/***/ "./src/modules/airports/airports.module.ts"
/*!*************************************************!*\
  !*** ./src/modules/airports/airports.module.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirportsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const airports_schema_1 = __webpack_require__(/*! ./airports.schema */ "./src/modules/airports/airports.schema.ts");
const airports_service_1 = __webpack_require__(/*! ./airports.service */ "./src/modules/airports/airports.service.ts");
const airports_controller_1 = __webpack_require__(/*! ./airports.controller */ "./src/modules/airports/airports.controller.ts");
const airports_query_controller_1 = __webpack_require__(/*! ./airports.query.controller */ "./src/modules/airports/airports.query.controller.ts");
let AirportsModule = class AirportsModule {
};
exports.AirportsModule = AirportsModule;
exports.AirportsModule = AirportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: airports_schema_1.Airport.name, schema: airports_schema_1.AirportSchema },
            ]),
        ],
        providers: [airports_service_1.AirportsService],
        controllers: [airports_controller_1.AirportsController, airports_query_controller_1.AirportsQueryController],
    })
], AirportsModule);


/***/ },

/***/ "./src/modules/airports/airports.query.controller.ts"
/*!***********************************************************!*\
  !*** ./src/modules/airports/airports.query.controller.ts ***!
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
exports.AirportsQueryController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const airports_service_1 = __webpack_require__(/*! ./airports.service */ "./src/modules/airports/airports.service.ts");
let AirportsQueryController = class AirportsQueryController {
    airportsService;
    constructor(airportsService) {
        this.airportsService = airportsService;
    }
    async getCountries() {
        const countries = await this.airportsService.getCountries();
        return {
            success: true,
            countries,
        };
    }
    async searchAirports(countryCode, q, limit) {
        const parsedLimit = limit ? parseInt(limit, 10) || 100 : 100;
        const airports = await this.airportsService.searchAirports({
            countryCode,
            query: q,
            limit: parsedLimit,
        });
        return {
            success: true,
            airports,
        };
    }
};
exports.AirportsQueryController = AirportsQueryController;
__decorate([
    (0, common_1.Get)('countries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AirportsQueryController.prototype, "getCountries", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('countryCode')),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AirportsQueryController.prototype, "searchAirports", null);
exports.AirportsQueryController = AirportsQueryController = __decorate([
    (0, common_1.Controller)('airports'),
    __metadata("design:paramtypes", [typeof (_a = typeof airports_service_1.AirportsService !== "undefined" && airports_service_1.AirportsService) === "function" ? _a : Object])
], AirportsQueryController);


/***/ },

/***/ "./src/modules/airports/airports.schema.ts"
/*!*************************************************!*\
  !*** ./src/modules/airports/airports.schema.ts ***!
  \*************************************************/
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

/***/ "./src/modules/airports/airports.service.ts"
/*!**************************************************!*\
  !*** ./src/modules/airports/airports.service.ts ***!
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
var AirportsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirportsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const XLSX = __webpack_require__(/*! xlsx */ "xlsx");
const airports_schema_1 = __webpack_require__(/*! ./airports.schema */ "./src/modules/airports/airports.schema.ts");
let AirportsService = AirportsService_1 = class AirportsService {
    airportModel;
    logger = new common_1.Logger(AirportsService_1.name);
    constructor(airportModel) {
        this.airportModel = airportModel;
    }
    async importFromExcel(filePath) {
        this.logger.log(`Starting import from Excel: ${filePath}`);
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, {
            defval: '',
        });
        if (!rows.length) {
            this.logger.warn('No rows parsed from Excel. Check sheet/headers.');
            return { inserted: 0 };
        }
        await this.airportModel.deleteMany({});
        const docs = rows
            .map((row) => {
            const cityCode = String(row.CityCode || '').trim();
            const cityName = String(row.CityName || '').trim();
            const airportCode = String(row.AirportCode || '').trim();
            const airportName = String(row.AirportName || '').trim();
            const countryCode = String(row.CountryCode || '').trim();
            const countryName = String(row.CountryName || '').trim();
            const timeZoneId = String(row.TimeZoneId || '').trim();
            const rating = String(row.Rating || '').trim();
            if (!cityCode && !airportCode) {
                return null;
            }
            const searchName = this.buildSearchName({
                cityName,
                countryName,
                cityCode,
                airportName,
                airportCode,
            });
            return {
                cityCode,
                cityName,
                airportCode,
                airportName,
                countryCode,
                countryName,
                timeZoneId: timeZoneId || undefined,
                rating: rating || undefined,
                searchName,
            };
        })
            .filter(Boolean);
        if (!docs.length) {
            this.logger.warn('After mapping, no valid airport documents found.');
            return { inserted: 0 };
        }
        const result = await this.airportModel.insertMany(docs, {
            ordered: false,
        });
        this.logger.log(`Imported ${result.length} airports from Excel.`);
        return { inserted: result.length };
    }
    async getCountries() {
        const pipeline = [
            {
                $group: {
                    _id: {
                        countryCode: '$CountryCode',
                        countryName: '$CountryName',
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    countryCode: '$_id.countryCode',
                    countryName: '$_id.countryName',
                },
            },
            {
                $sort: { countryName: 1 },
            },
        ];
        const rows = await this.airportModel.aggregate(pipeline).exec();
        return rows;
    }
    async searchAirports(params) {
        const { countryCode, query, limit = 100 } = params;
        const pipeline = [];
        if (countryCode) {
            pipeline.push({
                $match: {
                    CountryCode: countryCode.toUpperCase(),
                },
            });
        }
        if (query && query.trim()) {
            const q = query.trim();
            pipeline.push({
                $match: {
                    $or: [
                        { CityName: { $regex: q, $options: 'i' } },
                        { AirportName: { $regex: q, $options: 'i' } },
                        { AirportCode: { $regex: `^${q}`, $options: 'i' } },
                    ],
                },
            });
        }
        pipeline.push({
            $sort: {
                CityName: 1,
                AirportName: 1,
            },
        });
        pipeline.push({
            $limit: limit,
        });
        const rows = await this.airportModel.aggregate(pipeline).exec();
        return rows.map((row) => ({
            cityCode: row.CityCode,
            cityName: row.CityName,
            airportCode: row.AirportCode,
            airportName: row.AirportName,
            countryCode: row.CountryCode,
            countryName: row.CountryName,
            timeZoneId: row.TimeZoneId,
        }));
    }
    buildSearchName(args) {
        const { cityName, countryName, cityCode, airportName, airportCode } = args;
        if (airportCode) {
            const left = airportName ? `${airportName} (${airportCode})` : airportCode;
            const rightParts = [];
            if (cityName)
                rightParts.push(cityName);
            if (countryName)
                rightParts.push(countryName);
            const right = rightParts.length ? rightParts.join(', ') : '';
            return right ? `${left} · ${right}` : left;
        }
        if (cityCode) {
            const left = cityName ? `${cityName} (${cityCode})` : cityCode;
            const right = countryName || '';
            return right ? `${left} · ${right}` : left;
        }
        return '';
    }
};
exports.AirportsService = AirportsService;
exports.AirportsService = AirportsService = AirportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(airports_schema_1.Airport.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AirportsService);


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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const express_1 = __webpack_require__(/*! express */ "express");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const register_dto_1 = __webpack_require__(/*! ./dto/register.dto */ "./src/modules/auth/dto/register.dto.ts");
const login_dto_1 = __webpack_require__(/*! ./dto/login.dto */ "./src/modules/auth/dto/login.dto.ts");
const jwt_member_guard_1 = __webpack_require__(/*! ./guards/jwt-member.guard */ "./src/modules/auth/guards/jwt-member.guard.ts");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    getIpAddress(req) {
        const forwarded = req.headers['x-forwarded-for'];
        return forwarded
            ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]).trim()
            : req.ip || '0.0.0.0';
    }
    async register(dto, req) {
        return this.authService.register(dto, this.getIpAddress(req));
    }
    async verifyEmail(token) {
        return this.authService.verifyEmail(token);
    }
    async login(dto, req, userAgent) {
        return this.authService.login(dto, this.getIpAddress(req), userAgent || 'unknown');
    }
    async refresh(refreshToken, req, userAgent) {
        return this.authService.refreshAccessToken(refreshToken, this.getIpAddress(req), userAgent || 'unknown');
    }
    async logout(refreshToken) {
        return this.authService.logout(refreshToken);
    }
    async logoutAll(req) {
        return this.authService.logoutAll(req.user.memberId);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.memberId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 }, long: { limit: 20, ttl: 3600000 } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _b : Object, typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 }, long: { limit: 30, ttl: 3600000 } }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ short: { limit: 5, ttl: 60000 }, long: { limit: 15, ttl: 3600000 } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _d : Object, typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, throttler_1.Throttle)({ short: { limit: 10, ttl: 60000 }, long: { limit: 60, ttl: 3600000 } }),
    __param(0, (0, common_1.Body)('refreshToken')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.UseGuards)(jwt_member_guard_1.JwtMemberGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_member_guard_1.JwtMemberGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
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
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const member_schema_1 = __webpack_require__(/*! ./schemas/member.schema */ "./src/modules/auth/schemas/member.schema.ts");
const refresh_token_schema_1 = __webpack_require__(/*! ./schemas/refresh-token.schema */ "./src/modules/auth/schemas/refresh-token.schema.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const jwt_member_strategy_1 = __webpack_require__(/*! ./strategies/jwt-member.strategy */ "./src/modules/auth/strategies/jwt-member.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: member_schema_1.Member.name, schema: member_schema_1.MemberSchema },
                { name: refresh_token_schema_1.MemberRefreshToken.name, schema: refresh_token_schema_1.MemberRefreshTokenSchema },
            ]),
            bullmq_1.BullModule.registerQueue({ name: 'email-verification' }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt-member' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('CLIENT_JWT_SECRET', 'client-secret-change-me'),
                    signOptions: {
                        expiresIn: configService.get('CLIENT_JWT_ACCESS_EXPIRES', '15m'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_member_strategy_1.JwtMemberStrategy],
        exports: [auth_service_1.AuthService, jwt_member_strategy_1.JwtMemberStrategy, passport_1.PassportModule, jwt_1.JwtModule],
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
var AuthService_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const bullmq_2 = __webpack_require__(/*! bullmq */ "bullmq");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const member_schema_1 = __webpack_require__(/*! ./schemas/member.schema */ "./src/modules/auth/schemas/member.schema.ts");
const refresh_token_schema_1 = __webpack_require__(/*! ./schemas/refresh-token.schema */ "./src/modules/auth/schemas/refresh-token.schema.ts");
let AuthService = AuthService_1 = class AuthService {
    memberModel;
    refreshTokenModel;
    emailQueue;
    configService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    failedAttempts = new Map();
    MAX_FAILED_ATTEMPTS = 5;
    LOCKOUT_DURATION = 15 * 60 * 1000;
    constructor(memberModel, refreshTokenModel, emailQueue, configService, jwtService) {
        this.memberModel = memberModel;
        this.refreshTokenModel = refreshTokenModel;
        this.emailQueue = emailQueue;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    async register(dto, ipAddress) {
        const email = dto.email.toLowerCase().trim();
        const existing = await this.memberModel.findOne({ email });
        if (existing) {
            this.logger.warn(`Kayıt denemesi: zaten kayıtlı e-posta: ${email} (IP: ${ipAddress})`);
            return {
                success: true,
                message: 'Kayıt işleminiz alındı. E-posta adresinize onay linki gönderildi. Lütfen e-postanızı kontrol edin.',
            };
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const verificationToken = crypto.randomUUID();
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const now = new Date();
        const contractAcceptances = [];
        if (dto.acceptTerms) {
            contractAcceptances.push({ slug: 'kullanim-sartlari', acceptedAt: now, ipAddress }, { slug: 'gizlilik-sartlari', acceptedAt: now, ipAddress });
        }
        if (dto.acceptPrivacy) {
            contractAcceptances.push({ slug: 'kisisel-verilerin-korunmasi', acceptedAt: now, ipAddress }, { slug: 'gizlilik-politikasi', acceptedAt: now, ipAddress });
        }
        const member = new this.memberModel({
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            email,
            phone: dto.phone.trim(),
            passwordHash,
            emailVerified: false,
            verificationToken,
            verificationTokenExpiresAt,
            status: 'pending',
            contractAcceptances,
            marketingConsent: dto.acceptMarketing ?? false,
        });
        await member.save();
        this.logger.log(`Yeni üye kaydedildi: ${member.email} (IP: ${ipAddress})`);
        const clientWebUrl = this.configService.get('CLIENT_WEB_URL', 'http://localhost:4300');
        await this.emailQueue.add('send-verification', {
            email: member.email,
            firstName: this.escapeHtml(member.firstName),
            verificationToken,
            clientWebUrl,
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: true,
            removeOnFail: false,
        });
        return {
            success: true,
            message: 'Kayıt işleminiz alındı. E-posta adresinize onay linki gönderildi. Lütfen e-postanızı kontrol edin.',
        };
    }
    async verifyEmail(token) {
        if (!token || token.length < 30 || token.length > 50) {
            throw new common_1.BadRequestException('Onay linki geçersiz.');
        }
        const member = await this.memberModel.findOne({ verificationToken: token });
        if (!member) {
            throw new common_1.BadRequestException('Onay linki geçersiz veya daha önce kullanılmış.');
        }
        if (member.verificationTokenExpiresAt && member.verificationTokenExpiresAt < new Date()) {
            await this.memberModel.updateOne({ _id: member._id }, { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } });
            throw new common_1.BadRequestException('Onay linkinin süresi dolmuş. Lütfen yeniden kayıt olun.');
        }
        await this.memberModel.updateOne({ _id: member._id }, {
            $set: { emailVerified: true, status: 'active' },
            $unset: { verificationToken: '', verificationTokenExpiresAt: '' },
        });
        this.logger.log(`E-posta onaylandı: ${member.email}`);
        return {
            success: true,
            message: 'E-posta adresiniz başarıyla onaylandı. Artık giriş yapabilirsiniz.',
        };
    }
    async login(dto, ipAddress, userAgent) {
        const email = dto.email.toLowerCase().trim();
        this.checkBruteForce(email);
        const member = await this.memberModel.findOne({ email }).select('+passwordHash');
        if (!member) {
            this.recordFailedAttempt(email);
            throw new common_1.UnauthorizedException('E-posta adresi veya şifre hatalı.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, member.passwordHash);
        if (!isPasswordValid) {
            this.recordFailedAttempt(email);
            throw new common_1.UnauthorizedException('E-posta adresi veya şifre hatalı.');
        }
        if (!member.emailVerified) {
            throw new common_1.UnauthorizedException('Lütfen önce e-posta adresinizi doğrulayın.');
        }
        if (member.status === 'suspended') {
            throw new common_1.UnauthorizedException('Hesabınız askıya alınmıştır. Destek ile iletişime geçin.');
        }
        if (member.status !== 'active') {
            throw new common_1.UnauthorizedException('Hesabınız henüz aktif değil.');
        }
        this.clearFailedAttempts(email);
        const tokens = await this.generateTokens(member, ipAddress, userAgent);
        await this.memberModel.updateOne({ _id: member._id }, { $set: { lastLoginAt: new Date(), lastLoginIp: ipAddress } });
        this.logger.log(`Üye girişi başarılı: ${email} (IP: ${ipAddress})`);
        return {
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email,
            },
        };
    }
    async refreshAccessToken(refreshToken, ipAddress, userAgent) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token gerekli.');
        }
        const tokenHash = this.hashToken(refreshToken);
        const storedToken = await this.refreshTokenModel.findOne({
            tokenHash,
            revoked: false,
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException('Geçersiz veya iptal edilmiş oturum.');
        }
        if (storedToken.expiresAt < new Date()) {
            await this.refreshTokenModel.updateOne({ _id: storedToken._id }, { $set: { revoked: true, revokedReason: 'expired' } });
            throw new common_1.UnauthorizedException('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
        }
        await this.refreshTokenModel.updateOne({ _id: storedToken._id }, { $set: { revoked: true, revokedReason: 'rotated' } });
        const member = await this.memberModel.findById(storedToken.memberId);
        if (!member || member.status !== 'active') {
            throw new common_1.UnauthorizedException('Hesap aktif değil.');
        }
        const tokens = await this.generateTokens(member, ipAddress, userAgent);
        return {
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    async logout(refreshToken) {
        if (refreshToken) {
            const tokenHash = this.hashToken(refreshToken);
            await this.refreshTokenModel.updateOne({ tokenHash }, { $set: { revoked: true, revokedReason: 'logout' } });
        }
        return { success: true, message: 'Çıkış yapıldı.' };
    }
    async logoutAll(memberId) {
        await this.refreshTokenModel.updateMany({ memberId: new mongoose_2.Types.ObjectId(memberId), revoked: false }, { $set: { revoked: true, revokedReason: 'logout_all' } });
        return { success: true, message: 'Tüm oturumlardan çıkış yapıldı.' };
    }
    async getProfile(memberId) {
        const member = await this.memberModel
            .findById(memberId)
            .select('firstName lastName email phone emailVerified status marketingConsent createdAt')
            .lean();
        if (!member) {
            throw new common_1.UnauthorizedException('Kullanıcı bulunamadı.');
        }
        return { success: true, user: member };
    }
    async generateTokens(member, ipAddress, userAgent) {
        const accessExpiresIn = this.configService.get('CLIENT_JWT_ACCESS_EXPIRES', '15m');
        const refreshExpiresIn = this.configService.get('CLIENT_JWT_REFRESH_EXPIRES', '7d');
        const accessPayload = {
            sub: member._id.toString(),
            email: member.email,
            firstName: member.firstName,
            tokenType: 'member_access',
        };
        const accessToken = this.jwtService.sign(accessPayload, { expiresIn: accessExpiresIn });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const refreshTokenHash = this.hashToken(refreshToken);
        const refreshMs = this.parseDuration(refreshExpiresIn);
        const expiresAt = new Date(Date.now() + refreshMs);
        await this.refreshTokenModel.create({
            memberId: member._id,
            tokenHash: refreshTokenHash,
            expiresAt,
            ipAddress,
            userAgent: userAgent?.substring(0, 500) || 'unknown',
            revoked: false,
        });
        const activeSessions = await this.refreshTokenModel
            .find({ memberId: member._id, revoked: false })
            .sort({ createdAt: 1 })
            .exec();
        if (activeSessions.length > 10) {
            const toRevoke = activeSessions.slice(0, activeSessions.length - 10);
            const idsToRevoke = toRevoke.map((s) => s._id);
            await this.refreshTokenModel.updateMany({ _id: { $in: idsToRevoke } }, { $set: { revoked: true, revokedReason: 'max_sessions' } });
        }
        return { accessToken, refreshToken };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    parseDuration(duration) {
        const match = duration.match(/^(\d+)([smhd])$/);
        if (!match)
            return 7 * 24 * 60 * 60 * 1000;
        const value = parseInt(match[1], 10);
        switch (match[2]) {
            case 's': return value * 1000;
            case 'm': return value * 60 * 1000;
            case 'h': return value * 60 * 60 * 1000;
            case 'd': return value * 24 * 60 * 60 * 1000;
            default: return 7 * 24 * 60 * 60 * 1000;
        }
    }
    checkBruteForce(email) {
        const record = this.failedAttempts.get(email);
        if (!record)
            return;
        if (record.count >= this.MAX_FAILED_ATTEMPTS &&
            Date.now() - record.lastAttempt < this.LOCKOUT_DURATION) {
            const remainingMinutes = Math.ceil((this.LOCKOUT_DURATION - (Date.now() - record.lastAttempt)) / 60000);
            throw new common_1.UnauthorizedException(`Çok fazla başarısız giriş denemesi. Lütfen ${remainingMinutes} dakika sonra tekrar deneyin.`);
        }
        if (Date.now() - record.lastAttempt >= this.LOCKOUT_DURATION) {
            this.failedAttempts.delete(email);
        }
    }
    recordFailedAttempt(email) {
        const record = this.failedAttempts.get(email);
        if (record) {
            record.count++;
            record.lastAttempt = Date.now();
        }
        else {
            this.failedAttempts.set(email, { count: 1, lastAttempt: Date.now() });
        }
    }
    clearFailedAttempts(email) {
        this.failedAttempts.delete(email);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_schema_1.Member.name)),
    __param(1, (0, mongoose_1.InjectModel)(refresh_token_schema_1.MemberRefreshToken.name)),
    __param(2, (0, bullmq_1.InjectQueue)('email-verification')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object, typeof (_e = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _e : Object])
], AuthService);


/***/ },

/***/ "./src/modules/auth/dto/login.dto.ts"
/*!*******************************************!*\
  !*** ./src/modules/auth/dto/login.dto.ts ***!
  \*******************************************/
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
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Geçerli bir e-posta adresi giriniz.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'E-posta adresi zorunludur.' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Şifre zorunludur.' }),
    (0, class_validator_1.MaxLength)(72, { message: 'Şifre çok uzun.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ },

/***/ "./src/modules/auth/dto/register.dto.ts"
/*!**********************************************!*\
  !*** ./src/modules/auth/dto/register.dto.ts ***!
  \**********************************************/
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
exports.RegisterDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class RegisterDto {
    firstName;
    lastName;
    email;
    phone;
    password;
    acceptTerms;
    acceptPrivacy;
    acceptMarketing;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Ad zorunludur' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Ad en az 2 karakter olmalıdır' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Ad en fazla 50 karakter olabilir' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Soyad zorunludur' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Soyad en az 2 karakter olmalıdır' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Soyad en fazla 50 karakter olabilir' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'E-posta zorunludur' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Geçerli bir e-posta adresi giriniz' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.toLowerCase().trim() : value),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Telefon zorunludur' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[0-9]{10,11}$/, { message: 'Geçerli bir telefon numarası giriniz (10-11 haneli)' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Şifre zorunludur' }),
    (0, class_validator_1.MinLength)(8, { message: 'Şifre en az 8 karakter olmalıdır' }),
    (0, class_validator_1.MaxLength)(72, { message: 'Şifre en fazla 72 karakter olabilir' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.Equals)(true, { message: 'Kullanım şartlarını kabul etmelisiniz' }),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "acceptTerms", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.Equals)(true, { message: 'Gizlilik politikasını kabul etmelisiniz' }),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "acceptPrivacy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "acceptMarketing", void 0);


/***/ },

/***/ "./src/modules/auth/guards/jwt-member.guard.ts"
/*!*****************************************************!*\
  !*** ./src/modules/auth/guards/jwt-member.guard.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtMemberGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtMemberGuard = class JwtMemberGuard extends (0, passport_1.AuthGuard)('jwt-member') {
};
exports.JwtMemberGuard = JwtMemberGuard;
exports.JwtMemberGuard = JwtMemberGuard = __decorate([
    (0, common_1.Injectable)()
], JwtMemberGuard);


/***/ },

/***/ "./src/modules/auth/guards/optional-jwt-member.guard.ts"
/*!**************************************************************!*\
  !*** ./src/modules/auth/guards/optional-jwt-member.guard.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OptionalJwtMemberGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let OptionalJwtMemberGuard = class OptionalJwtMemberGuard extends (0, passport_1.AuthGuard)('jwt-member') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(_err, user) {
        return user ?? null;
    }
};
exports.OptionalJwtMemberGuard = OptionalJwtMemberGuard;
exports.OptionalJwtMemberGuard = OptionalJwtMemberGuard = __decorate([
    (0, common_1.Injectable)()
], OptionalJwtMemberGuard);


/***/ },

/***/ "./src/modules/auth/schemas/member.schema.ts"
/*!***************************************************!*\
  !*** ./src/modules/auth/schemas/member.schema.ts ***!
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
var _a, _b, _c;
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
    lastLoginAt;
    lastLoginIp;
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
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Member.prototype, "lastLoginAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Member.prototype, "lastLoginIp", void 0);
exports.Member = Member = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'members' })
], Member);
exports.MemberSchema = mongoose_1.SchemaFactory.createForClass(Member);
exports.MemberSchema.index({ email: 1 }, { unique: true });
exports.MemberSchema.index({ verificationToken: 1 }, { sparse: true });


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberRefreshTokenSchema = exports.MemberRefreshToken = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let MemberRefreshToken = class MemberRefreshToken extends mongoose_2.Document {
    memberId;
    tokenHash;
    expiresAt;
    ipAddress;
    userAgent;
    revoked;
    revokedReason;
};
exports.MemberRefreshToken = MemberRefreshToken;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Member', required: true, index: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], MemberRefreshToken.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MemberRefreshToken.prototype, "tokenHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], MemberRefreshToken.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MemberRefreshToken.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MemberRefreshToken.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], MemberRefreshToken.prototype, "revoked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], MemberRefreshToken.prototype, "revokedReason", void 0);
exports.MemberRefreshToken = MemberRefreshToken = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'member_refresh_tokens' })
], MemberRefreshToken);
exports.MemberRefreshTokenSchema = mongoose_1.SchemaFactory.createForClass(MemberRefreshToken);
exports.MemberRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.MemberRefreshTokenSchema.index({ memberId: 1, revoked: 1 });


/***/ },

/***/ "./src/modules/auth/strategies/jwt-member.strategy.ts"
/*!************************************************************!*\
  !*** ./src/modules/auth/strategies/jwt-member.strategy.ts ***!
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
var JwtMemberStrategy_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtMemberStrategy = void 0;
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let JwtMemberStrategy = JwtMemberStrategy_1 = class JwtMemberStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-member') {
    logger = new common_1.Logger(JwtMemberStrategy_1.name);
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('CLIENT_JWT_SECRET', 'client-secret-change-me'),
        });
        this.logger.log(`JwtMemberStrategy başlatıldı, secret: ${configService.get('CLIENT_JWT_SECRET', 'client-secret-change-me')?.substring(0, 8)}...`);
    }
    async validate(payload) {
        this.logger.log(`validate çağrıldı: sub=${payload.sub}, tokenType=${payload.tokenType}`);
        if (payload.tokenType !== 'member_access') {
            throw new common_1.UnauthorizedException('Geçersiz token tipi.');
        }
        return {
            memberId: payload.sub,
            email: payload.email,
            firstName: payload.firstName,
        };
    }
};
exports.JwtMemberStrategy = JwtMemberStrategy;
exports.JwtMemberStrategy = JwtMemberStrategy = JwtMemberStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtMemberStrategy);


/***/ },

/***/ "./src/modules/biletbank/air/airsearch/airsearch.controller.ts"
/*!*********************************************************************!*\
  !*** ./src/modules/biletbank/air/airsearch/airsearch.controller.ts ***!
  \*********************************************************************/
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
var BiletbankAirSearchController_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankAirSearchController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const air_search_request_dto_1 = __webpack_require__(/*! ../../dto/air-search-request.dto */ "./src/modules/biletbank/dto/air-search-request.dto.ts");
const airsearch_service_1 = __webpack_require__(/*! ./airsearch.service */ "./src/modules/biletbank/air/airsearch/airsearch.service.ts");
let BiletbankAirSearchController = BiletbankAirSearchController_1 = class BiletbankAirSearchController {
    airSearchService;
    logger = new common_1.Logger(BiletbankAirSearchController_1.name);
    constructor(airSearchService) {
        this.airSearchService = airSearchService;
    }
    async airSearch(body) {
        try {
            this.logger.log('AirSearch request received', {
                origin: body.originCode,
                destination: body.destinationCode,
                departureDate: body.departureDate,
                searchReason: body.searchReason,
            });
            const result = await this.airSearchService.airSearch(body);
            this.logger.log('AirSearch request completed successfully', {
                hasError: result.hasError,
                flightsCount: result.flights?.length || 0,
            });
            return result;
        }
        catch (error) {
            this.logger.error('AirSearch request failed', {
                error: error?.message,
                stack: error?.stack,
                body: body,
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error?.message || 'Uçuş arama sırasında bir hata oluştu.',
                error: 'AirSearch Error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getDebugInfo(res) {
        const debugInfo = this.airSearchService.getLastDebugInfo();
        let responseXml = 'N/A - Henüz response alınmamış. Lütfen önce bir AirSearch isteği yapın.';
        if (debugInfo.responseXml !== null && debugInfo.responseXml !== undefined) {
            responseXml = String(debugInfo.responseXml);
            if (responseXml === 'null' || responseXml === 'undefined' || responseXml.trim() === '') {
                responseXml = 'N/A - Response boş veya geçersiz.';
            }
        }
        let requestXml = 'N/A - Henüz request yapılmamış.';
        if (debugInfo.requestXml !== null && debugInfo.requestXml !== undefined) {
            requestXml = String(debugInfo.requestXml);
            if (requestXml === 'null' || requestXml === 'undefined' || requestXml.trim() === '') {
                requestXml = 'N/A - Request boş veya geçersiz.';
            }
        }
        const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiletBank AirSearch Debug - Request & Response XML</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      opacity: 0.9;
      font-size: 14px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: #667eea;
      border-radius: 2px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
      font-weight: 600;
    }
    .info-value {
      font-size: 16px;
      color: #333;
      word-break: break-word;
    }
    .xml-container {
      background: #1e1e1e;
      border-radius: 6px;
      padding: 20px;
      overflow-x: auto;
      position: relative;
    }
    .xml-container pre {
      color: #d4d4d4;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .copy-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .copy-btn:hover {
      background: #5568d3;
    }
    .copy-btn:active {
      background: #4456c2;
    }
    .timestamp {
      color: #999;
      font-size: 12px;
      margin-top: 10px;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 BiletBank AirSearch Debug</h1>
      <p>Request ve Response XML'leri - BiletBank'a Mail İçin</p>
    </div>
    <div class="content">
      ${!debugInfo.requestXml ? `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h2>Henüz AirSearch isteği yapılmamış</h2>
        <p>Lütfen önce bir uçuş araması yapın, sonra bu sayfayı yenileyin.</p>
      </div>
      ` : `
      <!-- Request Parameters -->
      <div class="section">
        <h2 class="section-title">📋 Request Parameters</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Trip Type</div>
            <div class="info-value">${debugInfo.requestParams?.tripType || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Origin</div>
            <div class="info-value">${debugInfo.requestParams?.originCode || 'N/A'} (IsCity: ${debugInfo.requestParams?.originIsCity ? 'true' : 'false'})</div>
          </div>
          <div class="info-item">
            <div class="info-label">Destination</div>
            <div class="info-value">${debugInfo.requestParams?.destinationCode || 'N/A'} (IsCity: ${debugInfo.requestParams?.destinationIsCity ? 'true' : 'false'})</div>
          </div>
          <div class="info-item">
            <div class="info-label">Departure Date</div>
            <div class="info-value">${debugInfo.requestParams?.departureDate || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Return Date</div>
            <div class="info-value">${debugInfo.requestParams?.returnDate || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Passengers</div>
            <div class="info-value">Adults: ${debugInfo.requestParams?.adults || 0}, Children: ${debugInfo.requestParams?.children || 0}, Infants: ${debugInfo.requestParams?.infants || 0}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Search Reason</div>
            <div class="info-value">${debugInfo.requestParams?.searchReason || 'N/A'}</div>
          </div>
        </div>
      </div>

      <!-- Request XML -->
      <div class="section">
        <h2 class="section-title">📤 REQUEST XML</h2>
        <div class="xml-container">
          <button class="copy-btn" onclick="copyToClipboard('request-xml')">📋 Kopyala</button>
          <pre id="request-xml">${this.escapeHtml(requestXml || 'N/A')}</pre>
        </div>
        <div class="timestamp">Oluşturulma: ${debugInfo.timestamp || 'N/A'} | Length: ${requestXml.length}</div>
      </div>

      <!-- Response XML -->
      <div class="section">
        <h2 class="section-title">📥 RESPONSE XML</h2>
        <div class="xml-container">
          <button class="copy-btn" onclick="copyToClipboard('response-xml')">📋 Kopyala</button>
          <pre id="response-xml">${this.escapeHtml(responseXml || 'N/A')}</pre>
        </div>
        <div class="timestamp">Alınma: ${debugInfo.timestamp || 'N/A'} | Length: ${responseXml.length}</div>
      </div>

      <!-- Response Summary -->
      ${debugInfo.response ? `
      <div class="section">
        <h2 class="section-title">📊 Response Summary</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Success</div>
            <div class="info-value">${debugInfo.response.success ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Has Error</div>
            <div class="info-value">${debugInfo.response.hasError ? '❌ Yes' : '✅ No'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Search ID</div>
            <div class="info-value">${debugInfo.response.searchId || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Shopping File ID</div>
            <div class="info-value">${debugInfo.response.shoppingFileId || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Flights Count</div>
            <div class="info-value">${debugInfo.response.flights?.length || 0}</div>
          </div>
        </div>
      </div>
      ` : ''}
      `}
    </div>
  </div>

  <script>
    function copyToClipboard(elementId) {
      const element = document.getElementById(elementId);
      const text = element.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Kopyalandı!';
        btn.style.background = '#10b981';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#667eea';
        }, 2000);
      }).catch(() => {
        alert('Kopyalama başarısız. Lütfen manuel olarak seçip kopyalayın.');
      });
    }
  </script>
</body>
</html>`;
        res.send(html);
    }
    escapeHtml(text) {
        if (!text)
            return 'N/A';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};
exports.BiletbankAirSearchController = BiletbankAirSearchController;
__decorate([
    (0, common_1.Post)('airsearch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof air_search_request_dto_1.AirSearchRequestDto !== "undefined" && air_search_request_dto_1.AirSearchRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BiletbankAirSearchController.prototype, "airSearch", null);
__decorate([
    (0, common_1.Get)('airsearch/debug'),
    (0, common_1.Header)('Content-Type', 'text/html; charset=utf-8'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], BiletbankAirSearchController.prototype, "getDebugInfo", null);
exports.BiletbankAirSearchController = BiletbankAirSearchController = BiletbankAirSearchController_1 = __decorate([
    (0, common_1.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof airsearch_service_1.BiletbankAirSearchService !== "undefined" && airsearch_service_1.BiletbankAirSearchService) === "function" ? _a : Object])
], BiletbankAirSearchController);


/***/ },

/***/ "./src/modules/biletbank/air/airsearch/airsearch.mapper.ts"
/*!*****************************************************************!*\
  !*** ./src/modules/biletbank/air/airsearch/airsearch.mapper.ts ***!
  \*****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapAirSearchXmlToFlights = mapAirSearchXmlToFlights;
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
function ensureArray(v) {
    if (!v)
        return [];
    return Array.isArray(v) ? v : [v];
}
function parseBool(v) {
    if (v === undefined || v === null)
        return undefined;
    if (typeof v === 'boolean')
        return v;
    if (typeof v === 'string') {
        const lower = v.toLowerCase();
        if (lower === 'true')
            return true;
        if (lower === 'false')
            return false;
    }
    return undefined;
}
function parsePtTimeToMinutes(pt) {
    if (!pt || typeof pt !== 'string')
        return undefined;
    const m = pt.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (!m)
        return undefined;
    const hours = m[1] ? parseInt(m[1], 10) : 0;
    const mins = m[2] ? parseInt(m[2], 10) : 0;
    const secs = m[3] ? parseInt(m[3], 10) : 0;
    return hours * 60 + mins + (secs ? Math.round(secs / 60) : 0);
}
function addMinutesToDate(dateStr, minutes) {
    if (!dateStr)
        return undefined;
    const base = new Date(dateStr);
    if (Number.isNaN(base.getTime()))
        return undefined;
    return new Date(base.getTime() + minutes * 60_000);
}
function pad2(n) {
    return String(n).padStart(2, '0');
}
function formatHHmm(d) {
    if (!d)
        return '';
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function formatYYYYMMDD(d) {
    if (!d)
        return '';
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function currencySymbol(code) {
    switch ((code || '').toUpperCase()) {
        case 'TRY':
            return '₺';
        case 'EUR':
            return '€';
        case 'USD':
            return '$';
        default:
            return code || '';
    }
}
function mapAirSearchXmlToFlights(rawXml) {
    const emptyResult = { hasError: true, searchId: undefined, shoppingFileId: undefined, flights: [] };
    if (!rawXml || typeof rawXml !== 'string' || rawXml.trim().length === 0) {
        return emptyResult;
    }
    const trimmed = rawXml.trim();
    if (!trimmed.startsWith('<') && !trimmed.startsWith('<?xml')) {
        return emptyResult;
    }
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: true,
        removeNSPrefix: true,
        parseTagValue: true,
        trimValues: true,
        ignoreDeclaration: true,
    });
    let doc;
    try {
        doc = parser.parse(rawXml);
    }
    catch {
        return emptyResult;
    }
    if (!doc || typeof doc !== 'object') {
        return emptyResult;
    }
    const fault = doc?.Envelope?.Body?.Fault ?? doc?.Body?.Fault;
    if (fault) {
        const faultString = fault?.faultstring ?? fault?.FaultString ?? fault?.Reason?.Text ?? 'SOAP Fault';
        return {
            hasError: true,
            searchId: undefined,
            shoppingFileId: undefined,
            flights: [],
        };
    }
    const result = doc?.Envelope?.Body?.AirSearchResponse?.AirSearchResult ??
        doc?.Body?.AirSearchResponse?.AirSearchResult ??
        doc?.AirSearchResponse?.AirSearchResult ??
        doc?.IO_AirSearchResult;
    if (!result) {
        return emptyResult;
    }
    const hasErrorRaw = result?.HasError;
    const hasError = typeof hasErrorRaw === 'boolean'
        ? hasErrorRaw
        : typeof hasErrorRaw === 'string'
            ? hasErrorRaw.toLowerCase() === 'true'
            : undefined;
    const searchId = result?.SearchId;
    const shoppingFileId = result?.ShoppingFileId;
    let options = [];
    if (result?.FlightOptions?.T_FlightOption) {
        options = ensureArray(result.FlightOptions.T_FlightOption);
    }
    else if (Array.isArray(result?.FlightOptions)) {
        options = result.FlightOptions;
    }
    else if (result?.RecommendationBox) {
        const recBox = result.RecommendationBox;
        if (recBox?.FlightOptions?.T_FlightOption) {
            options = ensureArray(recBox.FlightOptions.T_FlightOption);
        }
        else if (Array.isArray(recBox?.FlightOptions)) {
            options = recBox.FlightOptions;
        }
    }
    else if (result?.ProductItem) {
        options = ensureArray(result.ProductItem);
    }
    const flights = options
        .map((opt) => {
        const productId = String(opt?.ProductId || '').trim();
        if (!productId)
            return undefined;
        const segments = ensureArray(opt?.Segments?.T_Segment);
        const firstSeg = segments[0];
        const lastSeg = segments[segments.length - 1];
        const depMinutes = parsePtTimeToMinutes(firstSeg?.DepartureTime);
        const arrMinutes = parsePtTimeToMinutes(lastSeg?.ArrivalTime);
        const depDt = depMinutes !== undefined ? addMinutesToDate(firstSeg?.DepartureDay, depMinutes) : undefined;
        const arrDt = arrMinutes !== undefined ? addMinutesToDate(lastSeg?.ArrivalDay, arrMinutes) : undefined;
        const stopPoints = segments.slice(0, -1).map((s) => s?.DestinationCode).filter(Boolean);
        const currencyCode = String(opt?.Currency || '').trim();
        const brandedRoot = opt?.BrandedFares?.T_BrandedFare_v2 ?? opt?.BrandedFares;
        const baggageAllowancesMap = new Map();
        const freeBaggageRoot = brandedRoot?.FreeBaggageAllowances ?? opt?.FreeBaggageAllowances;
        const baggageAllowances = ensureArray(freeBaggageRoot?.FreeBaggageAllowance);
        baggageAllowances.forEach((bag) => {
            const bagId = Number(bag?.Id);
            if (!bagId || Number.isNaN(bagId))
                return;
            const paxBaggage = bag?.FBA?.PaxBaggageAllowance;
            const paxFBA = Array.isArray(paxBaggage) ? paxBaggage[0] : paxBaggage;
            if (!paxFBA)
                return;
            const allowance = paxFBA?.PaxFBA?.Allowance;
            const unit = paxFBA?.PaxFBA?.Unit;
            const type = paxFBA?.PaxFBA?.Type;
            if (allowance && unit) {
                const unitStr = unit === 'K' ? 'kg' : unit === 'N' ? 'adet' : '';
                const typeStr = type === 'Weight' ? '' : type === 'Piece' ? 'adet' : '';
                baggageAllowancesMap.set(bagId, `${allowance}${unitStr}`);
            }
        });
        const brandedItemsMap = new Map();
        const brandedItemsRaw = brandedRoot?.BrandedItems ?? opt?.BrandedItems;
        let brandedItemsList = [];
        if (brandedItemsRaw) {
            if (Array.isArray(brandedItemsRaw)) {
                brandedItemsList = brandedItemsRaw;
            }
            else if (brandedItemsRaw.BrandedItem) {
                brandedItemsList = ensureArray(brandedItemsRaw.BrandedItem);
            }
            else if (brandedItemsRaw.BrandId) {
                brandedItemsList = [brandedItemsRaw];
            }
        }
        brandedItemsList.forEach((item) => {
            const brandId = String(item?.BrandId || '').trim();
            if (!brandId)
                return;
            const brandCode = item?.BrandCode ? String(item.BrandCode).trim() : undefined;
            const brandName = item?.BrandName ? String(item.BrandName).trim() : undefined;
            const rules = [];
            const brandedRules = ensureArray(item?.BrandedRules?.BrandedRule);
            brandedRules.forEach((rule) => {
                if (rule?.DisplayType === 'Display') {
                    let ruleDescription = undefined;
                    if (rule?.RuleDescription) {
                        if (typeof rule.RuleDescription === 'boolean') {
                            return;
                        }
                        if (typeof rule.RuleDescription === 'string') {
                            const trimmed = rule.RuleDescription.trim();
                            if (trimmed === 'true' || trimmed === 'false') {
                                return;
                            }
                            ruleDescription = trimmed;
                        }
                        else if (typeof rule.RuleDescription === 'object' && rule.RuleDescription !== null) {
                            const descObj = rule.RuleDescription;
                            ruleDescription =
                                descObj.text ? String(descObj.text).trim() :
                                    descObj.value ? String(descObj.value).trim() :
                                        descObj._text ? String(descObj._text).trim() :
                                            descObj._ ? String(descObj._).trim() :
                                                Array.isArray(descObj) && descObj.length > 0 ? String(descObj[0]).trim() :
                                                    Object.keys(descObj).length === 1 && descObj[Object.keys(descObj)[0]]
                                                        ? String(descObj[Object.keys(descObj)[0]]).trim() :
                                                        undefined;
                        }
                        else {
                            ruleDescription = String(rule.RuleDescription).trim();
                        }
                    }
                    if (!ruleDescription || ruleDescription === 'undefined' || ruleDescription === 'null' || ruleDescription === 'true' || ruleDescription === 'false') {
                        return;
                    }
                    rules.push({
                        application: rule?.Application ? String(rule.Application).trim() : undefined,
                        displayType: rule?.DisplayType ? String(rule.DisplayType).trim() : undefined,
                        ruleDescription,
                        serviceGroup: rule?.ServiceGroup ? String(rule.ServiceGroup).trim() : undefined,
                    });
                }
            });
            brandedItemsMap.set(brandId, { brandCode, brandName, rules });
        });
        const brandedFareItems = ensureArray(brandedRoot?.BrandedFareItems?.BrandedFareItem);
        const brandOptions = brandedFareItems
            .map((item) => {
            const id = String(item?.BrandedFareItemId ?? '').trim();
            if (!id)
                return undefined;
            const passengersRaw = item?.BrandedFarePassengers?.BrandedFarePassenger;
            const passenger = Array.isArray(passengersRaw) ? passengersRaw[0] : passengersRaw;
            const fareComponentsRaw = passenger?.FareComponents?.FareComponent;
            const fareComp = Array.isArray(fareComponentsRaw) ? fareComponentsRaw[0] : fareComponentsRaw;
            const brandId = fareComp?.BrandId ? String(fareComp.BrandId).trim() : undefined;
            const baggageAllowanceIdRaw = fareComp?.FreeBaggageAllowanceId;
            const baggageAllowanceId = baggageAllowanceIdRaw !== undefined && baggageAllowanceIdRaw !== null
                ? Number(baggageAllowanceIdRaw)
                : undefined;
            const brandedItemInfo = brandId ? brandedItemsMap.get(brandId) : undefined;
            const brandCodeRaw = brandedItemInfo?.brandCode ?? (fareComp?.BrandCode ? String(fareComp.BrandCode).trim() : undefined);
            const brandNameRaw = brandedItemInfo?.brandName ?? (fareComp?.BrandName ? String(fareComp.BrandName).trim() : undefined);
            const rules = brandedItemInfo?.rules ?? [];
            const baggageDescriptionRaw = baggageAllowanceId ? baggageAllowancesMap.get(baggageAllowanceId) : undefined;
            const totalFare = Number(item?.TotalFareInfo?.TotalFare ?? 0) || 0;
            const totalTaxes = Number(item?.TotalFareInfo?.TotalTaxes ?? 0) || 0;
            const brandCode = brandCodeRaw && brandCodeRaw.trim() ? brandCodeRaw.trim() : (brandNameRaw && brandNameRaw.trim() ? brandNameRaw.trim() : 'Paket');
            const brandName = brandNameRaw && brandNameRaw.trim() ? brandNameRaw.trim() : (brandCodeRaw && brandCodeRaw.trim() ? brandCodeRaw.trim() : 'Paket');
            const baggageDescription = (baggageDescriptionRaw && String(baggageDescriptionRaw).trim()) ? String(baggageDescriptionRaw).trim() : undefined;
            return {
                id,
                brandId: brandId ?? undefined,
                brandCode,
                brandName,
                baggageAllowanceId: baggageAllowanceId ?? undefined,
                baggageDescription,
                rules,
                totalFare,
                totalTaxes,
                currency: currencySymbol(currencyCode),
            };
        })
            .filter(Boolean);
        return {
            id: productId,
            airline: String(firstSeg?.MarketingAirline || opt?.ValidatingCarrier || opt?.BookingProvider || '').trim() || 'N/A',
            airlineLogo: String(firstSeg?.MarketingAirline || opt?.ValidatingCarrier || '').trim() || '—',
            flightNumber: String(firstSeg?.FlightNumber || '').trim() || '—',
            departure: {
                airport: '',
                airportCode: String(firstSeg?.OriginCode || '').trim() || '—',
                city: '',
                time: formatHHmm(depDt) || '',
                date: formatYYYYMMDD(depDt) || (String(firstSeg?.DepartureDay || '').split('T')[0] || ''),
            },
            arrival: {
                airport: '',
                airportCode: String(lastSeg?.DestinationCode || '').trim() || '—',
                city: '',
                time: formatHHmm(arrDt) || '',
                date: formatYYYYMMDD(arrDt) || (String(lastSeg?.ArrivalDay || '').split('T')[0] || ''),
            },
            duration: segments.length === 1
                ? String(firstSeg?.Duration || '').trim() || ''
                : '',
            stops: Math.max(segments.length - 1, 0),
            stopDetails: stopPoints.length ? stopPoints.join(', ') : undefined,
            price: brandOptions.length > 0
                ? Math.min(...brandOptions.map(b => b.totalFare))
                : Number(opt?.TotalFare ?? opt?.NetFare ?? 0) || 0,
            currency: currencySymbol(currencyCode),
            baggage: (() => {
                if (brandOptions.length > 0) {
                    const cheapest = brandOptions.reduce((min, b) => b.totalFare < min.totalFare ? b : min, brandOptions[0]);
                    return cheapest?.baggageDescription || '-';
                }
                return '-';
            })(),
            cabinClass: (() => {
                if (brandOptions.length > 0) {
                    const cheapest = brandOptions.reduce((min, b) => b.totalFare < min.totalFare ? b : min, brandOptions[0]);
                    if (cheapest?.brandName)
                        return cheapest.brandName;
                    if (cheapest?.brandCode)
                        return cheapest.brandCode;
                }
                const segCabinClass = String(firstSeg?.CabinClass || '').trim();
                return segCabinClass || 'Economy';
            })(),
            aircraft: firstSeg?.Equipment ? String(firstSeg.Equipment) : undefined,
            segments: segments.map((s) => {
                const sDepMin = parsePtTimeToMinutes(s?.DepartureTime);
                const sArrMin = parsePtTimeToMinutes(s?.ArrivalTime);
                const sDep = sDepMin !== undefined ? addMinutesToDate(s?.DepartureDay, sDepMin) : undefined;
                const sArr = sArrMin !== undefined ? addMinutesToDate(s?.ArrivalDay, sArrMin) : undefined;
                return {
                    id: s?.Id ? String(s.Id) : undefined,
                    marketingAirline: s?.MarketingAirline,
                    operatingAirline: s?.OperatingAirline,
                    flightNumber: s?.FlightNumber,
                    cabinClass: s?.CabinClass || s?.Cabin,
                    bookingClass: s?.BookingClass,
                    fareBasis: s?.FareBasis,
                    fareType: (() => {
                        const ft = s?.FareType;
                        if (!ft)
                            return undefined;
                        if (typeof ft === 'string')
                            return ft;
                        if (ft?.string)
                            return Array.isArray(ft.string) ? ft.string[0] : ft.string;
                        return undefined;
                    })(),
                    originCode: s?.OriginCode,
                    destinationCode: s?.DestinationCode,
                    countryCodeOfOrigin: s?.CountryCodeOfOriginAirport,
                    countryCodeOfDestination: s?.CountryCodeOfDestinationAirport,
                    departureDateTime: sDep ? sDep.toISOString() : undefined,
                    arrivalDateTime: sArr ? sArr.toISOString() : undefined,
                    duration: s?.Duration,
                    hasTechnicalStop: parseBool(s?.HasTechnicalStop),
                };
            }),
            brandOptions,
            optionFlag: opt?.OptionFlag ? String(opt.OptionFlag) : undefined,
            bookingProvider: opt?.BookingProvider ? String(opt.BookingProvider) : undefined,
            bookingProviderId: opt?.BookingProviderId ? Number(opt.BookingProviderId) : undefined,
            validatingCarrier: opt?.ValidatingCarrier ? String(opt.ValidatingCarrier) : undefined,
            contentType: opt?.ContentType ? String(opt.ContentType) : undefined,
            pricingType: opt?.PricingType ? String(opt.PricingType) : undefined,
            isRefundable: parseBool(opt?.FlightRuleAttribute?.IsRefundable ?? opt?.IsRefundable),
            isReservable: parseBool(opt?.FlightRuleAttribute?.IsReservable ?? opt?.IsReservable),
            isVoidable: parseBool(opt?.FlightRuleAttribute?.IsVoidable),
            isCharter: parseBool(opt?.IsCharter),
            isLowCost: parseBool(opt?.IsLowCost),
            isNdc: parseBool(opt?.IsNdc),
            isEticket: parseBool(opt?.IsEticket),
            isFlexSC: parseBool(opt?.IsFlexSC),
        };
    })
        .filter(Boolean);
    return { hasError, searchId, shoppingFileId, flights };
}


/***/ },

/***/ "./src/modules/biletbank/air/airsearch/airsearch.module.ts"
/*!*****************************************************************!*\
  !*** ./src/modules/biletbank/air/airsearch/airsearch.module.ts ***!
  \*****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankAirSearchModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ../../auth/auth.module */ "./src/modules/biletbank/auth/auth.module.ts");
const auth_module_2 = __webpack_require__(/*! ../../../auth/auth.module */ "./src/modules/auth/auth.module.ts");
const airsearch_controller_1 = __webpack_require__(/*! ./airsearch.controller */ "./src/modules/biletbank/air/airsearch/airsearch.controller.ts");
const airsearch_service_1 = __webpack_require__(/*! ./airsearch.service */ "./src/modules/biletbank/air/airsearch/airsearch.service.ts");
const booking_auth_guard_1 = __webpack_require__(/*! ../../guards/booking-auth.guard */ "./src/modules/biletbank/guards/booking-auth.guard.ts");
let BiletbankAirSearchModule = class BiletbankAirSearchModule {
};
exports.BiletbankAirSearchModule = BiletbankAirSearchModule;
exports.BiletbankAirSearchModule = BiletbankAirSearchModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.BiletbankAuthModule, auth_module_2.AuthModule],
        controllers: [airsearch_controller_1.BiletbankAirSearchController],
        providers: [airsearch_service_1.BiletbankAirSearchService, booking_auth_guard_1.BookingAuthGuard],
    })
], BiletbankAirSearchModule);


/***/ },

/***/ "./src/modules/biletbank/air/airsearch/airsearch.service.ts"
/*!******************************************************************!*\
  !*** ./src/modules/biletbank/air/airsearch/airsearch.service.ts ***!
  \******************************************************************/
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
var BiletbankAirSearchService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankAirSearchService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ../../auth/auth.service */ "./src/modules/biletbank/auth/auth.service.ts");
const biletbank_config_1 = __webpack_require__(/*! ../../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const soap_transport_1 = __webpack_require__(/*! ../../common/soap.transport */ "./src/modules/biletbank/common/soap.transport.ts");
const airsearch_mapper_1 = __webpack_require__(/*! ./airsearch.mapper */ "./src/modules/biletbank/air/airsearch/airsearch.mapper.ts");
let BiletbankAirSearchService = BiletbankAirSearchService_1 = class BiletbankAirSearchService {
    auth;
    cfg;
    logger = new common_1.Logger(BiletbankAirSearchService_1.name);
    lastRequestXml = null;
    lastResponseXml = null;
    lastRequestParams = null;
    lastResponse = null;
    constructor(auth, cfg) {
        this.auth = auth;
        this.cfg = cfg;
    }
    getLastDebugInfo() {
        return {
            requestParams: this.lastRequestParams,
            requestXml: this.lastRequestXml,
            responseXml: this.lastResponseXml,
            response: this.lastResponse,
            timestamp: new Date().toISOString(),
        };
    }
    async airSearch(dto) {
        try {
            const c = this.cfg.config;
            const loginResult = await this.auth.login();
            if (!loginResult.isValid || !loginResult.sessionToken || !loginResult.sessionId) {
                this.logger.error('AirSearch: Login failed', {
                    isValid: loginResult.isValid,
                    hasSessionToken: !!loginResult.sessionToken,
                    hasSessionId: !!loginResult.sessionId,
                });
                throw new common_1.HttpException('BiletBank oturumu açılamadı. Lütfen tekrar deneyin.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const toSoapDate = (d) => `${d}T00:00:00`;
            const departureSoap = toSoapDate(dto.departureDate);
            const returnSoap = dto.returnDate ? toSoapDate(dto.returnDate) : undefined;
            const requestParams = {
                tripType: dto.tripType,
                originCode: dto.originCode,
                originCountryCode: dto.originCountryCode,
                originIsCity: dto.originIsCity,
                destinationCode: dto.destinationCode,
                destinationCountryCode: dto.destinationCountryCode,
                destinationIsCity: dto.destinationIsCity,
                departureDate: dto.departureDate,
                returnDate: dto.returnDate,
                adults: dto.adults,
                children: dto.children,
                infants: dto.infants,
                searchReason: dto.searchReason,
            };
            this.logger.log('AirSearch request params', requestParams);
            this.lastRequestParams = requestParams;
            const paxItems = [
                `<trev2:T_AirSearch_PaxItem>
                     <trev2:PaxCode>ADT</trev2:PaxCode>
                     <trev2:PaxCount>${dto.adults}</trev2:PaxCount>
                  </trev2:T_AirSearch_PaxItem>`,
            ];
            if (dto.children && dto.children > 0) {
                paxItems.push(`<trev2:T_AirSearch_PaxItem>
                     <trev2:PaxCode>CHD</trev2:PaxCode>
                     <trev2:PaxCount>${dto.children}</trev2:PaxCount>
                  </trev2:T_AirSearch_PaxItem>`);
            }
            if (dto.infants && dto.infants > 0) {
                paxItems.push(`<trev2:T_AirSearch_PaxItem>
                     <trev2:PaxCode>INF</trev2:PaxCode>
                     <trev2:PaxCount>${dto.infants}</trev2:PaxCount>
                  </trev2:T_AirSearch_PaxItem>`);
            }
            const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base" xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping" xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Air" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:AirSearch>
         <tem:request>
            <trev:EndUserInfo>
               <trev:EndUserBrowserAgent>DefaultBrowser</trev:EndUserBrowserAgent>
               <trev:EndUserIpAddress>127.0.0.1</trev:EndUserIpAddress>
               <trev:RequestOrigin>DefaultRequestOrigin</trev:RequestOrigin>
            </trev:EndUserInfo>
            <trev:AuthenticationHeader>
               <trev:SessionId>${loginResult.sessionId}</trev:SessionId>
               <trev:SessionToken>${loginResult.sessionToken}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList>
               <trev:ExtendedData>
                  <trev:Name>BrandedFareVersion</trev:Name>
                  <trev:Type i:nil="true"/>
                  <trev:Value>v2</trev:Value>
               </trev:ExtendedData>
            </trev:ExtraParamList>
            <trev1:CreateNewShoppingFile>true</trev1:CreateNewShoppingFile>
            <trev1:Form>
               <trev2:CorporateFares i:nil="true"/>
               <trev2:FlightType>${dto.tripType}</trev2:FlightType>
               <trev2:IsStatelessRequest>false</trev2:IsStatelessRequest>
               <trev2:Options>
                  <trev2:CombinablePrice i:nil="true"/>
                  <trev2:FlightClass>Economy</trev2:FlightClass>
                  <trev2:FlightWithBaggage>false</trev2:FlightWithBaggage>
                  <trev2:IfDirectFlightsOnly>false</trev2:IfDirectFlightsOnly>
                  <trev2:IfRefundablesOnly>false</trev2:IfRefundablesOnly>
                  <trev2:PreferedAirlines i:nil="true" xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays"/>
                  <trev2:SearchTimeoutMilliseconds>20000</trev2:SearchTimeoutMilliseconds>
               </trev2:Options>
               <trev2:PaxItems>
                  ${paxItems.join('\n                  ')}
               </trev2:PaxItems>
               <trev2:Segments>
                  <trev2:T_AirSearch_SegmentItem>
                     <trev2:DepartureDay>${departureSoap}</trev2:DepartureDay>
                     <trev2:Destination>
                        <trev2:Code>${dto.destinationCode}</trev2:Code>
                        <trev2:CountryCode>${dto.destinationCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.destinationIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Destination>
                     <trev2:Origin>
                        <trev2:Code>${dto.originCode}</trev2:Code>
                        <trev2:CountryCode>${dto.originCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.originIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Origin>
                     <trev2:SequenceNo>1</trev2:SequenceNo>
                  </trev2:T_AirSearch_SegmentItem>${returnSoap ? `
                  <trev2:T_AirSearch_SegmentItem>
                     <trev2:DepartureDay>${returnSoap}</trev2:DepartureDay>
                     <trev2:Destination>
                        <trev2:Code>${dto.originCode}</trev2:Code>
                        <trev2:CountryCode>${dto.originCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.originIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Destination>
                     <trev2:Origin>
                        <trev2:Code>${dto.destinationCode}</trev2:Code>
                        <trev2:CountryCode>${dto.destinationCountryCode}</trev2:CountryCode>
                        <trev2:IsCity>${dto.destinationIsCity}</trev2:IsCity>
                        <trev2:Name/>
                     </trev2:Origin>
                     <trev2:SequenceNo>2</trev2:SequenceNo>
                  </trev2:T_AirSearch_SegmentItem>` : ''}
               </trev2:Segments>
            </trev1:Form>
         </tem:request>
      </tem:AirSearch>
   </soapenv:Body>
</soapenv:Envelope>`;
            this.lastRequestXml = xml;
            this.logger.log('=== AirSearch REQUEST XML ===');
            this.logger.log(xml);
            this.logger.log('=== END REQUEST XML ===');
            let rawXml = '';
            try {
                const result = await (0, soap_transport_1.soapPost)({
                    url: c.apiUrl,
                    clientKey: c.clientKey,
                    soapAction: 'http://tempuri.org/I_Shopping/AirSearch',
                    xml,
                    timeoutMs: 30000,
                });
                rawXml = result?.rawXml || String(result?.rawXml || '');
                this.logger.log('SOAP Post result:', {
                    hasRawXml: !!result?.rawXml,
                    rawXmlType: typeof result?.rawXml,
                    rawXmlLength: rawXml?.length || 0
                });
            }
            catch (error) {
                rawXml = error?.response?.data || error?.response?.data?.toString() || error?.message || 'Error: No response received';
                this.logger.error('AirSearch SOAP error', {
                    message: error?.message,
                    response: error?.response?.data ? String(error.response.data).substring(0, 500) : 'No response data',
                    stack: error?.stack,
                });
            }
            const responseXmlString = rawXml ? String(rawXml) : '';
            this.lastResponseXml = responseXmlString || 'No response received';
            this.logger.log('=== AirSearch RESPONSE XML ===');
            this.logger.log('rawXml type:', typeof rawXml, 'length:', rawXml?.length || 0);
            this.logger.log('responseXmlString:', responseXmlString?.substring(0, 200) || 'EMPTY');
            this.logger.log('lastResponseXml BEFORE:', this.lastResponseXml?.substring(0, 200) || 'NULL');
            this.logger.log('=== END RESPONSE XML ===');
            this.logger.log('Response XML saved, length:', responseXmlString?.length || 0);
            this.logger.log('lastResponseXml AFTER set:', !!this.lastResponseXml, 'length:', this.lastResponseXml?.length || 0);
            this.logger.log('lastResponseXml value preview:', this.lastResponseXml?.substring(0, 200) || 'EMPTY');
            const mapped = (0, airsearch_mapper_1.mapAirSearchXmlToFlights)(rawXml);
            this.logger.log('AirSearch response', {
                hasError: mapped.hasError,
                searchId: mapped.searchId,
                shoppingFileId: mapped.shoppingFileId,
                flightsCount: mapped.flights?.length || 0,
                firstFlight: mapped.flights?.[0] ? {
                    id: mapped.flights[0].id,
                    airline: mapped.flights[0].airline,
                    price: mapped.flights[0].price,
                } : null,
            });
            const response = {
                success: true,
                message: 'AirSearch completed',
                hasError: mapped.hasError,
                searchId: mapped.searchId,
                shoppingFileId: mapped.shoppingFileId,
                sessionId: loginResult.sessionId,
                sessionToken: loginResult.sessionToken,
                flights: mapped.flights,
            };
            this.lastResponse = response;
            return response;
        }
        catch (error) {
            this.lastResponse = {
                success: false,
                message: error?.message || 'Bilinmeyen hata',
                hasError: true,
            };
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error('AirSearch service error', {
                error: error?.message,
                stack: error?.stack,
                dto: dto,
            });
            throw new common_1.HttpException({
                success: false,
                message: error?.message || 'Uçuş arama sırasında bir hata oluştu.',
                error: 'AirSearch Service Error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BiletbankAirSearchService = BiletbankAirSearchService;
exports.BiletbankAirSearchService = BiletbankAirSearchService = BiletbankAirSearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.BiletbankAuthService !== "undefined" && auth_service_1.BiletbankAuthService) === "function" ? _a : Object, typeof (_b = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _b : Object])
], BiletbankAirSearchService);


/***/ },

/***/ "./src/modules/biletbank/air/allocate/allocate.controller.ts"
/*!*******************************************************************!*\
  !*** ./src/modules/biletbank/air/allocate/allocate.controller.ts ***!
  \*******************************************************************/
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
exports.BiletbankAllocateController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const allocate_request_dto_1 = __webpack_require__(/*! ../../dto/allocate-request.dto */ "./src/modules/biletbank/dto/allocate-request.dto.ts");
const allocate_service_1 = __webpack_require__(/*! ./allocate.service */ "./src/modules/biletbank/air/allocate/allocate.service.ts");
let BiletbankAllocateController = class BiletbankAllocateController {
    allocateService;
    constructor(allocateService) {
        this.allocateService = allocateService;
    }
    async allocate(body) {
        return await this.allocateService.allocate(body);
    }
};
exports.BiletbankAllocateController = BiletbankAllocateController;
__decorate([
    (0, common_1.Post)('allocate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof allocate_request_dto_1.AllocateRequestDto !== "undefined" && allocate_request_dto_1.AllocateRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BiletbankAllocateController.prototype, "allocate", null);
exports.BiletbankAllocateController = BiletbankAllocateController = __decorate([
    (0, common_1.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof allocate_service_1.BiletbankAllocateService !== "undefined" && allocate_service_1.BiletbankAllocateService) === "function" ? _a : Object])
], BiletbankAllocateController);


/***/ },

/***/ "./src/modules/biletbank/air/allocate/allocate.mapper.ts"
/*!***************************************************************!*\
  !*** ./src/modules/biletbank/air/allocate/allocate.mapper.ts ***!
  \***************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapAllocateXmlToResponse = mapAllocateXmlToResponse;
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
function mapAllocateXmlToResponse(rawXml) {
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: true,
        parseTagValue: true,
        parseAttributeValue: true,
        trimValues: true,
    });
    const doc = parser.parse(rawXml);
    const result = doc?.Envelope?.Body?.AllocateResponse?.AllocateResult ??
        doc?.Body?.AllocateResponse?.AllocateResult ??
        doc?.AllocateResponse?.AllocateResult;
    const hasErrorRaw = result?.HasError;
    const hasError = typeof hasErrorRaw === 'boolean'
        ? hasErrorRaw
        : typeof hasErrorRaw === 'string'
            ? hasErrorRaw.toLowerCase() === 'true'
            : false;
    const errorMessage = result?.ServiceError?.ErrorMessage ||
        result?.ServiceError?.DebugMessage ||
        result?.ErrorMessage ||
        undefined;
    let allocateId = result?.AllocateId || result?.ProductItemId;
    let productId = result?.ProductItemId;
    const shoppingFileId = result?.ShoppingFileId;
    const paxReferences = [];
    if (result?.ShoppingFile) {
        const sf = result.ShoppingFile;
        const bookingNode = sf?.AirBookings?.T_AirBooking;
        const bookings = Array.isArray(bookingNode) ? bookingNode : bookingNode ? [bookingNode] : [];
        for (const booking of bookings) {
            const bi = booking?.BookingItems;
            const items = bi?.T_AirBookingItem ?? bi?.AirBookingItem ?? bi?.T_BookingItem;
            const itemList = Array.isArray(items) ? items : items ? [items] : [];
            for (const item of itemList) {
                if (!productId) {
                    const extracted = item?.ProductItemId;
                    if (extracted) {
                        productId = String(extracted).trim();
                        if (!allocateId)
                            allocateId = productId;
                    }
                }
                const refs = item?.PaxReference;
                const refList = Array.isArray(refs) ? refs : refs ? [refs] : [];
                for (const r of refList) {
                    const seqNo = r?.LocalSequenceNo !== undefined ? Number(r.LocalSequenceNo) : undefined;
                    const pid = r?.PassengerId ? String(r.PassengerId).trim() : undefined;
                    const prid = r?.PaxReferenceId ? String(r.PaxReferenceId).trim() : undefined;
                    paxReferences.push({ localSequenceNo: seqNo, passengerId: pid, paxReferenceId: prid });
                }
            }
        }
    }
    return {
        hasError,
        errorMessage: errorMessage ? String(errorMessage).trim() : undefined,
        allocateId: allocateId ? String(allocateId).trim() : undefined,
        productId: productId ? String(productId).trim() : undefined,
        shoppingFileId: shoppingFileId ? String(shoppingFileId).trim() : undefined,
        paxReferences: paxReferences.length > 0 ? paxReferences : undefined,
        details: result,
    };
}


/***/ },

/***/ "./src/modules/biletbank/air/allocate/allocate.module.ts"
/*!***************************************************************!*\
  !*** ./src/modules/biletbank/air/allocate/allocate.module.ts ***!
  \***************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankAllocateModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ../../auth/auth.module */ "./src/modules/biletbank/auth/auth.module.ts");
const auth_module_2 = __webpack_require__(/*! ../../../auth/auth.module */ "./src/modules/auth/auth.module.ts");
const allocate_controller_1 = __webpack_require__(/*! ./allocate.controller */ "./src/modules/biletbank/air/allocate/allocate.controller.ts");
const allocate_service_1 = __webpack_require__(/*! ./allocate.service */ "./src/modules/biletbank/air/allocate/allocate.service.ts");
const booking_auth_guard_1 = __webpack_require__(/*! ../../guards/booking-auth.guard */ "./src/modules/biletbank/guards/booking-auth.guard.ts");
let BiletbankAllocateModule = class BiletbankAllocateModule {
};
exports.BiletbankAllocateModule = BiletbankAllocateModule;
exports.BiletbankAllocateModule = BiletbankAllocateModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.BiletbankAuthModule, auth_module_2.AuthModule],
        controllers: [allocate_controller_1.BiletbankAllocateController],
        providers: [allocate_service_1.BiletbankAllocateService, booking_auth_guard_1.BookingAuthGuard],
        exports: [allocate_service_1.BiletbankAllocateService],
    })
], BiletbankAllocateModule);


/***/ },

/***/ "./src/modules/biletbank/air/allocate/allocate.service.ts"
/*!****************************************************************!*\
  !*** ./src/modules/biletbank/air/allocate/allocate.service.ts ***!
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
var BiletbankAllocateService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankAllocateService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const biletbank_config_1 = __webpack_require__(/*! ../../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const soap_transport_1 = __webpack_require__(/*! ../../common/soap.transport */ "./src/modules/biletbank/common/soap.transport.ts");
const allocate_mapper_1 = __webpack_require__(/*! ./allocate.mapper */ "./src/modules/biletbank/air/allocate/allocate.mapper.ts");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
function maskSessionId(sessionId) {
    if (!sessionId || sessionId.length < 4)
        return 'SESS-***';
    return `SESS-${sessionId.substring(0, 2)}***${sessionId.substring(sessionId.length - 2)}`;
}
function maskSessionToken(token) {
    if (!token || token.length < 4)
        return 'TOK-***';
    return `TOK-${token.substring(0, 2)}***${token.substring(token.length - 2)}`;
}
let BiletbankAllocateService = BiletbankAllocateService_1 = class BiletbankAllocateService {
    cfg;
    logger = new common_1.Logger(BiletbankAllocateService_1.name);
    constructor(cfg) {
        this.cfg = cfg;
    }
    async allocate(dto) {
        const startTime = Date.now();
        const correlationId = (0, crypto_1.randomUUID)();
        const c = this.cfg.config;
        if (!dto.sessionId || !dto.sessionToken) {
            this.logger.warn('Allocate validation failed: Session missing', {
                correlationId,
                hasSessionId: !!dto.sessionId,
                hasSessionToken: !!dto.sessionToken,
            });
            throw new common_1.BadRequestException('Session bilgileri eksik. Lütfen önce uçuş araması yapın.');
        }
        if (!dto.productId || typeof dto.productId !== 'string' || dto.productId.trim().length === 0) {
            this.logger.warn('Allocate validation failed: ProductId missing or invalid', {
                correlationId,
                productId: dto.productId,
            });
            throw new common_1.BadRequestException('ProductId gereklidir ve geçerli olmalıdır.');
        }
        const amount = dto.selectedServiceFeeAmount ?? 0;
        if (amount < 0) {
            this.logger.warn('Allocate validation failed: Amount is negative', {
                correlationId,
                amount,
                productId: dto.productId,
            });
            throw new common_1.BadRequestException('SelectedServiceFeeAmount negatif olamaz.');
        }
        this.logger.log('Allocate started', {
            correlationId,
            sessionId: maskSessionId(dto.sessionId),
            sessionToken: maskSessionToken(dto.sessionToken),
            productId: dto.productId,
            brandedFareItemId: dto.brandedFareItemId || '(none)',
            amount,
        });
        const amountFormatted = Number(amount).toFixed(2);
        const xml = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:base="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:io="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:Allocate>
      <tem:request>
        <base:AuthenticationHeader>
          <base:SessionId>${dto.sessionId}</base:SessionId>
          <base:SessionToken>${dto.sessionToken}</base:SessionToken>
        </base:AuthenticationHeader>
        <io:Form>
          <io:SelectedItems>
            <io:IO_AllocationItem>
              ${dto.brandedFareItemId ? `<io:BrandedFareItemId>${dto.brandedFareItemId.trim()}</io:BrandedFareItemId>` : ''}
              <io:ProductId>${dto.productId.trim()}</io:ProductId>
              <io:SelectedServiceFee>
                <io:Amount>${amountFormatted}</io:Amount>
              </io:SelectedServiceFee>
            </io:IO_AllocationItem>
          </io:SelectedItems>
        </io:Form>
      </tem:request>
    </tem:Allocate>
  </soapenv:Body>
</soapenv:Envelope>`;
        try {
            const { rawXml } = await (0, soap_transport_1.soapPost)({
                url: c.apiUrl,
                clientKey: c.clientKey,
                soapAction: 'http://tempuri.org/I_Shopping/Allocate',
                xml,
                timeoutMs: 30000,
            });
            const elapsedTime = Date.now() - startTime;
            const mapped = (0, allocate_mapper_1.mapAllocateXmlToResponse)(rawXml);
            if (mapped.hasError) {
                const errorMessage = mapped.errorMessage || 'Koltuk tahsisi yapılamadı.';
                if (errorMessage.toLowerCase().includes('session') ||
                    errorMessage.toLowerCase().includes('unauthorized') ||
                    errorMessage.toLowerCase().includes('invalid session')) {
                    this.logger.warn('Allocate failed: Session invalid/expired', {
                        correlationId,
                        errorMessage,
                        productId: dto.productId,
                        elapsedTime,
                        sessionId: maskSessionId(dto.sessionId),
                    });
                    throw new common_1.UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
                }
                if (errorMessage.toLowerCase().includes('not found') ||
                    errorMessage.toLowerCase().includes('allocated product') ||
                    errorMessage.toLowerCase().includes('product') && errorMessage.toLowerCase().includes('available')) {
                    this.logger.warn('Allocate failed: Product not available', {
                        correlationId,
                        errorMessage,
                        productId: dto.productId,
                        elapsedTime,
                    });
                    throw new common_1.BadRequestException('Seçilen uçuş artık mevcut değil. Lütfen yeni bir arama yapın.');
                }
                this.logger.error('Allocate failed', {
                    correlationId,
                    errorMessage,
                    productId: dto.productId,
                    amount,
                    elapsedTime,
                    sessionId: maskSessionId(dto.sessionId),
                    sessionToken: maskSessionToken(dto.sessionToken),
                });
                throw new common_1.BadRequestException(errorMessage);
            }
            const elapsedTimeSuccess = Date.now() - startTime;
            this.logger.log('Allocate success', {
                correlationId,
                productId: dto.productId,
                allocateId: mapped.allocateId,
                allocateProductId: mapped.productId,
                paxReferences: mapped.paxReferences,
                amount,
                elapsedTime: elapsedTimeSuccess,
            });
            return {
                success: true,
                message: 'Koltuk tahsisi başarılı',
                allocateId: mapped.allocateId,
                productId: mapped.productId,
                shoppingFileId: mapped.shoppingFileId,
                paxReferences: mapped.paxReferences,
                details: mapped.details,
                correlationId,
            };
        }
        catch (error) {
            const elapsedTime = Date.now() - startTime;
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error('Allocate error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                productId: dto.productId,
                amount,
                elapsedTime,
                sessionId: maskSessionId(dto.sessionId),
                sessionToken: maskSessionToken(dto.sessionToken),
            });
            throw new common_1.InternalServerErrorException('Koltuk tahsisi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
};
exports.BiletbankAllocateService = BiletbankAllocateService;
exports.BiletbankAllocateService = BiletbankAllocateService = BiletbankAllocateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _a : Object])
], BiletbankAllocateService);


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/finalizeshopping.controller.ts"
/*!******************************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/finalizeshopping.controller.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankFinalizeShoppingController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const finalizeshopping_request_dto_1 = __webpack_require__(/*! ../../dto/finalizeshopping-request.dto */ "./src/modules/biletbank/dto/finalizeshopping-request.dto.ts");
const finalizeshopping_service_1 = __webpack_require__(/*! ./finalizeshopping.service */ "./src/modules/biletbank/air/makepayment/finalizeshopping.service.ts");
let BiletbankFinalizeShoppingController = class BiletbankFinalizeShoppingController {
    service;
    constructor(service) {
        this.service = service;
    }
    async finalizeShopping(body) {
        return await this.service.finalizeShopping(body);
    }
};
exports.BiletbankFinalizeShoppingController = BiletbankFinalizeShoppingController;
__decorate([
    (0, common_1.Post)('finalize-shopping'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof finalizeshopping_request_dto_1.FinalizeShoppingRequestDto !== "undefined" && finalizeshopping_request_dto_1.FinalizeShoppingRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BiletbankFinalizeShoppingController.prototype, "finalizeShopping", null);
exports.BiletbankFinalizeShoppingController = BiletbankFinalizeShoppingController = __decorate([
    (0, common_1.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof finalizeshopping_service_1.BiletbankFinalizeShoppingService !== "undefined" && finalizeshopping_service_1.BiletbankFinalizeShoppingService) === "function" ? _a : Object])
], BiletbankFinalizeShoppingController);


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/finalizeshopping.mapper.ts"
/*!**************************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/finalizeshopping.mapper.ts ***!
  \**************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapFinalizeShoppingXmlToResponse = mapFinalizeShoppingXmlToResponse;
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
function isXmlNil(val) {
    if (typeof val !== 'object' || val === null)
        return false;
    const o = val;
    return o['nil'] === true || o['nil'] === 'true' || o['i:nil'] === 'true';
}
function safeStr(val) {
    if (val === undefined || val === null || isXmlNil(val))
        return undefined;
    const s = String(val).trim();
    return s.length > 0 && s !== 'null' ? s : undefined;
}
function safeNum(val) {
    if (val === undefined || val === null || isXmlNil(val))
        return undefined;
    const n = parseFloat(String(val));
    return isNaN(n) ? undefined : n;
}
function safeBool(val) {
    if (val === undefined || val === null)
        return undefined;
    if (typeof val === 'boolean')
        return val;
    const s = String(val).toLowerCase();
    if (s === 'true')
        return true;
    if (s === 'false')
        return false;
    return undefined;
}
function mapFinalizeShoppingXmlToResponse(rawXml) {
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: true,
        parseTagValue: true,
        parseAttributeValue: true,
        trimValues: true,
    });
    const doc = parser.parse(rawXml);
    const result = doc?.Envelope?.Body?.FinalizeShoppingResponse?.FinalizeShoppingResult ??
        doc?.Body?.FinalizeShoppingResponse?.FinalizeShoppingResult ??
        doc?.FinalizeShoppingResponse?.FinalizeShoppingResult;
    const hasError = (() => {
        const v = result?.HasError;
        if (typeof v === 'boolean')
            return v;
        if (typeof v === 'string')
            return v.toLowerCase() === 'true';
        return true;
    })();
    const errorMessage = safeStr(result?.ServiceError?.ErrorMessage) ??
        safeStr(result?.ServiceError?.DebugMessage);
    const sf = result?.ShoppingFile;
    const airBooking = (() => {
        const ab = sf?.AirBookings?.T_AirBooking;
        return Array.isArray(ab) ? ab[0] : ab;
    })();
    const payment = (() => {
        const p = sf?.Payments?.T_Payment ?? sf?.Payments?.Payment;
        return Array.isArray(p) ? p[0] : p;
    })();
    const passenger = (() => {
        const p = sf?.Passengers?.T_Passenger;
        return Array.isArray(p) ? p[0] : p;
    })();
    return {
        hasError,
        errorMessage,
        ifFinalized: safeBool(sf?.IfFinalized),
        bookingCode: safeStr(airBooking?.BookingCode),
        status: safeStr(airBooking?.Status),
        totalFare: safeNum(airBooking?.TotalFare),
        currency: safeStr(airBooking?.Currency),
        shoppingFileId: safeStr(sf?.Id),
        paymentAmount: safeNum(payment?.PaymentAmount),
        paymentCurrency: safeStr(payment?.PaymentCurrency) ?? safeStr(payment?.SellingCurrency),
        paymentConfirmedAmount: safeNum(payment?.PaymentConfirmedAmount),
        ccCardNumber: safeStr(payment?.CC_CardNumber),
        ccCardHolder: safeStr(payment?.CC_CardHolder),
        ccBankName: safeStr(payment?.CC_BankName),
        ccInstallmentCount: safeNum(payment?.CC_InstallmentCount),
        finalizedDate: safeStr(payment?.CurrentHandling_FinalizedDate),
        passengerName: passenger
            ? `${safeStr(passenger.FirstName) ?? ''} ${safeStr(passenger.LastName) ?? ''}`.trim()
            : undefined,
    };
}


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/finalizeshopping.service.ts"
/*!***************************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/finalizeshopping.service.ts ***!
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
var BiletbankFinalizeShoppingService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankFinalizeShoppingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const biletbank_config_1 = __webpack_require__(/*! ../../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const soap_transport_1 = __webpack_require__(/*! ../../common/soap.transport */ "./src/modules/biletbank/common/soap.transport.ts");
const finalizeshopping_mapper_1 = __webpack_require__(/*! ./finalizeshopping.mapper */ "./src/modules/biletbank/air/makepayment/finalizeshopping.mapper.ts");
function escapeXml(val) {
    return String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
let BiletbankFinalizeShoppingService = BiletbankFinalizeShoppingService_1 = class BiletbankFinalizeShoppingService {
    cfg;
    logger = new common_1.Logger(BiletbankFinalizeShoppingService_1.name);
    constructor(cfg) {
        this.cfg = cfg;
    }
    async finalizeShopping(dto) {
        const startTime = Date.now();
        const correlationId = (0, crypto_1.randomUUID)();
        const c = this.cfg.config;
        if (!dto.sessionId || !dto.sessionToken) {
            throw new common_1.BadRequestException('Session bilgileri eksik.');
        }
        if (!dto.shoppingFileId?.trim()) {
            throw new common_1.BadRequestException('ShoppingFileId gereklidir.');
        }
        if (!dto.billingName?.trim()) {
            throw new common_1.BadRequestException('Fatura adı gereklidir.');
        }
        this.logger.log('FinalizeShopping started', {
            correlationId,
            shoppingFileId: dto.shoppingFileId,
        });
        const xml = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:tem="http://tempuri.org/"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping"
  xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Shopping">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:FinalizeShopping>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev1:Form>
               <trev1:BillingInfo>
                  <trev2:Address_City>${escapeXml(dto.addressCity || 'ISTANBUL')}</trev2:Address_City>
                  <trev2:Address_Detail>${escapeXml(dto.addressDetail || '-')}</trev2:Address_Detail>
                  <trev2:Address_District>${escapeXml(dto.addressDistrict || '-')}</trev2:Address_District>
                  <trev2:Address_ZipCode>${escapeXml(dto.addressZipCode || '00000')}</trev2:Address_ZipCode>
                  <trev2:BillingName>${escapeXml(dto.billingName)}</trev2:BillingName>
                  <trev2:CountryCode>${escapeXml(dto.countryCode || 'TR')}</trev2:CountryCode>
                  <trev2:IfCompany>${dto.ifCompany ?? 0}</trev2:IfCompany>
                  <trev2:TaxNo>${escapeXml(dto.taxNo || '0000000000')}</trev2:TaxNo>
                  <trev2:TaxOffice>${escapeXml(dto.taxOffice || 'TEST')}</trev2:TaxOffice>
               </trev1:BillingInfo>
               <trev1:ShoppingFileId>${escapeXml(dto.shoppingFileId)}</trev1:ShoppingFileId>
            </trev1:Form>
         </tem:request>
      </tem:FinalizeShopping>
   </soapenv:Body>
</soapenv:Envelope>`;
        try {
            const { rawXml } = await (0, soap_transport_1.soapPost)({
                url: c.apiUrl,
                clientKey: c.clientKey,
                soapAction: 'http://tempuri.org/I_Shopping/FinalizeShopping',
                xml,
                timeoutMs: 30000,
            });
            const elapsedTime = Date.now() - startTime;
            const mapped = (0, finalizeshopping_mapper_1.mapFinalizeShoppingXmlToResponse)(rawXml);
            if (mapped.hasError) {
                const errorMessage = mapped.errorMessage || 'Rezervasyon tamamlanamadı.';
                const lowerMsg = errorMessage.toLowerCase();
                if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
                    this.logger.warn('FinalizeShopping failed: Session invalid', { correlationId, errorMessage });
                    throw new common_1.UnauthorizedException('Oturum süresi dolmuş.');
                }
                this.logger.error('FinalizeShopping failed', { correlationId, errorMessage, elapsedTime });
                throw new common_1.BadRequestException({
                    message: errorMessage,
                    correlationId,
                    elapsedTime,
                    soapRequestXml: xml,
                    soapResponseXml: rawXml,
                });
            }
            this.logger.log('FinalizeShopping success', {
                correlationId,
                bookingCode: mapped.bookingCode,
                ifFinalized: mapped.ifFinalized,
                elapsedTime,
            });
            return {
                success: true,
                message: 'Rezervasyon tamamlandı',
                correlationId,
                bookingCode: mapped.bookingCode,
                status: mapped.status,
                ifFinalized: mapped.ifFinalized,
                totalFare: mapped.totalFare,
                currency: mapped.currency,
                shoppingFileId: mapped.shoppingFileId,
                payment: {
                    amount: mapped.paymentAmount,
                    confirmedAmount: mapped.paymentConfirmedAmount,
                    currency: mapped.paymentCurrency,
                    cardNumber: mapped.ccCardNumber,
                    cardHolder: mapped.ccCardHolder,
                    bankName: mapped.ccBankName,
                    installmentCount: mapped.ccInstallmentCount,
                    finalizedDate: mapped.finalizedDate,
                },
                passengerName: mapped.passengerName,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            const elapsedTime = Date.now() - startTime;
            this.logger.error('FinalizeShopping error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
                elapsedTime,
            });
            throw new common_1.InternalServerErrorException({
                message: 'Rezervasyon tamamlanırken hata oluştu.',
                correlationId,
                elapsedTime,
                soapRequestXml: xml,
            });
        }
    }
};
exports.BiletbankFinalizeShoppingService = BiletbankFinalizeShoppingService;
exports.BiletbankFinalizeShoppingService = BiletbankFinalizeShoppingService = BiletbankFinalizeShoppingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _a : Object])
], BiletbankFinalizeShoppingService);


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/init3dpayment.controller.ts"
/*!***************************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/init3dpayment.controller.ts ***!
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankInit3DPaymentController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const init3dpayment_request_dto_1 = __webpack_require__(/*! ../../dto/init3dpayment-request.dto */ "./src/modules/biletbank/dto/init3dpayment-request.dto.ts");
const init3dpayment_service_1 = __webpack_require__(/*! ./init3dpayment.service */ "./src/modules/biletbank/air/makepayment/init3dpayment.service.ts");
let BiletbankInit3DPaymentController = class BiletbankInit3DPaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async init3DPayment(body) {
        return await this.service.init3DPayment(body);
    }
};
exports.BiletbankInit3DPaymentController = BiletbankInit3DPaymentController;
__decorate([
    (0, common_1.Post)('init-3d-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof init3dpayment_request_dto_1.Init3DPaymentRequestDto !== "undefined" && init3dpayment_request_dto_1.Init3DPaymentRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BiletbankInit3DPaymentController.prototype, "init3DPayment", null);
exports.BiletbankInit3DPaymentController = BiletbankInit3DPaymentController = __decorate([
    (0, common_1.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof init3dpayment_service_1.BiletbankInit3DPaymentService !== "undefined" && init3dpayment_service_1.BiletbankInit3DPaymentService) === "function" ? _a : Object])
], BiletbankInit3DPaymentController);


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/init3dpayment.mapper.ts"
/*!***********************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/init3dpayment.mapper.ts ***!
  \***********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapInit3DPaymentXmlToResponse = mapInit3DPaymentXmlToResponse;
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
function isXmlNil(val) {
    if (typeof val !== 'object' || val === null)
        return false;
    const o = val;
    return (o['nil'] === true ||
        o['nil'] === 'true' ||
        o['i:nil'] === 'true' ||
        o['xsi:nil'] === 'true');
}
function safeStr(val) {
    if (val === undefined || val === null || isXmlNil(val))
        return undefined;
    const s = String(val).trim();
    return s.length > 0 && s !== 'null' ? s : undefined;
}
function mapInit3DPaymentXmlToResponse(rawXml) {
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: true,
        parseTagValue: true,
        parseAttributeValue: true,
        trimValues: true,
    });
    const doc = parser.parse(rawXml);
    const result = doc?.Envelope?.Body?.MakePayment_Init3DPaymentResponse?.MakePayment_Init3DPaymentResult ??
        doc?.Body?.MakePayment_Init3DPaymentResponse?.MakePayment_Init3DPaymentResult ??
        doc?.MakePayment_Init3DPaymentResponse?.MakePayment_Init3DPaymentResult;
    const hasError = (() => {
        const v = result?.HasError;
        if (typeof v === 'boolean')
            return v;
        if (typeof v === 'string')
            return v.toLowerCase() === 'true';
        return false;
    })();
    const errorMessage = safeStr(result?.ServiceError?.ErrorMessage) ??
        safeStr(result?.ServiceError?.DebugMessage);
    const continueUrl = safeStr(result?.ContinueUrl);
    const paymentId = safeStr(result?.PaymentId);
    const status = safeStr(result?.ShoppingFile?.Status) ?? safeStr(result?.Status);
    return {
        hasError,
        errorMessage,
        continueUrl,
        paymentId,
        status,
        details: result,
    };
}


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/init3dpayment.service.ts"
/*!************************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/init3dpayment.service.ts ***!
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
var BiletbankInit3DPaymentService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankInit3DPaymentService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const biletbank_config_1 = __webpack_require__(/*! ../../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const soap_transport_1 = __webpack_require__(/*! ../../common/soap.transport */ "./src/modules/biletbank/common/soap.transport.ts");
const init3dpayment_mapper_1 = __webpack_require__(/*! ./init3dpayment.mapper */ "./src/modules/biletbank/air/makepayment/init3dpayment.mapper.ts");
function maskSessionId(s) {
    if (!s || s.length < 4)
        return 'SESS-***';
    return `SESS-${s.substring(0, 2)}***${s.substring(s.length - 2)}`;
}
function maskCardNumber(num) {
    if (!num || num.length < 4)
        return '****';
    const digits = num.replace(/\D/g, '');
    return `${digits.slice(0, 4)} **** **** ${digits.slice(-4)}`;
}
function escapeXml(val) {
    return String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
let BiletbankInit3DPaymentService = BiletbankInit3DPaymentService_1 = class BiletbankInit3DPaymentService {
    cfg;
    logger = new common_1.Logger(BiletbankInit3DPaymentService_1.name);
    constructor(cfg) {
        this.cfg = cfg;
    }
    async init3DPayment(dto) {
        const startTime = Date.now();
        const correlationId = (0, crypto_1.randomUUID)();
        const c = this.cfg.config;
        if (!dto.sessionId || !dto.sessionToken) {
            throw new common_1.BadRequestException('Session bilgileri eksik.');
        }
        if (!dto.shoppingFileId?.trim()) {
            throw new common_1.BadRequestException('ShoppingFileId gereklidir.');
        }
        if (!dto.cardNumber?.trim() || !dto.cardHolderName?.trim()) {
            throw new common_1.BadRequestException('Kart bilgileri eksik.');
        }
        if (!dto.expireMonth?.trim() || !dto.expireYear?.trim() || !dto.cvv?.trim()) {
            throw new common_1.BadRequestException('Kart son kullanma tarihi ve CVV gereklidir.');
        }
        if (!dto.callbackUrl?.trim()) {
            throw new common_1.BadRequestException('CallbackUrl gereklidir.');
        }
        const digits = dto.cardNumber.replace(/\D/g, '');
        const formattedCardNumber = digits.replace(/(\d{4})(?=\d)/g, '$1-');
        const expirationMonth = parseInt(dto.expireMonth.trim(), 10);
        const rawYear = parseInt(dto.expireYear.trim(), 10);
        const expirationYear = rawYear >= 100 ? rawYear % 100 : rawYear;
        const amount = Number(dto.amount);
        this.logger.log('Init3DPayment started', {
            correlationId,
            sessionId: maskSessionId(dto.sessionId),
            shoppingFileId: dto.shoppingFileId,
            amount,
            currency: dto.currency,
            card: maskCardNumber(digits),
        });
        const xml = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:tem="http://tempuri.org/"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:MakePayment_Init3DPayment>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList/>
            <trev1:DeductLastSellerCommission>false</trev1:DeductLastSellerCommission>
            <trev1:Form>
               <trev1:Amount>${amount}</trev1:Amount>
               <trev1:BillingName>${escapeXml(dto.cardHolderName.trim().toUpperCase())}</trev1:BillingName>
               <trev1:CV2>${escapeXml(dto.cvv.trim())}</trev1:CV2>
               <trev1:CardHolder>${escapeXml(dto.cardHolderName.trim().toUpperCase())}</trev1:CardHolder>
               <trev1:CardNumber>${escapeXml(formattedCardNumber)}</trev1:CardNumber>
               <trev1:CardType/>
               <trev1:Currency>${escapeXml(dto.currency.trim())}</trev1:Currency>
               <trev1:ExpirationMonth>${expirationMonth}</trev1:ExpirationMonth>
               <trev1:ExpirationYear>${expirationYear}</trev1:ExpirationYear>
               <trev1:OriginalAmount>${amount}</trev1:OriginalAmount>
               <trev1:ReturnUrl>${escapeXml(dto.callbackUrl.trim())}</trev1:ReturnUrl>
               <trev1:ShoppingFileId>${escapeXml(dto.shoppingFileId.trim())}</trev1:ShoppingFileId>
            </trev1:Form>
         </tem:request>
      </tem:MakePayment_Init3DPayment>
   </soapenv:Body>
</soapenv:Envelope>`;
        const debugRequestXml = xml;
        try {
            const { rawXml } = await (0, soap_transport_1.soapPost)({
                url: c.apiUrl,
                clientKey: c.clientKey,
                soapAction: 'http://tempuri.org/I_Shopping/MakePayment_Init3DPayment',
                xml,
                timeoutMs: 30000,
            });
            const elapsedTime = Date.now() - startTime;
            const mapped = (0, init3dpayment_mapper_1.mapInit3DPaymentXmlToResponse)(rawXml);
            if (mapped.hasError) {
                const errorMessage = mapped.errorMessage || '3D ödeme başlatılamadı.';
                const lowerMsg = errorMessage.toLowerCase();
                if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
                    this.logger.warn('Init3DPayment failed: Session invalid', { correlationId, errorMessage });
                    throw new common_1.UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
                }
                this.logger.error('Init3DPayment failed', { correlationId, errorMessage, elapsedTime });
                throw new common_1.BadRequestException({
                    message: errorMessage,
                    correlationId,
                    elapsedTime,
                    soapRequestXml: debugRequestXml,
                    soapResponseXml: rawXml,
                });
            }
            if (!mapped.continueUrl) {
                this.logger.warn('Init3DPayment: ContinueUrl yok — test ortamı yanıtı olabilir', {
                    correlationId, elapsedTime, paymentId: mapped.paymentId,
                });
            }
            this.logger.log('Init3DPayment success', {
                correlationId,
                paymentId: mapped.paymentId,
                hasContinueUrl: !!mapped.continueUrl,
                elapsedTime,
            });
            return {
                success: true,
                message: '3D ödeme başlatıldı',
                correlationId,
                paymentId: mapped.paymentId,
                threeDSUrl: mapped.continueUrl,
                continueUrl: mapped.continueUrl,
                status: mapped.status,
                rawDetails: mapped.details,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            const elapsedTime = Date.now() - startTime;
            this.logger.error('Init3DPayment error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
                elapsedTime,
            });
            throw new common_1.InternalServerErrorException({
                message: '3D ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.',
                correlationId,
                elapsedTime,
                soapRequestXml: debugRequestXml,
            });
        }
    }
};
exports.BiletbankInit3DPaymentService = BiletbankInit3DPaymentService;
exports.BiletbankInit3DPaymentService = BiletbankInit3DPaymentService = BiletbankInit3DPaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _a : Object])
], BiletbankInit3DPaymentService);


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/makepayment.controller.ts"
/*!*************************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/makepayment.controller.ts ***!
  \*************************************************************************/
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
exports.BiletbankMakePaymentController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const makepayment_request_dto_1 = __webpack_require__(/*! ../../dto/makepayment-request.dto */ "./src/modules/biletbank/dto/makepayment-request.dto.ts");
const makepayment_service_1 = __webpack_require__(/*! ./makepayment.service */ "./src/modules/biletbank/air/makepayment/makepayment.service.ts");
let BiletbankMakePaymentController = class BiletbankMakePaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    async makePayment(body) {
        return await this.service.makePayment(body);
    }
};
exports.BiletbankMakePaymentController = BiletbankMakePaymentController;
__decorate([
    (0, common_1.Post)('make-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof makepayment_request_dto_1.MakePaymentRequestDto !== "undefined" && makepayment_request_dto_1.MakePaymentRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BiletbankMakePaymentController.prototype, "makePayment", null);
exports.BiletbankMakePaymentController = BiletbankMakePaymentController = __decorate([
    (0, common_1.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof makepayment_service_1.BiletbankMakePaymentService !== "undefined" && makepayment_service_1.BiletbankMakePaymentService) === "function" ? _a : Object])
], BiletbankMakePaymentController);


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/makepayment.mapper.ts"
/*!*********************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/makepayment.mapper.ts ***!
  \*********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapMakePaymentXmlToResponse = mapMakePaymentXmlToResponse;
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
function parseBool(val) {
    if (val === undefined || val === null)
        return undefined;
    if (typeof val === 'boolean')
        return val;
    const s = String(val).toLowerCase().trim();
    if (s === 'true')
        return true;
    if (s === 'false')
        return false;
    return undefined;
}
function parseNum(val) {
    if (val === undefined || val === null)
        return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
}
function parseStr(val) {
    if (val === undefined || val === null)
        return undefined;
    const s = String(val).trim();
    return s.length > 0 && s !== 'null' ? s : undefined;
}
function mapMakePaymentXmlToResponse(rawXml) {
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: true,
        parseTagValue: true,
        parseAttributeValue: true,
        trimValues: true,
    });
    const doc = parser.parse(rawXml);
    const result = doc?.Envelope?.Body?.MakePayment_FromRunningAccountResponse?.MakePayment_FromRunningAccountResult ??
        doc?.Body?.MakePayment_FromRunningAccountResponse?.MakePayment_FromRunningAccountResult ??
        doc?.MakePayment_FromRunningAccountResponse?.MakePayment_FromRunningAccountResult;
    const hasError = parseBool(result?.HasError) ?? false;
    const errorMessage = parseStr(result?.ServiceError?.ErrorMessage) ??
        parseStr(result?.ServiceError?.DebugMessage);
    const paymentId = parseStr(result?.PaymentId);
    const sf = result?.ShoppingFile;
    const shoppingFileId = parseStr(sf?.Id);
    const ifFinalized = parseBool(sf?.IfFinalized);
    const isPriceChanged = parseBool(sf?.IsPriceChanged);
    const isFlightInfoChanged = parseBool(sf?.IsFlightInfoChanged);
    const isReservationCancelled = parseBool(sf?.IsReservationCancelled);
    const isCcPaymentEnabled = parseBool(sf?.Is_CC_Payment_Enabled);
    const isRaPaymentEnabled = parseBool(sf?.Is_RA_Payment_Enabled);
    const remainingSum = parseNum(sf?.RemainingSum);
    const maxSc = parseNum(sf?.MaxSc);
    const minSc = parseNum(sf?.MinSc);
    const grandTotal = parseNum(sf?.PriceSummary?.GrandTotal);
    const airBookings = [];
    const bookingNode = sf?.AirBookings?.T_AirBooking;
    const bookingList = Array.isArray(bookingNode) ? bookingNode : bookingNode ? [bookingNode] : [];
    for (const b of bookingList) {
        const timetable = b?.TimeTable;
        airBookings.push({
            productId: parseStr(b?.ProductId),
            bookingCode: parseStr(b?.BookingCode),
            status: parseStr(b?.Status),
            totalFare: parseNum(b?.TotalFare),
            baseFare: parseNum(b?.BaseFare),
            taxes: parseNum(b?.Taxes),
            serviceFee: parseNum(b?.ServiceFee),
            netFare: parseNum(b?.NetFare),
            currency: parseStr(b?.Currency),
            isRefundable: parseBool(b?.IsRefundable),
            canBeReserved: parseBool(b?.CanBeReserved),
            type: parseStr(b?.Type),
            prebookingExpiresAt: parseStr(timetable?.Prebooking_ExpiresAt),
            reservationExpiresAt: parseStr(timetable?.Reservation_ExpiresAt),
            reservationDate: parseStr(timetable?.ReservationDate),
            creationDate: parseStr(timetable?.CreationDate),
        });
    }
    return {
        hasError,
        errorMessage,
        paymentId,
        shoppingFileId,
        ifFinalized,
        isPriceChanged,
        isFlightInfoChanged,
        isReservationCancelled,
        isCcPaymentEnabled,
        isRaPaymentEnabled,
        remainingSum,
        maxSc,
        minSc,
        grandTotal,
        airBookings: airBookings.length > 0 ? airBookings : undefined,
        details: result,
    };
}


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/makepayment.module.ts"
/*!*********************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/makepayment.module.ts ***!
  \*********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankMakePaymentModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ../../auth/auth.module */ "./src/modules/biletbank/auth/auth.module.ts");
const makepayment_controller_1 = __webpack_require__(/*! ./makepayment.controller */ "./src/modules/biletbank/air/makepayment/makepayment.controller.ts");
const makepayment_service_1 = __webpack_require__(/*! ./makepayment.service */ "./src/modules/biletbank/air/makepayment/makepayment.service.ts");
const init3dpayment_controller_1 = __webpack_require__(/*! ./init3dpayment.controller */ "./src/modules/biletbank/air/makepayment/init3dpayment.controller.ts");
const init3dpayment_service_1 = __webpack_require__(/*! ./init3dpayment.service */ "./src/modules/biletbank/air/makepayment/init3dpayment.service.ts");
const finalizeshopping_controller_1 = __webpack_require__(/*! ./finalizeshopping.controller */ "./src/modules/biletbank/air/makepayment/finalizeshopping.controller.ts");
const finalizeshopping_service_1 = __webpack_require__(/*! ./finalizeshopping.service */ "./src/modules/biletbank/air/makepayment/finalizeshopping.service.ts");
let BiletbankMakePaymentModule = class BiletbankMakePaymentModule {
};
exports.BiletbankMakePaymentModule = BiletbankMakePaymentModule;
exports.BiletbankMakePaymentModule = BiletbankMakePaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.BiletbankAuthModule],
        controllers: [
            makepayment_controller_1.BiletbankMakePaymentController,
            init3dpayment_controller_1.BiletbankInit3DPaymentController,
            finalizeshopping_controller_1.BiletbankFinalizeShoppingController,
        ],
        providers: [
            makepayment_service_1.BiletbankMakePaymentService,
            init3dpayment_service_1.BiletbankInit3DPaymentService,
            finalizeshopping_service_1.BiletbankFinalizeShoppingService,
        ],
        exports: [
            makepayment_service_1.BiletbankMakePaymentService,
            init3dpayment_service_1.BiletbankInit3DPaymentService,
            finalizeshopping_service_1.BiletbankFinalizeShoppingService,
        ],
    })
], BiletbankMakePaymentModule);


/***/ },

/***/ "./src/modules/biletbank/air/makepayment/makepayment.service.ts"
/*!**********************************************************************!*\
  !*** ./src/modules/biletbank/air/makepayment/makepayment.service.ts ***!
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
var BiletbankMakePaymentService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankMakePaymentService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const biletbank_config_1 = __webpack_require__(/*! ../../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const soap_transport_1 = __webpack_require__(/*! ../../common/soap.transport */ "./src/modules/biletbank/common/soap.transport.ts");
const makepayment_mapper_1 = __webpack_require__(/*! ./makepayment.mapper */ "./src/modules/biletbank/air/makepayment/makepayment.mapper.ts");
function maskSessionId(s) {
    if (!s || s.length < 4)
        return 'SESS-***';
    return `SESS-${s.substring(0, 2)}***${s.substring(s.length - 2)}`;
}
function escapeXml(val) {
    return String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
let BiletbankMakePaymentService = BiletbankMakePaymentService_1 = class BiletbankMakePaymentService {
    cfg;
    logger = new common_1.Logger(BiletbankMakePaymentService_1.name);
    constructor(cfg) {
        this.cfg = cfg;
    }
    async makePayment(dto) {
        const startTime = Date.now();
        const correlationId = (0, crypto_1.randomUUID)();
        const c = this.cfg.config;
        if (!dto.sessionId || !dto.sessionToken) {
            throw new common_1.BadRequestException('Session bilgileri eksik.');
        }
        if (!dto.shoppingFileId?.trim()) {
            throw new common_1.BadRequestException('ShoppingFileId gereklidir.');
        }
        if (dto.amount == null || dto.amount < 0) {
            throw new common_1.BadRequestException('Geçerli bir ödeme tutarı gereklidir.');
        }
        if (!dto.currency?.trim()) {
            throw new common_1.BadRequestException('Para birimi gereklidir.');
        }
        if (!dto.paymentType?.trim()) {
            throw new common_1.BadRequestException('Ödeme tipi gereklidir.');
        }
        const deductCommission = dto.deductLastSellerCommission === true ? 'true' : 'false';
        const isPartial = dto.isPartialPayment === true ? 'true' : 'false';
        this.logger.log('MakePayment started', {
            correlationId,
            sessionId: maskSessionId(dto.sessionId),
            shoppingFileId: dto.shoppingFileId,
            amount: dto.amount,
            currency: dto.currency,
            paymentType: dto.paymentType,
            isPartialPayment: dto.isPartialPayment,
        });
        const xml = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:MakePayment_FromRunningAccount>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList>
               <trev:ExtendedData/>
            </trev:ExtraParamList>
            <trev1:DeductLastSellerCommission>${deductCommission}</trev1:DeductLastSellerCommission>
            <trev1:PaymentForm>
               <trev1:Amount>${dto.amount}</trev1:Amount>
               <trev1:Currency>${escapeXml(dto.currency.trim())}</trev1:Currency>
               <trev1:IsPartialPayment>${isPartial}</trev1:IsPartialPayment>
               <trev1:PaymentType>${escapeXml(dto.paymentType.trim())}</trev1:PaymentType>
               <trev1:ShoppingFileId>${escapeXml(dto.shoppingFileId.trim())}</trev1:ShoppingFileId>
            </trev1:PaymentForm>
         </tem:request>
      </tem:MakePayment_FromRunningAccount>
   </soapenv:Body>
</soapenv:Envelope>`;
        try {
            const { rawXml } = await (0, soap_transport_1.soapPost)({
                url: c.apiUrl,
                clientKey: c.clientKey,
                soapAction: 'http://tempuri.org/I_Shopping/MakePayment_FromRunningAccount',
                xml,
                timeoutMs: 30000,
            });
            const elapsedTime = Date.now() - startTime;
            const mapped = (0, makepayment_mapper_1.mapMakePaymentXmlToResponse)(rawXml);
            if (mapped.hasError) {
                const errorMessage = mapped.errorMessage || 'Ödeme işlemi tamamlanamadı.';
                const lowerMsg = errorMessage.toLowerCase();
                if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
                    this.logger.warn('MakePayment failed: Session invalid', {
                        correlationId, errorMessage, elapsedTime,
                    });
                    throw new common_1.UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
                }
                if (lowerMsg.includes('balance') || lowerMsg.includes('insufficient') || lowerMsg.includes('yetersiz')) {
                    this.logger.warn('MakePayment failed: Insufficient balance', {
                        correlationId, errorMessage, elapsedTime,
                    });
                    throw new common_1.BadRequestException('Cari hesap bakiyeniz yetersiz. Lütfen bakiye yükleyin veya farklı bir ödeme yöntemi deneyin.');
                }
                this.logger.error('MakePayment failed', {
                    correlationId, errorMessage, elapsedTime,
                    sessionId: maskSessionId(dto.sessionId),
                });
                throw new common_1.BadRequestException(errorMessage);
            }
            const booking = mapped.airBookings?.[0];
            this.logger.log('MakePayment success', {
                correlationId,
                paymentId: mapped.paymentId,
                shoppingFileId: mapped.shoppingFileId,
                ifFinalized: mapped.ifFinalized,
                bookingCode: booking?.bookingCode,
                status: booking?.status,
                totalFare: booking?.totalFare,
                remainingSum: mapped.remainingSum,
                elapsedTime,
            });
            return {
                success: true,
                message: 'Ödeme başarıyla tamamlandı',
                correlationId,
                paymentId: mapped.paymentId,
                shoppingFileId: mapped.shoppingFileId,
                ifFinalized: mapped.ifFinalized,
                isPriceChanged: mapped.isPriceChanged,
                isFlightInfoChanged: mapped.isFlightInfoChanged,
                isReservationCancelled: mapped.isReservationCancelled,
                isCcPaymentEnabled: mapped.isCcPaymentEnabled,
                isRaPaymentEnabled: mapped.isRaPaymentEnabled,
                remainingSum: mapped.remainingSum,
                grandTotal: mapped.grandTotal,
                bookingCode: booking?.bookingCode,
                status: booking?.status,
                totalFare: booking?.totalFare,
                baseFare: booking?.baseFare,
                taxes: booking?.taxes,
                serviceFee: booking?.serviceFee,
                currency: booking?.currency,
                isRefundable: booking?.isRefundable,
                type: booking?.type,
                reservationDate: booking?.reservationDate,
                prebookingExpiresAt: booking?.prebookingExpiresAt,
                reservationExpiresAt: booking?.reservationExpiresAt,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            const elapsedTime = Date.now() - startTime;
            this.logger.error('MakePayment error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
                elapsedTime,
                sessionId: maskSessionId(dto.sessionId),
            });
            throw new common_1.InternalServerErrorException('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
};
exports.BiletbankMakePaymentService = BiletbankMakePaymentService;
exports.BiletbankMakePaymentService = BiletbankMakePaymentService = BiletbankMakePaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _a : Object])
], BiletbankMakePaymentService);


/***/ },

/***/ "./src/modules/biletbank/air/makeprebooking/makeprebooking.controller.ts"
/*!*******************************************************************************!*\
  !*** ./src/modules/biletbank/air/makeprebooking/makeprebooking.controller.ts ***!
  \*******************************************************************************/
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
exports.BiletbankMakePrebookingController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const makeprebooking_request_dto_1 = __webpack_require__(/*! ../../dto/makeprebooking-request.dto */ "./src/modules/biletbank/dto/makeprebooking-request.dto.ts");
const makeprebooking_service_1 = __webpack_require__(/*! ./makeprebooking.service */ "./src/modules/biletbank/air/makeprebooking/makeprebooking.service.ts");
let BiletbankMakePrebookingController = class BiletbankMakePrebookingController {
    service;
    constructor(service) {
        this.service = service;
    }
    async makePrebooking(body) {
        return await this.service.makePrebooking(body);
    }
};
exports.BiletbankMakePrebookingController = BiletbankMakePrebookingController;
__decorate([
    (0, common_1.Post)('make-prebooking'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof makeprebooking_request_dto_1.MakePrebookingRequestDto !== "undefined" && makeprebooking_request_dto_1.MakePrebookingRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BiletbankMakePrebookingController.prototype, "makePrebooking", null);
exports.BiletbankMakePrebookingController = BiletbankMakePrebookingController = __decorate([
    (0, common_1.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof makeprebooking_service_1.BiletbankMakePrebookingService !== "undefined" && makeprebooking_service_1.BiletbankMakePrebookingService) === "function" ? _a : Object])
], BiletbankMakePrebookingController);


/***/ },

/***/ "./src/modules/biletbank/air/makeprebooking/makeprebooking.mapper.ts"
/*!***************************************************************************!*\
  !*** ./src/modules/biletbank/air/makeprebooking/makeprebooking.mapper.ts ***!
  \***************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapMakePrebookingXmlToResponse = mapMakePrebookingXmlToResponse;
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
function isXmlNil(val) {
    if (typeof val !== 'object' || val === null)
        return false;
    const o = val;
    return (o['nil'] === true ||
        o['nil'] === 'true' ||
        o['i:nil'] === 'true' ||
        o['xsi:nil'] === 'true');
}
function parseBool(val) {
    if (val === undefined || val === null)
        return undefined;
    if (isXmlNil(val))
        return undefined;
    if (typeof val === 'boolean')
        return val;
    const s = String(val).toLowerCase().trim();
    if (s === 'true')
        return true;
    if (s === 'false')
        return false;
    return undefined;
}
function parseNum(val) {
    if (val === undefined || val === null)
        return undefined;
    if (isXmlNil(val))
        return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
}
function parseStr(val) {
    if (val === undefined || val === null)
        return undefined;
    if (isXmlNil(val))
        return undefined;
    const s = String(val).trim();
    return s.length > 0 && s !== 'null' ? s : undefined;
}
function mapMakePrebookingXmlToResponse(rawXml) {
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: true,
        parseTagValue: true,
        parseAttributeValue: true,
        trimValues: true,
    });
    const doc = parser.parse(rawXml);
    const result = doc?.Envelope?.Body?.MakePrebookingResponse?.MakePrebookingResult ??
        doc?.Body?.MakePrebookingResponse?.MakePrebookingResult ??
        doc?.MakePrebookingResponse?.MakePrebookingResult;
    const hasError = parseBool(result?.HasError) ?? false;
    const errorMessage = parseStr(result?.ServiceError?.ErrorMessage) ??
        parseStr(result?.ServiceError?.DebugMessage);
    const isUnknownSystemError = parseBool(result?.ServiceError?.TypeFlags?.IsUnknownError) ?? false;
    const sf = result?.ShoppingFile;
    const shoppingFileId = parseStr(sf?.Id);
    const ifFinalized = parseBool(sf?.IfFinalized);
    const isPriceChanged = parseBool(sf?.IsPriceChanged);
    const isFlightInfoChanged = parseBool(sf?.IsFlightInfoChanged);
    const isReservationCancelled = parseBool(sf?.IsReservationCancelled);
    const isCcPaymentEnabled = parseBool(sf?.Is_CC_Payment_Enabled);
    const isRaPaymentEnabled = parseBool(sf?.Is_RA_Payment_Enabled);
    const remainingSum = parseNum(sf?.RemainingSum);
    const maxSc = parseNum(sf?.MaxSc);
    const minSc = parseNum(sf?.MinSc);
    const airBookings = [];
    const bookingNode = sf?.AirBookings?.T_AirBooking;
    const bookingList = Array.isArray(bookingNode) ? bookingNode : bookingNode ? [bookingNode] : [];
    for (const b of bookingList) {
        const timetable = b?.TimeTable;
        const itemsNode = b?.BookingItems?.T_AirBookingItem;
        const items = Array.isArray(itemsNode) ? itemsNode : itemsNode ? [itemsNode] : [];
        const paxReferences = [];
        for (const item of items) {
            const refNode = item?.PaxReference;
            const refList = Array.isArray(refNode) ? refNode : refNode ? [refNode] : [];
            for (const r of refList) {
                paxReferences.push({
                    localSequenceNo: parseNum(r?.LocalSequenceNo),
                    passengerId: parseStr(r?.PassengerId),
                    paxReferenceId: parseStr(r?.PaxReferenceId),
                    localPaxType: parseStr(r?.LocalPaxType),
                    age: parseNum(r?.Age),
                });
            }
        }
        airBookings.push({
            productId: parseStr(b?.ProductId),
            bookingCode: parseStr(b?.BookingCode),
            status: parseStr(b?.Status),
            totalFare: parseNum(b?.TotalFare),
            baseFare: parseNum(b?.BaseFare),
            taxes: parseNum(b?.Taxes),
            serviceFee: parseNum(b?.ServiceFee),
            currency: parseStr(b?.Currency),
            isRefundable: parseBool(b?.IsRefundable),
            canBeReserved: parseBool(b?.CanBeReserved),
            prebookingExpiresAt: parseStr(timetable?.Prebooking_ExpiresAt),
            reservationExpiresAt: parseStr(timetable?.Reservation_ExpiresAt),
            reservationDate: parseStr(timetable?.ReservationDate),
            paxReferences,
        });
    }
    return {
        hasError,
        errorMessage,
        isUnknownSystemError,
        shoppingFileId,
        ifFinalized,
        isPriceChanged,
        isFlightInfoChanged,
        isReservationCancelled,
        isCcPaymentEnabled,
        isRaPaymentEnabled,
        remainingSum,
        maxSc,
        minSc,
        airBookings: airBookings.length > 0 ? airBookings : undefined,
        details: result,
    };
}


/***/ },

/***/ "./src/modules/biletbank/air/makeprebooking/makeprebooking.module.ts"
/*!***************************************************************************!*\
  !*** ./src/modules/biletbank/air/makeprebooking/makeprebooking.module.ts ***!
  \***************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankMakePrebookingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ../../auth/auth.module */ "./src/modules/biletbank/auth/auth.module.ts");
const makeprebooking_controller_1 = __webpack_require__(/*! ./makeprebooking.controller */ "./src/modules/biletbank/air/makeprebooking/makeprebooking.controller.ts");
const makeprebooking_service_1 = __webpack_require__(/*! ./makeprebooking.service */ "./src/modules/biletbank/air/makeprebooking/makeprebooking.service.ts");
let BiletbankMakePrebookingModule = class BiletbankMakePrebookingModule {
};
exports.BiletbankMakePrebookingModule = BiletbankMakePrebookingModule;
exports.BiletbankMakePrebookingModule = BiletbankMakePrebookingModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.BiletbankAuthModule],
        controllers: [makeprebooking_controller_1.BiletbankMakePrebookingController],
        providers: [makeprebooking_service_1.BiletbankMakePrebookingService],
        exports: [makeprebooking_service_1.BiletbankMakePrebookingService],
    })
], BiletbankMakePrebookingModule);


/***/ },

/***/ "./src/modules/biletbank/air/makeprebooking/makeprebooking.service.ts"
/*!****************************************************************************!*\
  !*** ./src/modules/biletbank/air/makeprebooking/makeprebooking.service.ts ***!
  \****************************************************************************/
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
var BiletbankMakePrebookingService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankMakePrebookingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const biletbank_config_1 = __webpack_require__(/*! ../../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const soap_transport_1 = __webpack_require__(/*! ../../common/soap.transport */ "./src/modules/biletbank/common/soap.transport.ts");
const makeprebooking_mapper_1 = __webpack_require__(/*! ./makeprebooking.mapper */ "./src/modules/biletbank/air/makeprebooking/makeprebooking.mapper.ts");
function maskSessionId(s) {
    if (!s || s.length < 4)
        return 'SESS-***';
    return `SESS-${s.substring(0, 2)}***${s.substring(s.length - 2)}`;
}
function maskSessionToken(t) {
    if (!t || t.length < 4)
        return 'TOK-***';
    return `TOK-${t.substring(0, 2)}***${t.substring(t.length - 2)}`;
}
function escapeXml(val) {
    return String(val)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
let BiletbankMakePrebookingService = BiletbankMakePrebookingService_1 = class BiletbankMakePrebookingService {
    cfg;
    logger = new common_1.Logger(BiletbankMakePrebookingService_1.name);
    constructor(cfg) {
        this.cfg = cfg;
    }
    async makePrebooking(dto) {
        const startTime = Date.now();
        const correlationId = (0, crypto_1.randomUUID)();
        const c = this.cfg.config;
        if (!dto.sessionId || !dto.sessionToken) {
            throw new common_1.BadRequestException('Session bilgileri eksik.');
        }
        if (!dto.productId?.trim()) {
            throw new common_1.BadRequestException('ProductId gereklidir.');
        }
        if (!dto.shoppingFileId?.trim()) {
            throw new common_1.BadRequestException('ShoppingFileId gereklidir.');
        }
        this.logger.log('MakePreBooking started', {
            correlationId,
            sessionId: maskSessionId(dto.sessionId),
            productId: dto.productId,
            shoppingFileId: dto.shoppingFileId,
            brandedFareItemId: dto.brandedFareItemId || '(none)',
        });
        const brandedXml = dto.brandedFareItemId
            ? `
            <trev1:Branded>
               <trev1:IO_Air_Branded_Form>
                  ${dto.brandedCode ? `<trev1:BrandedCode>${escapeXml(dto.brandedCode)}</trev1:BrandedCode>` : ''}
                  <trev1:BrandedFareItemId>${escapeXml(dto.brandedFareItemId.trim())}</trev1:BrandedFareItemId>
                  <trev1:ProductId>${escapeXml(dto.productId.trim())}</trev1:ProductId>
               </trev1:IO_Air_Branded_Form>
            </trev1:Branded>`
            : '';
        const xml = `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping"
  xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:MakePrebooking>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev:ExtraParamList>
               <trev:ExtendedData>
                  <trev:Name>IntendedShoppingFileId</trev:Name>
                  <trev:Type i:nil="true"/>
                  <trev:Value>${escapeXml(dto.shoppingFileId.trim())}</trev:Value>
               </trev:ExtendedData>
            </trev:ExtraParamList>
            <trev1:Form>${brandedXml}
               <trev1:CIPRequest i:nil="true"/>
               <trev1:ProductIds>
                  <arr:guid>${escapeXml(dto.productId.trim())}</arr:guid>
               </trev1:ProductIds>
            </trev1:Form>
         </tem:request>
      </tem:MakePrebooking>
   </soapenv:Body>
</soapenv:Envelope>`;
        try {
            const { rawXml } = await (0, soap_transport_1.soapPost)({
                url: c.apiUrl,
                clientKey: c.clientKey,
                soapAction: 'http://tempuri.org/I_Shopping/MakePrebooking',
                xml,
                timeoutMs: 60000,
            });
            const elapsedTime = Date.now() - startTime;
            const mapped = (0, makeprebooking_mapper_1.mapMakePrebookingXmlToResponse)(rawXml);
            if (mapped.hasError) {
                const errorMessage = mapped.errorMessage || 'Ön rezervasyon oluşturulamadı.';
                const lowerMsg = errorMessage.toLowerCase();
                if (lowerMsg.includes('session') || lowerMsg.includes('unauthorized')) {
                    this.logger.warn('MakePreBooking failed: Session invalid', {
                        correlationId, errorMessage, elapsedTime,
                        sessionId: maskSessionId(dto.sessionId),
                    });
                    throw new common_1.UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
                }
                const hasPartialData = !!mapped.shoppingFileId;
                if (mapped.isUnknownSystemError && hasPartialData) {
                    this.logger.warn('MakePreBooking: BiletBank internal error, continuing with partial ShoppingFile data', {
                        correlationId, errorMessage, elapsedTime,
                        shoppingFileId: mapped.shoppingFileId,
                        isCcPaymentEnabled: mapped.isCcPaymentEnabled,
                        isRaPaymentEnabled: mapped.isRaPaymentEnabled,
                    });
                }
                else {
                    this.logger.error('MakePreBooking failed', {
                        correlationId, errorMessage, elapsedTime,
                        sessionId: maskSessionId(dto.sessionId),
                        sessionToken: maskSessionToken(dto.sessionToken),
                    });
                    throw new common_1.BadRequestException(errorMessage);
                }
            }
            const booking = mapped.airBookings?.[0];
            this.logger.log('MakePreBooking success', {
                correlationId,
                shoppingFileId: mapped.shoppingFileId,
                status: booking?.status,
                bookingCode: booking?.bookingCode,
                isPriceChanged: mapped.isPriceChanged,
                isFlightInfoChanged: mapped.isFlightInfoChanged,
                isCcPaymentEnabled: mapped.isCcPaymentEnabled,
                isRaPaymentEnabled: mapped.isRaPaymentEnabled,
                remainingSum: mapped.remainingSum,
                prebookingExpiresAt: booking?.prebookingExpiresAt,
                reservationExpiresAt: booking?.reservationExpiresAt,
                elapsedTime,
            });
            return {
                success: true,
                message: mapped.hasError
                    ? 'Ön rezervasyon oluşturulamadı ancak rezervasyon bilgileri alındı'
                    : 'Ön rezervasyon başarıyla oluşturuldu',
                biletbankWarning: mapped.hasError ? mapped.errorMessage : undefined,
                correlationId,
                shoppingFileId: mapped.shoppingFileId,
                ifFinalized: mapped.ifFinalized,
                isPriceChanged: mapped.isPriceChanged,
                isFlightInfoChanged: mapped.isFlightInfoChanged,
                isReservationCancelled: mapped.isReservationCancelled,
                isCcPaymentEnabled: mapped.isCcPaymentEnabled,
                isRaPaymentEnabled: mapped.isRaPaymentEnabled,
                remainingSum: mapped.remainingSum,
                maxSc: mapped.maxSc,
                minSc: mapped.minSc,
                bookingCode: booking?.bookingCode,
                status: booking?.status,
                totalFare: booking?.totalFare,
                baseFare: booking?.baseFare,
                taxes: booking?.taxes,
                serviceFee: booking?.serviceFee,
                currency: booking?.currency,
                canBeReserved: booking?.canBeReserved,
                prebookingExpiresAt: booking?.prebookingExpiresAt,
                reservationExpiresAt: booking?.reservationExpiresAt,
                reservationDate: booking?.reservationDate,
                paxReferences: booking?.paxReferences,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            const elapsedTime = Date.now() - startTime;
            this.logger.error('MakePreBooking error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
                elapsedTime,
                sessionId: maskSessionId(dto.sessionId),
            });
            throw new common_1.InternalServerErrorException('Ön rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
};
exports.BiletbankMakePrebookingService = BiletbankMakePrebookingService;
exports.BiletbankMakePrebookingService = BiletbankMakePrebookingService = BiletbankMakePrebookingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _a : Object])
], BiletbankMakePrebookingService);


/***/ },

/***/ "./src/modules/biletbank/air/update-passenger/update-passenger.controller.ts"
/*!***********************************************************************************!*\
  !*** ./src/modules/biletbank/air/update-passenger/update-passenger.controller.ts ***!
  \***********************************************************************************/
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
exports.BiletbankUpdatePassengerController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const update_passenger_request_dto_1 = __webpack_require__(/*! ../../dto/update-passenger-request.dto */ "./src/modules/biletbank/dto/update-passenger-request.dto.ts");
const update_passenger_service_1 = __webpack_require__(/*! ./update-passenger.service */ "./src/modules/biletbank/air/update-passenger/update-passenger.service.ts");
let BiletbankUpdatePassengerController = class BiletbankUpdatePassengerController {
    updatePassengerService;
    constructor(updatePassengerService) {
        this.updatePassengerService = updatePassengerService;
    }
    async updatePassengers(body) {
        return await this.updatePassengerService.updatePassengers(body);
    }
};
exports.BiletbankUpdatePassengerController = BiletbankUpdatePassengerController;
__decorate([
    (0, common_1.Post)('update-passengers'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof update_passenger_request_dto_1.UpdatePassengerRequestDto !== "undefined" && update_passenger_request_dto_1.UpdatePassengerRequestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], BiletbankUpdatePassengerController.prototype, "updatePassengers", null);
exports.BiletbankUpdatePassengerController = BiletbankUpdatePassengerController = __decorate([
    (0, common_2.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof update_passenger_service_1.BiletbankUpdatePassengerService !== "undefined" && update_passenger_service_1.BiletbankUpdatePassengerService) === "function" ? _a : Object])
], BiletbankUpdatePassengerController);


/***/ },

/***/ "./src/modules/biletbank/air/update-passenger/update-passenger.mapper.ts"
/*!*******************************************************************************!*\
  !*** ./src/modules/biletbank/air/update-passenger/update-passenger.mapper.ts ***!
  \*******************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mapUpdatePassengerXmlToResponse = mapUpdatePassengerXmlToResponse;
const fast_xml_parser_1 = __webpack_require__(/*! fast-xml-parser */ "fast-xml-parser");
function mapUpdatePassengerXmlToResponse(rawXml) {
    const parser = new fast_xml_parser_1.XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: true,
        parseTagValue: true,
        parseAttributeValue: true,
        trimValues: true,
    });
    const doc = parser.parse(rawXml);
    const result = doc?.Envelope?.Body?.UpdatePassengersResponse?.UpdatePassengersResult ??
        doc?.Body?.UpdatePassengersResponse?.UpdatePassengersResult ??
        doc?.UpdatePassengersResponse?.UpdatePassengersResult;
    const hasErrorRaw = result?.HasError;
    const hasError = typeof hasErrorRaw === 'boolean'
        ? hasErrorRaw
        : typeof hasErrorRaw === 'string'
            ? hasErrorRaw.toLowerCase() === 'true'
            : false;
    const errorMessage = result?.ServiceError?.ErrorMessage ||
        result?.ServiceError?.DebugMessage ||
        result?.ErrorMessage ||
        undefined;
    const shoppingFile = result?.ShoppingFile;
    const shoppingFileId = shoppingFile?.Id ?? shoppingFile?.id;
    return {
        hasError,
        errorMessage: errorMessage ? String(errorMessage).trim() : undefined,
        shoppingFileId: shoppingFileId ? String(shoppingFileId).trim() : undefined,
        details: result,
    };
}


/***/ },

/***/ "./src/modules/biletbank/air/update-passenger/update-passenger.module.ts"
/*!*******************************************************************************!*\
  !*** ./src/modules/biletbank/air/update-passenger/update-passenger.module.ts ***!
  \*******************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankUpdatePassengerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_module_1 = __webpack_require__(/*! ../../auth/auth.module */ "./src/modules/biletbank/auth/auth.module.ts");
const update_passenger_controller_1 = __webpack_require__(/*! ./update-passenger.controller */ "./src/modules/biletbank/air/update-passenger/update-passenger.controller.ts");
const update_passenger_service_1 = __webpack_require__(/*! ./update-passenger.service */ "./src/modules/biletbank/air/update-passenger/update-passenger.service.ts");
const booking_auth_guard_1 = __webpack_require__(/*! ../../guards/booking-auth.guard */ "./src/modules/biletbank/guards/booking-auth.guard.ts");
let BiletbankUpdatePassengerModule = class BiletbankUpdatePassengerModule {
};
exports.BiletbankUpdatePassengerModule = BiletbankUpdatePassengerModule;
exports.BiletbankUpdatePassengerModule = BiletbankUpdatePassengerModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.BiletbankAuthModule],
        controllers: [update_passenger_controller_1.BiletbankUpdatePassengerController],
        providers: [update_passenger_service_1.BiletbankUpdatePassengerService, booking_auth_guard_1.BookingAuthGuard],
        exports: [update_passenger_service_1.BiletbankUpdatePassengerService],
    })
], BiletbankUpdatePassengerModule);


/***/ },

/***/ "./src/modules/biletbank/air/update-passenger/update-passenger.service.ts"
/*!********************************************************************************!*\
  !*** ./src/modules/biletbank/air/update-passenger/update-passenger.service.ts ***!
  \********************************************************************************/
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
var BiletbankUpdatePassengerService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankUpdatePassengerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const biletbank_config_1 = __webpack_require__(/*! ../../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const soap_transport_1 = __webpack_require__(/*! ../../common/soap.transport */ "./src/modules/biletbank/common/soap.transport.ts");
const update_passenger_mapper_1 = __webpack_require__(/*! ./update-passenger.mapper */ "./src/modules/biletbank/air/update-passenger/update-passenger.mapper.ts");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
function maskSessionId(sessionId) {
    if (!sessionId || sessionId.length < 4)
        return 'SESS-***';
    return `SESS-${sessionId.substring(0, 2)}***${sessionId.substring(sessionId.length - 2)}`;
}
function maskSessionToken(token) {
    if (!token || token.length < 4)
        return 'TOK-***';
    return `TOK-${token.substring(0, 2)}***${token.substring(token.length - 2)}`;
}
function sanitizeFirstName(name) {
    return (name || '').replace(/\s+/g, '').trim().toUpperCase() || 'PASSENGER';
}
function escapeXml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
function normalizeGuidLike(value) {
    if (value === undefined || value === null)
        return undefined;
    const normalized = String(value).trim();
    return normalized.length > 0 && normalized !== '[object Object]' ? normalized : undefined;
}
function buildPassengerXml(p, useMinimalDomesticShape) {
    const firstName = sanitizeFirstName(p.firstName);
    const lastName = (p.lastName || '').trim().toUpperCase() || 'PASSENGER';
    const wheelChair = p.wheelChairServiceType ?? 0;
    const citizenNo = useMinimalDomesticShape ? '00000000000' : p.citizenNo;
    const isDomesticTc = p.citizenNo && p.citizenNo !== '00000000000';
    const optionalIdentityXml = isDomesticTc
        ? (useMinimalDomesticShape
            ? ''
            : `
              <trev2:Nationality>${escapeXml(p.nationality)}</trev2:Nationality>
              <trev2:PassportCountry/>
              <trev2:PassportNo/>
              <trev2:PassportValidDate/>`)
        : `
              <trev2:Nationality>${escapeXml(p.nationality)}</trev2:Nationality>
              <trev2:PassportCountry>${escapeXml(p.passportCountry)}</trev2:PassportCountry>
              <trev2:PassportNo>${escapeXml(p.passportNo)}</trev2:PassportNo>
              ${p.passportValidDate
            ? `<trev2:PassportValidDate>${escapeXml(p.passportValidDate)}</trev2:PassportValidDate>`
            : ''}`;
    return `
            <trev2:T_Passenger>
              <trev2:BirthDate>${escapeXml(p.birthDate)}</trev2:BirthDate>
              <trev2:CitizenNo>${escapeXml(citizenNo)}</trev2:CitizenNo>
              <trev2:Email>${escapeXml(p.email)}</trev2:Email>
              <trev2:FirstName>${escapeXml(firstName)}</trev2:FirstName>
              <trev2:Gender>${escapeXml(p.gender)}</trev2:Gender>
              <trev2:Id>${escapeXml(p.id)}</trev2:Id>
              <trev2:IfContact>${p.ifContact ? 'true' : 'false'}</trev2:IfContact>
              <trev2:LastName>${escapeXml(lastName)}</trev2:LastName>
              ${optionalIdentityXml}
              <trev2:Phone>${escapeXml(p.phone)}</trev2:Phone>
              <trev2:SequenceNo>${p.sequenceNo}</trev2:SequenceNo>
              <trev2:TempTag>${escapeXml(p.tempTag)}</trev2:TempTag>
              <trev2:Type>${escapeXml(p.type)}</trev2:Type>
              <trev2:WheelChairServiceType>${wheelChair}</trev2:WheelChairServiceType>
            </trev2:T_Passenger>`;
}
let BiletbankUpdatePassengerService = BiletbankUpdatePassengerService_1 = class BiletbankUpdatePassengerService {
    cfg;
    logger = new common_1.Logger(BiletbankUpdatePassengerService_1.name);
    constructor(cfg) {
        this.cfg = cfg;
    }
    async updatePassengers(dto) {
        const startTime = Date.now();
        const correlationId = (0, crypto_1.randomUUID)();
        const c = this.cfg.config;
        if (!dto.sessionId || !dto.sessionToken) {
            this.logger.warn('UpdatePassenger validation failed: Session missing', {
                correlationId,
                hasSessionId: !!dto.sessionId,
                hasSessionToken: !!dto.sessionToken,
            });
            throw new common_1.BadRequestException('Session bilgileri eksik. Lütfen önce uçuş araması yapın.');
        }
        if (!dto.productIds?.length) {
            this.logger.warn('UpdatePassenger validation failed: ProductIds empty', {
                correlationId,
            });
            throw new common_1.BadRequestException('En az bir ProductId gereklidir.');
        }
        if (!dto.newPassengers?.length) {
            this.logger.warn('UpdatePassenger validation failed: No passengers', {
                correlationId,
            });
            throw new common_1.BadRequestException('En az bir yolcu bilgisi gereklidir.');
        }
        this.logger.log('UpdatePassenger started', {
            correlationId,
            sessionId: maskSessionId(dto.sessionId),
            productIds: dto.productIds,
            passengerCount: dto.newPassengers.length,
        });
        const productIdsXml = dto.productIds
            .map((id) => `<arr:guid>${escapeXml(id.trim())}</arr:guid>`)
            .join('\n                    ');
        const buildRequestXml = (passengers) => {
            const useMinimalDomesticShape = passengers.length === 1 &&
                dto.productIds.length === 1 &&
                passengers.every((p) => p.citizenNo && p.citizenNo !== '00000000000');
            const normalizedPassengers = useMinimalDomesticShape
                ? passengers.map((p) => ({
                    ...p,
                    id: dto.productIds[0].trim(),
                }))
                : passengers;
            const passengersXml = normalizedPassengers
                .map((p) => buildPassengerXml(p, useMinimalDomesticShape))
                .join('');
            if (useMinimalDomesticShape) {
                return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base" xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping" xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Shopping" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:UpdatePassengers>
         <tem:request>
            <trev:AuthenticationHeader>
               <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
               <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
            </trev:AuthenticationHeader>
            <trev1:Form>
               <trev1:ModifiedPassengers/>
               <trev1:NewPassengers>${passengersXml}
               </trev1:NewPassengers>
               <trev1:ProductIds>
                  ${productIdsXml}
               </trev1:ProductIds>
            </trev1:Form>
         </tem:request>
      </tem:UpdatePassengers>
   </soapenv:Body>
</soapenv:Envelope>`;
            }
            return `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/"
  xmlns:trev="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Base"
  xmlns:trev1="http://schemas.datacontract.org/2004/07/Trevoo.WS.IO.Shopping"
  xmlns:trev2="http://schemas.datacontract.org/2004/07/Trevoo.WS.Entities.Shopping"
  xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays"
  xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:UpdatePassengers>
      <tem:request>
        <trev:AuthenticationHeader>
          <trev:SessionId>${escapeXml(dto.sessionId)}</trev:SessionId>
          <trev:SessionToken>${escapeXml(dto.sessionToken)}</trev:SessionToken>
        </trev:AuthenticationHeader>
        <trev1:Form>
          <trev1:ModifiedPassengers i:nil="true"/>
          <trev1:NewPassengers>
            ${passengersXml}
          </trev1:NewPassengers>
          <trev1:ProductIds>
            ${productIdsXml}
          </trev1:ProductIds>
        </trev1:Form>
      </tem:request>
    </tem:UpdatePassengers>
  </soapenv:Body>
</soapenv:Envelope>`;
        };
        const xml = buildRequestXml(dto.newPassengers);
        try {
            const { rawXml } = await (0, soap_transport_1.soapPost)({
                url: c.apiUrl,
                clientKey: c.clientKey,
                soapAction: 'http://tempuri.org/I_Shopping/UpdatePassengers',
                xml,
                timeoutMs: 30000,
            });
            const elapsedTime = Date.now() - startTime;
            const mapped = (0, update_passenger_mapper_1.mapUpdatePassengerXmlToResponse)(rawXml);
            const sf = mapped.details?.ShoppingFile;
            const airBookingsNode = sf?.AirBookings;
            const airBookings = Array.isArray(airBookingsNode?.T_AirBooking)
                ? airBookingsNode.T_AirBooking
                : airBookingsNode?.T_AirBooking
                    ? [airBookingsNode.T_AirBooking]
                    : [];
            const responseLocalSeqNos = airBookings.flatMap((b) => {
                const items = b?.BookingItems?.T_AirBookingItem;
                const itemList = Array.isArray(items) ? items : items ? [items] : [];
                return itemList.flatMap((it) => {
                    const refs = it?.PaxReference;
                    const refList = Array.isArray(refs) ? refs : refs ? [refs] : [];
                    return refList.map((r) => r?.LocalSequenceNo).filter((x) => x !== undefined && x !== null);
                });
            });
            if (mapped.hasError) {
                const errorMessage = mapped.errorMessage || 'Yolcu bilgileri güncellenemedi.';
                const lowerMsg = errorMessage.toLowerCase();
                const isSessionExpired = lowerMsg.includes('session') ||
                    lowerMsg.includes('unauthorized') ||
                    lowerMsg.includes('invalid session');
                const isBasketInvalid = lowerMsg.includes('basket code') || lowerMsg.includes('same basket');
                if (isSessionExpired) {
                    this.logger.warn('UpdatePassenger failed: Session invalid/expired', {
                        correlationId,
                        errorMessage,
                        elapsedTime,
                        sessionId: maskSessionId(dto.sessionId),
                    });
                    throw new common_1.UnauthorizedException('Oturum süresi dolmuş. Lütfen yeniden arama yapın.');
                }
                if (isBasketInvalid) {
                    this.logger.warn('UpdatePassenger failed: Basket/session invalid', {
                        correlationId,
                        errorMessage,
                        elapsedTime,
                        sessionId: maskSessionId(dto.sessionId),
                    });
                    throw new common_1.BadRequestException('Bu rezervasyon oturumu artık geçersiz. Lütfen anasayfadan yeni bir uçuş araması yapıp tekrar deneyin.');
                }
                const isSequenceMismatch = lowerMsg.includes('sequence contains no matching element');
                if (isSequenceMismatch && responseLocalSeqNos.length > 0) {
                    const seqToRef = new Map();
                    for (const b of airBookings) {
                        const items = b?.BookingItems?.T_AirBookingItem;
                        const itemList = Array.isArray(items) ? items : items ? [items] : [];
                        for (const it of itemList) {
                            const refs = it?.PaxReference;
                            const refList = Array.isArray(refs) ? refs : refs ? [refs] : [];
                            for (const r of refList) {
                                const seq = Number(r?.LocalSequenceNo);
                                if (!Number.isNaN(seq) && seq > 0) {
                                    seqToRef.set(seq, {
                                        passengerId: normalizeGuidLike(r?.PassengerId),
                                        paxReferenceId: normalizeGuidLike(r?.PaxReferenceId),
                                    });
                                }
                            }
                        }
                    }
                    const retriedPassengers = dto.newPassengers.map((p) => {
                        const ref = seqToRef.get(Number(p.sequenceNo));
                        return {
                            ...p,
                            id: ref?.passengerId || p.id,
                            tempTag: ref?.paxReferenceId || ref?.passengerId || p.tempTag,
                        };
                    });
                    const anyChanged = retriedPassengers.some((p, idx) => p.id !== dto.newPassengers[idx].id || p.tempTag !== dto.newPassengers[idx].tempTag);
                    if (anyChanged) {
                        const retryXml = buildRequestXml(retriedPassengers);
                        const retry = await (0, soap_transport_1.soapPost)({
                            url: c.apiUrl,
                            clientKey: c.clientKey,
                            soapAction: 'http://tempuri.org/I_Shopping/UpdatePassengers',
                            xml: retryXml,
                            timeoutMs: 30000,
                        });
                        const retryMapped = (0, update_passenger_mapper_1.mapUpdatePassengerXmlToResponse)(retry.rawXml);
                        if (!retryMapped.hasError) {
                            this.logger.log('UpdatePassenger success (retry)', {
                                correlationId,
                                passengerCount: retriedPassengers.length,
                            });
                            return {
                                success: true,
                                message: 'Yolcu bilgileri başarıyla güncellendi',
                                shoppingFileId: retryMapped.shoppingFileId,
                                details: retryMapped.details,
                                correlationId,
                            };
                        }
                    }
                }
                this.logger.error('UpdatePassenger failed', {
                    correlationId,
                    errorMessage,
                    elapsedTime,
                    sessionId: maskSessionId(dto.sessionId),
                    sessionToken: maskSessionToken(dto.sessionToken),
                });
                throw new common_1.BadRequestException(errorMessage);
            }
            this.logger.log('UpdatePassenger success', {
                correlationId,
                passengerCount: dto.newPassengers.length,
                elapsedTime,
            });
            return {
                success: true,
                message: 'Yolcu bilgileri başarıyla güncellendi',
                shoppingFileId: mapped.shoppingFileId,
                details: mapped.details,
                correlationId,
            };
        }
        catch (error) {
            const elapsedTime = Date.now() - startTime;
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error('UpdatePassenger error', {
                correlationId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                elapsedTime,
                sessionId: maskSessionId(dto.sessionId),
                sessionToken: maskSessionToken(dto.sessionToken),
            });
            throw new common_1.InternalServerErrorException('Yolcu bilgileri güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
};
exports.BiletbankUpdatePassengerService = BiletbankUpdatePassengerService;
exports.BiletbankUpdatePassengerService = BiletbankUpdatePassengerService = BiletbankUpdatePassengerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _a : Object])
], BiletbankUpdatePassengerService);


/***/ },

/***/ "./src/modules/biletbank/auth/auth.module.ts"
/*!***************************************************!*\
  !*** ./src/modules/biletbank/auth/auth.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankAuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const biletbank_config_1 = __webpack_require__(/*! ../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/biletbank/auth/auth.service.ts");
let BiletbankAuthModule = class BiletbankAuthModule {
};
exports.BiletbankAuthModule = BiletbankAuthModule;
exports.BiletbankAuthModule = BiletbankAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [biletbank_config_1.BiletbankConfigService, auth_service_1.BiletbankAuthService],
        exports: [biletbank_config_1.BiletbankConfigService, auth_service_1.BiletbankAuthService],
    })
], BiletbankAuthModule);


/***/ },

/***/ "./src/modules/biletbank/auth/auth.service.ts"
/*!****************************************************!*\
  !*** ./src/modules/biletbank/auth/auth.service.ts ***!
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
var BiletbankAuthService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankAuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const biletbank_config_1 = __webpack_require__(/*! ../common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
let BiletbankAuthService = BiletbankAuthService_1 = class BiletbankAuthService {
    cfg;
    logger = new common_1.Logger(BiletbankAuthService_1.name);
    client;
    wsdlUrl;
    constructor(cfg) {
        this.cfg = cfg;
        this.wsdlUrl = this.cfg.config.wsdlUrl || 'https://apitest.biletbank.com/TrevooWS.svc?singleWsdl';
    }
    async initializeClient() {
        const soap = await Promise.resolve().then(() => __webpack_require__(/*! soap */ "soap"));
        const c = this.cfg.config;
        const options = {
            timeout: 30000,
            wsdl_options: {
                timeout: 30000,
                connection_timeout: 30000,
            },
            endpoint: c.apiUrl || undefined,
        };
        this.client = await soap.createClientAsync(this.wsdlUrl, options);
        if (c.apiUrl && this.client.setEndpoint) {
            this.client.setEndpoint(c.apiUrl);
        }
        this.logger.log('Biletbank WSDL loaded successfully (Login)');
    }
    async login() {
        const c = this.cfg.config;
        if (!this.client) {
            await this.initializeClient();
        }
        const loginRequest = {
            request: {
                Form: {
                    ChannelCode: c.channelCode,
                    ClientIP: c.clientIP || '',
                    ClientName: c.clientName,
                    Password: c.password,
                    Username: c.username,
                },
            },
        };
        const headers = { 'Client-key': c.clientKey };
        let result;
        if (this.client.LoginAsync) {
            [result] = await this.client.LoginAsync(loginRequest, { headers });
        }
        else if (this.client.Login) {
            result = await new Promise((resolve, reject) => {
                this.client.Login(loginRequest, (err, res) => (err ? reject(err) : resolve(res)), {
                    headers,
                });
            });
        }
        else {
            throw new Error('No Login or LoginAsync method found in SOAP client');
        }
        const loginResult = result?.LoginResult || result?.[0]?.LoginResult || result;
        if (!loginResult)
            throw new Error('Invalid login response from Biletbank');
        const hasError = loginResult.HasError === 'true' || loginResult.HasError === true;
        const authenticationHeader = loginResult.AuthenticationHeader || loginResult.authenticationHeader;
        const sessionToken = authenticationHeader?.SessionToken || authenticationHeader?.sessionToken;
        const sessionId = authenticationHeader?.SessionId || authenticationHeader?.sessionId;
        if (hasError || !sessionToken) {
            this.logger.error('Biletbank login failed', {
                hasError,
                hasToken: !!sessionToken,
            });
            throw new Error('Biletbank login failed: Invalid credentials or session');
        }
        return {
            sessionToken,
            sessionId,
            isValid: !hasError && !!sessionToken,
            expiresAt: authenticationHeader?.ExpiresAt ? new Date(authenticationHeader.ExpiresAt) : undefined,
        };
    }
};
exports.BiletbankAuthService = BiletbankAuthService;
exports.BiletbankAuthService = BiletbankAuthService = BiletbankAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _a : Object])
], BiletbankAuthService);


/***/ },

/***/ "./src/modules/biletbank/biletbank.controller.ts"
/*!*******************************************************!*\
  !*** ./src/modules/biletbank/biletbank.controller.ts ***!
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth/auth.service */ "./src/modules/biletbank/auth/auth.service.ts");
const biletbank_config_1 = __webpack_require__(/*! ./common/biletbank.config */ "./src/modules/biletbank/common/biletbank.config.ts");
let BiletbankController = class BiletbankController {
    auth;
    cfg;
    constructor(auth, cfg) {
        this.auth = auth;
        this.cfg = cfg;
    }
    async test() {
        const loginResult = await this.auth.login();
        return {
            success: true,
            message: 'Biletbank connection successful',
            sessionValid: loginResult.isValid,
            sessionId: loginResult.sessionId,
            config: this.cfg.safeConfig,
        };
    }
};
exports.BiletbankController = BiletbankController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BiletbankController.prototype, "test", null);
exports.BiletbankController = BiletbankController = __decorate([
    (0, common_1.Controller)('biletbank'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.BiletbankAuthService !== "undefined" && auth_service_1.BiletbankAuthService) === "function" ? _a : Object, typeof (_b = typeof biletbank_config_1.BiletbankConfigService !== "undefined" && biletbank_config_1.BiletbankConfigService) === "function" ? _b : Object])
], BiletbankController);


/***/ },

/***/ "./src/modules/biletbank/biletbank.module.ts"
/*!***************************************************!*\
  !*** ./src/modules/biletbank/biletbank.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const biletbank_controller_1 = __webpack_require__(/*! ./biletbank.controller */ "./src/modules/biletbank/biletbank.controller.ts");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/modules/biletbank/auth/auth.module.ts");
const airsearch_module_1 = __webpack_require__(/*! ./air/airsearch/airsearch.module */ "./src/modules/biletbank/air/airsearch/airsearch.module.ts");
const allocate_module_1 = __webpack_require__(/*! ./air/allocate/allocate.module */ "./src/modules/biletbank/air/allocate/allocate.module.ts");
const update_passenger_module_1 = __webpack_require__(/*! ./air/update-passenger/update-passenger.module */ "./src/modules/biletbank/air/update-passenger/update-passenger.module.ts");
const makeprebooking_module_1 = __webpack_require__(/*! ./air/makeprebooking/makeprebooking.module */ "./src/modules/biletbank/air/makeprebooking/makeprebooking.module.ts");
const makepayment_module_1 = __webpack_require__(/*! ./air/makepayment/makepayment.module */ "./src/modules/biletbank/air/makepayment/makepayment.module.ts");
let BiletbankModule = class BiletbankModule {
};
exports.BiletbankModule = BiletbankModule;
exports.BiletbankModule = BiletbankModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.BiletbankAuthModule,
            airsearch_module_1.BiletbankAirSearchModule,
            allocate_module_1.BiletbankAllocateModule,
            update_passenger_module_1.BiletbankUpdatePassengerModule,
            makeprebooking_module_1.BiletbankMakePrebookingModule,
            makepayment_module_1.BiletbankMakePaymentModule,
        ],
        controllers: [biletbank_controller_1.BiletbankController],
    })
], BiletbankModule);


/***/ },

/***/ "./src/modules/biletbank/common/biletbank.config.ts"
/*!**********************************************************!*\
  !*** ./src/modules/biletbank/common/biletbank.config.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BiletbankConfigService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let BiletbankConfigService = class BiletbankConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    get config() {
        return {
            apiUrl: this.configService.get('BILETBANK_API_URL') || '',
            clientKey: this.configService.get('BILETBANK_CLIENT_KEY') || '',
            username: this.configService.get('BILETBANK_USERNAME') || '',
            password: this.configService.get('BILETBANK_PASSWORD') || '',
            wsdlUrl: this.configService.get('BILETBANK_WSDL_URL') || '',
            soapAction: this.configService.get('BILETBANK_SOAP_ACTION') || '',
            channelCode: this.configService.get('BILETBANK_CHANNEL_CODE') || '2',
            clientName: this.configService.get('BILETBANK_CLIENT_NAME') || '',
            clientIP: this.configService.get('BILETBANK_CLIENT_IP') || '',
        };
    }
    get safeConfig() {
        const c = this.config;
        return {
            apiUrl: c.apiUrl,
            username: c.username,
            wsdlUrl: c.wsdlUrl,
            soapAction: c.soapAction,
            channelCode: c.channelCode,
            clientName: c.clientName,
            clientIP: c.clientIP,
        };
    }
};
exports.BiletbankConfigService = BiletbankConfigService;
exports.BiletbankConfigService = BiletbankConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], BiletbankConfigService);


/***/ },

/***/ "./src/modules/biletbank/common/soap.transport.ts"
/*!********************************************************!*\
  !*** ./src/modules/biletbank/common/soap.transport.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.soapPost = soapPost;
const axios_1 = __webpack_require__(/*! axios */ "axios");
async function soapPost(options) {
    const res = await axios_1.default.post(options.url, options.xml, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Client-key': options.clientKey,
            SOAPAction: `"${options.soapAction}"`,
        },
        timeout: options.timeoutMs ?? 30000,
    });
    return { status: res.status, rawXml: String(res.data) };
}


/***/ },

/***/ "./src/modules/biletbank/dto/air-search-request.dto.ts"
/*!*************************************************************!*\
  !*** ./src/modules/biletbank/dto/air-search-request.dto.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AirSearchRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class AirSearchRequestDto {
    tripType;
    originCode;
    originCountryCode;
    originIsCity;
    destinationCode;
    destinationCountryCode;
    destinationIsCity;
    departureDate;
    returnDate;
    adults;
    children;
    infants;
    searchReason;
}
exports.AirSearchRequestDto = AirSearchRequestDto;
__decorate([
    (0, class_validator_1.IsIn)(['OW', 'RT', 'MP']),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "tripType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "originCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 2),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "originCountryCode", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AirSearchRequestDto.prototype, "originIsCity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "destinationCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 2),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "destinationCountryCode", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AirSearchRequestDto.prototype, "destinationIsCity", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "departureDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "returnDate", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(9),
    __metadata("design:type", Number)
], AirSearchRequestDto.prototype, "adults", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(8),
    __metadata("design:type", Number)
], AirSearchRequestDto.prototype, "children", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(8),
    __metadata("design:type", Number)
], AirSearchRequestDto.prototype, "infants", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['SearchOnly', 'SearchAndBook']),
    __metadata("design:type", String)
], AirSearchRequestDto.prototype, "searchReason", void 0);


/***/ },

/***/ "./src/modules/biletbank/dto/allocate-request.dto.ts"
/*!***********************************************************!*\
  !*** ./src/modules/biletbank/dto/allocate-request.dto.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllocateRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class AllocateRequestDto {
    productId;
    brandedFareItemId;
    sessionId;
    sessionToken;
    shoppingFileId;
    flightId;
    selectedServiceFeeAmount;
}
exports.AllocateRequestDto = AllocateRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AllocateRequestDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AllocateRequestDto.prototype, "brandedFareItemId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AllocateRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AllocateRequestDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AllocateRequestDto.prototype, "shoppingFileId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AllocateRequestDto.prototype, "flightId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }, { message: 'SelectedServiceFeeAmount geçerli bir sayı olmalıdır.' }),
    (0, class_validator_1.Min)(0, { message: 'SelectedServiceFeeAmount negatif olamaz.' }),
    __metadata("design:type", Number)
], AllocateRequestDto.prototype, "selectedServiceFeeAmount", void 0);


/***/ },

/***/ "./src/modules/biletbank/dto/finalizeshopping-request.dto.ts"
/*!*******************************************************************!*\
  !*** ./src/modules/biletbank/dto/finalizeshopping-request.dto.ts ***!
  \*******************************************************************/
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
exports.FinalizeShoppingRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class FinalizeShoppingRequestDto {
    sessionId;
    sessionToken;
    shoppingFileId;
    billingName;
    addressCity;
    addressDetail;
    addressDistrict;
    addressZipCode;
    countryCode;
    ifCompany;
    taxNo;
    taxOffice;
}
exports.FinalizeShoppingRequestDto = FinalizeShoppingRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "shoppingFileId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "billingName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "addressCity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "addressDetail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "addressDistrict", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "addressZipCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "countryCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FinalizeShoppingRequestDto.prototype, "ifCompany", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "taxNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FinalizeShoppingRequestDto.prototype, "taxOffice", void 0);


/***/ },

/***/ "./src/modules/biletbank/dto/init3dpayment-request.dto.ts"
/*!****************************************************************!*\
  !*** ./src/modules/biletbank/dto/init3dpayment-request.dto.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Init3DPaymentRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class Init3DPaymentRequestDto {
    sessionId;
    sessionToken;
    shoppingFileId;
    amount;
    currency;
    isPartialPayment;
    cardNumber;
    cardHolderName;
    expireMonth;
    expireYear;
    cvv;
    callbackUrl;
    installmentOptionId;
}
exports.Init3DPaymentRequestDto = Init3DPaymentRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "shoppingFileId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], Init3DPaymentRequestDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Init3DPaymentRequestDto.prototype, "isPartialPayment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "cardNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "cardHolderName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "expireMonth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "expireYear", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "cvv", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "callbackUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Init3DPaymentRequestDto.prototype, "installmentOptionId", void 0);


/***/ },

/***/ "./src/modules/biletbank/dto/makepayment-request.dto.ts"
/*!**************************************************************!*\
  !*** ./src/modules/biletbank/dto/makepayment-request.dto.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MakePaymentRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class MakePaymentRequestDto {
    sessionId;
    sessionToken;
    shoppingFileId;
    amount;
    currency;
    isPartialPayment;
    paymentType;
    deductLastSellerCommission;
}
exports.MakePaymentRequestDto = MakePaymentRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePaymentRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePaymentRequestDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePaymentRequestDto.prototype, "shoppingFileId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MakePaymentRequestDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePaymentRequestDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MakePaymentRequestDto.prototype, "isPartialPayment", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePaymentRequestDto.prototype, "paymentType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MakePaymentRequestDto.prototype, "deductLastSellerCommission", void 0);


/***/ },

/***/ "./src/modules/biletbank/dto/makeprebooking-request.dto.ts"
/*!*****************************************************************!*\
  !*** ./src/modules/biletbank/dto/makeprebooking-request.dto.ts ***!
  \*****************************************************************/
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
exports.MakePrebookingRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class MakePrebookingRequestDto {
    sessionId;
    sessionToken;
    productId;
    shoppingFileId;
    brandedFareItemId;
    brandedCode;
}
exports.MakePrebookingRequestDto = MakePrebookingRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePrebookingRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePrebookingRequestDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePrebookingRequestDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MakePrebookingRequestDto.prototype, "shoppingFileId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakePrebookingRequestDto.prototype, "brandedFareItemId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MakePrebookingRequestDto.prototype, "brandedCode", void 0);


/***/ },

/***/ "./src/modules/biletbank/dto/update-passenger-request.dto.ts"
/*!*******************************************************************!*\
  !*** ./src/modules/biletbank/dto/update-passenger-request.dto.ts ***!
  \*******************************************************************/
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
exports.UpdatePassengerRequestDto = exports.UpdatePassengerItemDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class UpdatePassengerItemDto {
    birthDate;
    citizenNo;
    email;
    firstName;
    gender;
    id;
    ifContact;
    lastName;
    nationality;
    passportCountry;
    passportNo;
    passportValidDate;
    phone;
    sequenceNo;
    tempTag;
    type;
    wheelChairServiceType;
}
exports.UpdatePassengerItemDto = UpdatePassengerItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "citizenNo", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['M', 'F']),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value === true || value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePassengerItemDto.prototype, "ifContact", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "nationality", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "passportCountry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "passportNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "passportValidDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "phone", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? parseInt(value, 10) || 0 : Number(value) ?? 0)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(99),
    __metadata("design:type", Number)
], UpdatePassengerItemDto.prototype, "sequenceNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "tempTag", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['ADT', 'CHD', 'INF']),
    __metadata("design:type", String)
], UpdatePassengerItemDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], UpdatePassengerItemDto.prototype, "wheelChairServiceType", void 0);
class UpdatePassengerRequestDto {
    sessionId;
    sessionToken;
    productIds;
    newPassengers;
}
exports.UpdatePassengerRequestDto = UpdatePassengerRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePassengerRequestDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    __metadata("design:type", Array)
], UpdatePassengerRequestDto.prototype, "productIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdatePassengerItemDto),
    __metadata("design:type", Array)
], UpdatePassengerRequestDto.prototype, "newPassengers", void 0);


/***/ },

/***/ "./src/modules/biletbank/guards/booking-auth.guard.ts"
/*!************************************************************!*\
  !*** ./src/modules/biletbank/guards/booking-auth.guard.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BookingAuthGuard_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
let BookingAuthGuard = BookingAuthGuard_1 = class BookingAuthGuard extends (0, passport_1.AuthGuard)('jwt-member') {
    logger = new common_1.Logger(BookingAuthGuard_1.name);
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.warn('Token header bulunamadı', {
                path: request.path,
                method: request.method,
                hasAuthHeader: !!authHeader,
            });
        }
        if (body?.searchReason) {
            if (body.searchReason === 'SearchOnly') {
                return true;
            }
            if (body.searchReason === 'SearchAndBook') {
                const result = super.canActivate(context);
                if (typeof result === 'boolean')
                    return result;
                if (result instanceof Promise)
                    return result;
                return (0, rxjs_1.firstValueFrom)(result);
            }
        }
        const result = super.canActivate(context);
        if (typeof result === 'boolean')
            return result;
        if (result instanceof Promise)
            return result;
        return (0, rxjs_1.firstValueFrom)(result);
    }
    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        if (body?.searchReason === 'SearchOnly') {
            this.logger.debug('SearchOnly - Auth bypass', {
                path: request.path,
                searchReason: body.searchReason,
            });
            return null;
        }
        if (err || !user) {
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                this.logger.warn('Token header bulunamadı veya geçersiz format', {
                    path: request.path,
                    method: request.method,
                    searchReason: body?.searchReason,
                    hasAuthHeader: !!authHeader,
                    authHeaderPrefix: authHeader?.substring(0, 10) || 'N/A',
                });
                if (body?.searchReason === 'SearchAndBook') {
                    throw new common_1.UnauthorizedException('Rezervasyon işlemleri için giriş yapmanız gerekmektedir. Lütfen giriş yapın ve tekrar deneyin.');
                }
                throw new common_1.UnauthorizedException('Bu işlem için giriş yapmanız gerekmektedir.');
            }
            this.logger.warn('Token doğrulama hatası', {
                path: request.path,
                method: request.method,
                searchReason: body?.searchReason,
                errorName: info?.name,
                errorMessage: err?.message || info?.message,
                hasUser: !!user,
            });
            if (info?.name === 'JsonWebTokenError') {
                throw new common_1.UnauthorizedException('Geçersiz token. Lütfen tekrar giriş yapın.');
            }
            if (info?.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            }
            if (body?.searchReason === 'SearchAndBook') {
                throw new common_1.UnauthorizedException('Rezervasyon işlemleri için giriş yapmanız gerekmektedir. Lütfen giriş yapın ve tekrar deneyin.');
            }
            throw new common_1.UnauthorizedException('Bu işlem için giriş yapmanız gerekmektedir.');
        }
        this.logger.debug('Token doğrulama başarılı', {
            path: request.path,
            method: request.method,
            searchReason: body?.searchReason,
            userId: user?.memberId,
        });
        return user;
    }
};
exports.BookingAuthGuard = BookingAuthGuard;
exports.BookingAuthGuard = BookingAuthGuard = BookingAuthGuard_1 = __decorate([
    (0, common_1.Injectable)()
], BookingAuthGuard);


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
let ContractsController = class ContractsController {
    contractsService;
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    async findAll() {
        const data = await this.contractsService.findAll();
        return { success: true, data };
    }
    async findBySlug(slug) {
        const contract = await this.contractsService.findBySlug(slug);
        if (!contract) {
            return { success: false, contract: null };
        }
        return { success: true, contract };
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
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findBySlug", null);
exports.ContractsController = ContractsController = __decorate([
    (0, common_1.Controller)('contracts'),
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
const contracts_schema_1 = __webpack_require__(/*! ./contracts.schema */ "./src/modules/contracts/contracts.schema.ts");
const contracts_service_1 = __webpack_require__(/*! ./contracts.service */ "./src/modules/contracts/contracts.service.ts");
const contracts_controller_1 = __webpack_require__(/*! ./contracts.controller */ "./src/modules/contracts/contracts.controller.ts");
let ContractsModule = class ContractsModule {
};
exports.ContractsModule = ContractsModule;
exports.ContractsModule = ContractsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: contracts_schema_1.Contract.name, schema: contracts_schema_1.ContractSchema }]),
        ],
        providers: [contracts_service_1.ContractsService],
        controllers: [contracts_controller_1.ContractsController],
        exports: [contracts_service_1.ContractsService],
    })
], ContractsModule);


/***/ },

/***/ "./src/modules/contracts/contracts.schema.ts"
/*!***************************************************!*\
  !*** ./src/modules/contracts/contracts.schema.ts ***!
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
const contracts_schema_1 = __webpack_require__(/*! ./contracts.schema */ "./src/modules/contracts/contracts.schema.ts");
let ContractsService = class ContractsService {
    contractModel;
    constructor(contractModel) {
        this.contractModel = contractModel;
    }
    async findAll() {
        const list = await this.contractModel
            .find({ active: true })
            .select('slug title')
            .sort({ order: 1, title: 1 })
            .lean()
            .exec();
        return list.map((d) => ({ slug: d.slug, title: d.title }));
    }
    async findBySlug(slug) {
        const d = await this.contractModel
            .findOne({ slug: (slug || '').trim().toLowerCase(), active: true })
            .select('slug title content')
            .lean()
            .exec();
        if (!d)
            return null;
        return {
            slug: d.slug,
            title: d.title,
            content: d.content || '',
        };
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contracts_schema_1.Contract.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ContractsService);


/***/ },

/***/ "./src/modules/reservations/dto/create-reservation.dto.ts"
/*!****************************************************************!*\
  !*** ./src/modules/reservations/dto/create-reservation.dto.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateReservationDto = exports.PaymentDto = exports.FlightDto = exports.FlightPointDto = exports.PassengerDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class PassengerDto {
    firstName;
    lastName;
    type;
    citizenNo;
    passportNo;
    passportCountry;
    passportValidDate;
    birthDate;
    gender;
    nationality;
    idType;
    email;
    phone;
}
exports.PassengerDto = PassengerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PassengerDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PassengerDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PassengerDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], PassengerDto.prototype, "citizenNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], PassengerDto.prototype, "passportNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], PassengerDto.prototype, "passportCountry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], PassengerDto.prototype, "passportValidDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], PassengerDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(8),
    __metadata("design:type", String)
], PassengerDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(8),
    __metadata("design:type", String)
], PassengerDto.prototype, "nationality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(16),
    __metadata("design:type", String)
], PassengerDto.prototype, "idType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(256),
    __metadata("design:type", String)
], PassengerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], PassengerDto.prototype, "phone", void 0);
class FlightPointDto {
    airportCode;
    airportName;
    airport;
    city;
    time;
    date;
}
exports.FlightPointDto = FlightPointDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FlightPointDto.prototype, "airportCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightPointDto.prototype, "airportName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightPointDto.prototype, "airport", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightPointDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FlightPointDto.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FlightPointDto.prototype, "date", void 0);
class FlightDto {
    airline;
    airlineLogo;
    flightNumber;
    departure;
    arrival;
    duration;
    cabinClass;
    brandName;
    baggageDescription;
}
exports.FlightDto = FlightDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FlightDto.prototype, "airline", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightDto.prototype, "airlineLogo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FlightDto.prototype, "flightNumber", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FlightPointDto),
    __metadata("design:type", FlightPointDto)
], FlightDto.prototype, "departure", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FlightPointDto),
    __metadata("design:type", FlightPointDto)
], FlightDto.prototype, "arrival", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightDto.prototype, "cabinClass", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightDto.prototype, "brandName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlightDto.prototype, "baggageDescription", void 0);
class PaymentDto {
    amount;
    currency;
    cardNumber;
    cardHolder;
    bankName;
    installmentCount;
    finalizedDate;
    paymentId;
}
exports.PaymentDto = PaymentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "cardNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "cardHolder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "bankName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentDto.prototype, "installmentCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "finalizedDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "paymentId", void 0);
class CreateReservationDto {
    bookingCode;
    status;
    type;
    flight;
    passengers;
    payment;
    shoppingFileId;
    totalFare;
    currency;
    correlationId;
    failureReason;
}
exports.CreateReservationDto = CreateReservationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "bookingCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['CONFIRMED', 'CANCELLED', 'PENDING', 'PAYMENT_FAILED']),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['flight', 'bus', 'hotel', 'car']),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FlightDto),
    __metadata("design:type", FlightDto)
], CreateReservationDto.prototype, "flight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PassengerDto),
    __metadata("design:type", Array)
], CreateReservationDto.prototype, "passengers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentDto),
    __metadata("design:type", PaymentDto)
], CreateReservationDto.prototype, "payment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "shoppingFileId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReservationDto.prototype, "totalFare", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "correlationId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "failureReason", void 0);


/***/ },

/***/ "./src/modules/reservations/reservation.schema.ts"
/*!********************************************************!*\
  !*** ./src/modules/reservations/reservation.schema.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationSchema = exports.Reservation = exports.ReservationPaymentSchema = exports.ReservationPayment = exports.ReservationFlightSchema = exports.ReservationFlight = exports.ReservationFlightPointSchema = exports.ReservationFlightPoint = exports.ReservationPassengerSchema = exports.ReservationPassenger = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let ReservationPassenger = class ReservationPassenger {
    firstName;
    lastName;
    type;
    citizenNo;
    citizenNoSha256;
    passportNo;
    passportCountry;
    passportValidDate;
    birthDate;
    gender;
    nationality;
    idType;
    email;
    phone;
};
exports.ReservationPassenger = ReservationPassenger;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "citizenNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "citizenNoSha256", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "passportNo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "passportCountry", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "passportValidDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "birthDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "nationality", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "idType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPassenger.prototype, "phone", void 0);
exports.ReservationPassenger = ReservationPassenger = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReservationPassenger);
exports.ReservationPassengerSchema = mongoose_1.SchemaFactory.createForClass(ReservationPassenger);
let ReservationFlightPoint = class ReservationFlightPoint {
    airportCode;
    airportName;
    airport;
    city;
    time;
    date;
};
exports.ReservationFlightPoint = ReservationFlightPoint;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationFlightPoint.prototype, "airportCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlightPoint.prototype, "airportName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlightPoint.prototype, "airport", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlightPoint.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationFlightPoint.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationFlightPoint.prototype, "date", void 0);
exports.ReservationFlightPoint = ReservationFlightPoint = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReservationFlightPoint);
exports.ReservationFlightPointSchema = mongoose_1.SchemaFactory.createForClass(ReservationFlightPoint);
let ReservationFlight = class ReservationFlight {
    airline;
    airlineLogo;
    flightNumber;
    departure;
    arrival;
    duration;
    cabinClass;
    brandName;
    baggageDescription;
};
exports.ReservationFlight = ReservationFlight;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationFlight.prototype, "airline", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlight.prototype, "airlineLogo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReservationFlight.prototype, "flightNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ReservationFlightPointSchema }),
    __metadata("design:type", ReservationFlightPoint)
], ReservationFlight.prototype, "departure", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ReservationFlightPointSchema }),
    __metadata("design:type", ReservationFlightPoint)
], ReservationFlight.prototype, "arrival", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlight.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlight.prototype, "cabinClass", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlight.prototype, "brandName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationFlight.prototype, "baggageDescription", void 0);
exports.ReservationFlight = ReservationFlight = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReservationFlight);
exports.ReservationFlightSchema = mongoose_1.SchemaFactory.createForClass(ReservationFlight);
let ReservationPayment = class ReservationPayment {
    amount;
    currency;
    cardNumber;
    cardHolder;
    bankName;
    installmentCount;
    finalizedDate;
    paymentId;
};
exports.ReservationPayment = ReservationPayment;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ReservationPayment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPayment.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPayment.prototype, "cardNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPayment.prototype, "cardHolder", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPayment.prototype, "bankName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ReservationPayment.prototype, "installmentCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPayment.prototype, "finalizedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReservationPayment.prototype, "paymentId", void 0);
exports.ReservationPayment = ReservationPayment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReservationPayment);
exports.ReservationPaymentSchema = mongoose_1.SchemaFactory.createForClass(ReservationPayment);
let Reservation = class Reservation extends mongoose_2.Document {
    memberId;
    reservationNo;
    bookingCode;
    status;
    type;
    flight;
    passengers;
    payment;
    shoppingFileId;
    totalFare;
    currency;
    correlationId;
    failureReason;
};
exports.Reservation = Reservation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Member', required: false, default: null }),
    __metadata("design:type", Object)
], Reservation.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Reservation.prototype, "reservationNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reservation.prototype, "bookingCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'CONFIRMED' }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'flight' }),
    __metadata("design:type", String)
], Reservation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ReservationFlightSchema }),
    __metadata("design:type", ReservationFlight)
], Reservation.prototype, "flight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ReservationPassengerSchema], default: [] }),
    __metadata("design:type", Array)
], Reservation.prototype, "passengers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.ReservationPaymentSchema }),
    __metadata("design:type", ReservationPayment)
], Reservation.prototype, "payment", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reservation.prototype, "shoppingFileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Reservation.prototype, "totalFare", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reservation.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reservation.prototype, "correlationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Reservation.prototype, "failureReason", void 0);
exports.Reservation = Reservation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'reservations' })
], Reservation);
exports.ReservationSchema = mongoose_1.SchemaFactory.createForClass(Reservation);


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const reservations_service_1 = __webpack_require__(/*! ./reservations.service */ "./src/modules/reservations/reservations.service.ts");
const create_reservation_dto_1 = __webpack_require__(/*! ./dto/create-reservation.dto */ "./src/modules/reservations/dto/create-reservation.dto.ts");
const optional_jwt_member_guard_1 = __webpack_require__(/*! ../auth/guards/optional-jwt-member.guard */ "./src/modules/auth/guards/optional-jwt-member.guard.ts");
const jwt_member_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-member.guard */ "./src/modules/auth/guards/jwt-member.guard.ts");
let ReservationsController = class ReservationsController {
    reservationsService;
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    async create(dto, req) {
        const memberId = req.user?.memberId ?? null;
        const reservation = await this.reservationsService.create(dto, memberId ?? undefined);
        return {
            success: true,
            reservationId: reservation._id?.toString(),
            bookingCode: reservation.bookingCode,
        };
    }
    async getMyReservations(req) {
        const memberId = req.user.memberId;
        const reservations = await this.reservationsService.findByMember(memberId);
        return {
            success: true,
            reservations: reservations.map((r) => ({
                id: r._id?.toString(),
                bookingCode: r.bookingCode,
                status: r.status,
                type: r.type,
                flight: r.flight,
                passengers: r.passengers,
                payment: r.payment,
                totalFare: r.totalFare,
                currency: r.currency,
                createdAt: r.createdAt,
            })),
        };
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(optional_jwt_member_guard_1.OptionalJwtMemberGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_reservation_dto_1.CreateReservationDto !== "undefined" && create_reservation_dto_1.CreateReservationDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_member_guard_1.JwtMemberGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getMyReservations", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, common_1.Controller)('reservations'),
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
const reservation_schema_1 = __webpack_require__(/*! ./reservation.schema */ "./src/modules/reservations/reservation.schema.ts");
const reservations_service_1 = __webpack_require__(/*! ./reservations.service */ "./src/modules/reservations/reservations.service.ts");
const reservations_controller_1 = __webpack_require__(/*! ./reservations.controller */ "./src/modules/reservations/reservations.controller.ts");
const admin_notifications_module_1 = __webpack_require__(/*! ../admin-notifications/admin-notifications.module */ "./src/modules/admin-notifications/admin-notifications.module.ts");
let ReservationsModule = class ReservationsModule {
};
exports.ReservationsModule = ReservationsModule;
exports.ReservationsModule = ReservationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: reservation_schema_1.Reservation.name, schema: reservation_schema_1.ReservationSchema }]),
            admin_notifications_module_1.AdminNotificationsModule,
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
var ReservationsService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const reservation_schema_1 = __webpack_require__(/*! ./reservation.schema */ "./src/modules/reservations/reservation.schema.ts");
const admin_notifications_service_1 = __webpack_require__(/*! ../admin-notifications/admin-notifications.service */ "./src/modules/admin-notifications/admin-notifications.service.ts");
const sensitive_identifiers_1 = __webpack_require__(/*! ../../common/privacy/sensitive-identifiers */ "./src/common/privacy/sensitive-identifiers.ts");
let ReservationsService = ReservationsService_1 = class ReservationsService {
    reservationModel;
    adminNotificationsService;
    logger = new common_1.Logger(ReservationsService_1.name);
    constructor(reservationModel, adminNotificationsService) {
        this.reservationModel = reservationModel;
        this.adminNotificationsService = adminNotificationsService;
    }
    safeMemberObjectId(memberId) {
        const id = memberId?.trim();
        if (!id)
            return null;
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            this.logger.warn(`Geçersiz memberId, null yazılıyor: ${id}`);
            return null;
        }
        return new mongoose_2.Types.ObjectId(id);
    }
    normalizePaymentId(paymentId) {
        if (paymentId == null || paymentId === '')
            return undefined;
        return String(paymentId).trim();
    }
    dtoWithNormalizedPayment(dto) {
        const pid = this.normalizePaymentId(dto.payment?.paymentId);
        if (!dto.payment || !pid)
            return dto;
        return {
            ...dto,
            payment: { ...dto.payment, paymentId: pid },
        };
    }
    applyPassengerPrivacy(dto) {
        const passengers = dto.passengers;
        if (!passengers?.length)
            return dto;
        const pepper = (0, sensitive_identifiers_1.getCitizenIdPepper)();
        const redactPlain = process.env.RESERVATION_REDACT_PLAIN_CITIZEN === 'true';
        const next = passengers.map((raw) => {
            const { citizenNoSha256: _ignored, ...p } = raw;
            const norm = (0, sensitive_identifiers_1.normalizeTurkishCitizenId)(p.citizenNo);
            const citizenNoSha256 = norm ? (0, sensitive_identifiers_1.hashCitizenIdForStorage)(norm, pepper) : undefined;
            let citizenNo = p.citizenNo;
            if (redactPlain && norm)
                citizenNo = undefined;
            return { ...p, citizenNo, citizenNoSha256 };
        });
        return { ...dto, passengers: next };
    }
    isMongooseValidationError(err) {
        return (typeof err === 'object' &&
            err !== null &&
            'name' in err &&
            err.name === 'ValidationError');
    }
    async runReservationWrite(fn) {
        try {
            return await fn();
        }
        catch (err) {
            if (this.isMongooseValidationError(err)) {
                const msg = err instanceof Error ? err.message : 'Doğrulama hatası';
                this.logger.warn(`Rezervasyon şema doğrulaması: ${msg}`);
                throw new common_1.BadRequestException(msg);
            }
            throw err;
        }
    }
    async create(dto, memberId) {
        const dtoNorm = this.applyPassengerPrivacy(this.dtoWithNormalizedPayment(dto));
        const payId = this.normalizePaymentId(dtoNorm.payment?.paymentId);
        if (payId) {
            const byPaymentId = await this.reservationModel
                .findOne({ 'payment.paymentId': payId })
                .exec();
            if (byPaymentId) {
                return this.runReservationWrite(() => this.updateByDocumentId(byPaymentId, dtoNorm, memberId));
            }
        }
        if (dtoNorm.shoppingFileId &&
            dtoNorm.status &&
            ['PENDING', 'PAYMENT_FAILED'].includes(dtoNorm.status)) {
            const openByShoppingFile = await this.reservationModel
                .findOne({
                shoppingFileId: dtoNorm.shoppingFileId,
                status: { $in: ['PENDING', 'PAYMENT_FAILED'] },
            })
                .sort({ updatedAt: -1 })
                .exec();
            if (openByShoppingFile) {
                this.logger.log(`Rezervasyon güncelleniyor (shoppingFileId, açık ödeme): ${dtoNorm.shoppingFileId}`);
                return this.runReservationWrite(() => this.updateByDocumentId(openByShoppingFile, dtoNorm, memberId));
            }
        }
        const existing = await this.reservationModel
            .findOne({ bookingCode: dtoNorm.bookingCode })
            .exec();
        if (existing) {
            return this.runReservationWrite(() => this.updateByBookingCode(dtoNorm, memberId, existing));
        }
        try {
            const doc = new this.reservationModel(this.buildReservationDoc(dtoNorm, memberId, null));
            const saved = await this.runReservationWrite(() => doc.save());
            this.logger.log(`Rezervasyon kaydedildi: ${saved.bookingCode} | status: ${saved.status} | memberId: ${memberId ?? 'guest'}`);
            if (saved.status !== 'PAYMENT_FAILED' && saved.status !== 'PENDING') {
                void this.adminNotificationsService.recordNewReservation({
                    bookingCode: saved.bookingCode,
                    reservationId: String(saved._id),
                });
            }
            return saved;
        }
        catch (err) {
            const code = err?.code;
            if (code === 11000 && payId) {
                const byPay = await this.reservationModel
                    .findOne({ 'payment.paymentId': payId })
                    .exec();
                if (byPay) {
                    this.logger.warn(`E11000 sonrası paymentId ile birleştiriliyor: ${payId}`);
                    return this.runReservationWrite(() => this.updateByDocumentId(byPay, dtoNorm, memberId));
                }
            }
            if (code === 11000 &&
                dtoNorm.shoppingFileId &&
                dtoNorm.status &&
                ['PENDING', 'PAYMENT_FAILED'].includes(dtoNorm.status)) {
                const openBySf = await this.reservationModel
                    .findOne({
                    shoppingFileId: dtoNorm.shoppingFileId,
                    status: { $in: ['PENDING', 'PAYMENT_FAILED'] },
                })
                    .sort({ updatedAt: -1 })
                    .exec();
                if (openBySf) {
                    this.logger.warn(`E11000 sonrası shoppingFileId ile birleştiriliyor: ${dtoNorm.shoppingFileId}`);
                    return this.runReservationWrite(() => this.updateByDocumentId(openBySf, dtoNorm, memberId));
                }
            }
            if (code === 11000 && dtoNorm.bookingCode) {
                const again = await this.reservationModel
                    .findOne({ bookingCode: dtoNorm.bookingCode })
                    .exec();
                if (again) {
                    this.logger.warn(`Rezervasyon duplicate key (yarış); güncelleniyor: ${dtoNorm.bookingCode}`);
                    return this.runReservationWrite(() => this.updateByBookingCode(dtoNorm, memberId, again));
                }
            }
            throw err;
        }
    }
    mergePayment(previous, incoming) {
        if (!incoming && !previous)
            return undefined;
        const prev = previous || {};
        const inc = incoming || {};
        return { ...prev, ...inc };
    }
    async updateByDocumentId(existing, dto, memberId) {
        const prevStatus = existing.status;
        const nextStatus = dto.status ?? existing.status ?? 'CONFIRMED';
        const $set = {
            bookingCode: dto.bookingCode,
            reservationNo: dto.bookingCode,
            status: nextStatus,
            type: dto.type ?? existing.type ?? 'flight',
        };
        if (memberId) {
            $set.memberId = this.safeMemberObjectId(memberId);
        }
        if (dto.flight !== undefined)
            $set.flight = dto.flight;
        if (dto.passengers !== undefined)
            $set.passengers = dto.passengers;
        const mergedPay = this.mergePayment(existing.payment, dto.payment);
        if (mergedPay !== undefined)
            $set.payment = mergedPay;
        if (dto.shoppingFileId !== undefined)
            $set.shoppingFileId = dto.shoppingFileId;
        if (dto.totalFare !== undefined)
            $set.totalFare = dto.totalFare;
        if (dto.currency !== undefined)
            $set.currency = dto.currency;
        if (dto.correlationId !== undefined)
            $set.correlationId = dto.correlationId;
        if (dto.failureReason !== undefined)
            $set.failureReason = dto.failureReason;
        if (nextStatus === 'CONFIRMED') {
            $set.failureReason = null;
        }
        const runValidators = nextStatus === 'CONFIRMED';
        let saved;
        try {
            saved = await this.reservationModel
                .findByIdAndUpdate(existing._id, { $set }, { new: true, runValidators })
                .exec();
        }
        catch (err) {
            const code = err?.code;
            if (code === 11000 && dto.bookingCode) {
                const canonical = await this.reservationModel.findOne({ bookingCode: dto.bookingCode }).exec();
                if (canonical && String(canonical._id) !== String(existing._id)) {
                    this.logger.warn(`bookingCode E11000 (findByIdAndUpdate); hedef belgeye merge: ${dto.bookingCode}`);
                    return this.updateByBookingCode(dto, memberId, canonical);
                }
            }
            throw err;
        }
        if (!saved) {
            throw new Error(`Rezervasyon güncellenemedi (paymentId): ${dto.payment?.paymentId}`);
        }
        this.logger.log(`Rezervasyon güncellendi (paymentId): ${saved.bookingCode} | status: ${saved.status}`);
        if (saved.status === 'CONFIRMED' && prevStatus !== 'CONFIRMED') {
            void this.adminNotificationsService.recordNewReservation({
                bookingCode: saved.bookingCode,
                reservationId: String(saved._id),
            });
        }
        return saved;
    }
    buildReservationDoc(dto, memberId, memberIdOverride) {
        const doc = {
            bookingCode: dto.bookingCode,
            reservationNo: dto.bookingCode,
            status: dto.status ?? 'CONFIRMED',
            type: dto.type ?? 'flight',
            memberId: memberIdOverride !== undefined
                ? memberIdOverride
                : this.safeMemberObjectId(memberId),
        };
        if (dto.flight !== undefined)
            doc.flight = dto.flight;
        if (dto.passengers !== undefined)
            doc.passengers = dto.passengers;
        if (dto.payment !== undefined)
            doc.payment = dto.payment;
        if (dto.shoppingFileId !== undefined)
            doc.shoppingFileId = dto.shoppingFileId;
        if (dto.totalFare !== undefined)
            doc.totalFare = dto.totalFare;
        if (dto.currency !== undefined)
            doc.currency = dto.currency;
        if (dto.correlationId !== undefined)
            doc.correlationId = dto.correlationId;
        if (dto.failureReason !== undefined)
            doc.failureReason = dto.failureReason;
        return doc;
    }
    async updateByBookingCode(dto, memberId, existing) {
        const nextStatus = dto.status ?? existing.status ?? 'CONFIRMED';
        const $set = {
            bookingCode: dto.bookingCode,
            reservationNo: dto.bookingCode,
            status: nextStatus,
            type: dto.type ?? existing.type ?? 'flight',
        };
        if (memberId) {
            $set.memberId = this.safeMemberObjectId(memberId);
        }
        if (dto.flight !== undefined)
            $set.flight = dto.flight;
        if (dto.passengers !== undefined)
            $set.passengers = dto.passengers;
        const mergedPay = this.mergePayment(existing.payment, dto.payment);
        if (mergedPay !== undefined)
            $set.payment = mergedPay;
        if (dto.shoppingFileId !== undefined)
            $set.shoppingFileId = dto.shoppingFileId;
        if (dto.totalFare !== undefined)
            $set.totalFare = dto.totalFare;
        if (dto.currency !== undefined)
            $set.currency = dto.currency;
        if (dto.correlationId !== undefined)
            $set.correlationId = dto.correlationId;
        if (dto.failureReason !== undefined)
            $set.failureReason = dto.failureReason;
        if (nextStatus === 'CONFIRMED') {
            $set.failureReason = null;
        }
        const runValidators = nextStatus === 'CONFIRMED';
        const saved = await this.reservationModel
            .findOneAndUpdate({ bookingCode: dto.bookingCode }, { $set }, { new: true, runValidators })
            .exec();
        if (!saved) {
            throw new Error(`Rezervasyon güncellenemedi: ${dto.bookingCode}`);
        }
        this.logger.log(`Rezervasyon güncellendi (aynı bookingCode): ${saved.bookingCode} | status: ${saved.status}`);
        return saved;
    }
    async findByMember(memberId) {
        return this.reservationModel
            .find({ memberId: new mongoose_2.Types.ObjectId(memberId) })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }
    async findByBookingCode(bookingCode) {
        return this.reservationModel.findOne({ bookingCode }).exec();
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = ReservationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reservation_schema_1.Reservation.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof admin_notifications_service_1.AdminNotificationsService !== "undefined" && admin_notifications_service_1.AdminNotificationsService) === "function" ? _b : Object])
], ReservationsService);


/***/ },

/***/ "@nestjs/bullmq"
/*!*********************************!*\
  !*** external "@nestjs/bullmq" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/bullmq");

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

/***/ "@nestjs/throttler"
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
(module) {

module.exports = require("@nestjs/throttler");

/***/ },

/***/ "axios"
/*!************************!*\
  !*** external "axios" ***!
  \************************/
(module) {

module.exports = require("axios");

/***/ },

/***/ "bcrypt"
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
(module) {

module.exports = require("bcrypt");

/***/ },

/***/ "bullmq"
/*!*************************!*\
  !*** external "bullmq" ***!
  \*************************/
(module) {

module.exports = require("bullmq");

/***/ },

/***/ "class-transformer"
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
(module) {

module.exports = require("class-transformer");

/***/ },

/***/ "class-validator"
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
(module) {

module.exports = require("class-validator");

/***/ },

/***/ "crypto"
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
(module) {

module.exports = require("crypto");

/***/ },

/***/ "express"
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
(module) {

module.exports = require("express");

/***/ },

/***/ "fast-xml-parser"
/*!**********************************!*\
  !*** external "fast-xml-parser" ***!
  \**********************************/
(module) {

module.exports = require("fast-xml-parser");

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

/***/ "rxjs"
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
(module) {

module.exports = require("rxjs");

/***/ },

/***/ "rxjs/operators"
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
(module) {

module.exports = require("rxjs/operators");

/***/ },

/***/ "soap"
/*!***********************!*\
  !*** external "soap" ***!
  \***********************/
(module) {

module.exports = require("soap");

/***/ },

/***/ "xlsx"
/*!***********************!*\
  !*** external "xlsx" ***!
  \***********************/
(module) {

module.exports = require("xlsx");

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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const http_exception_filter_1 = __webpack_require__(/*! ./common/filters/http-exception.filter */ "./src/common/filters/http-exception.filter.ts");
const logging_interceptor_1 = __webpack_require__(/*! ./common/interceptors/logging.interceptor */ "./src/common/interceptors/logging.interceptor.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', true);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const localhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
    const envOrigin = process.env.CLIENT_WEB_URL;
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (localhostOrigin.test(origin) || (envOrigin && origin === envOrigin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
    await app.listen(port, '0.0.0.0');
    const { Logger } = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
    new Logger('Bootstrap').log(`Client API is running on port ${port}`);
    if (false) // removed by dead control flow
{}
}
bootstrap();

})();

/******/ })()
;