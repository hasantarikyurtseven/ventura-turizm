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
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
const email_verification_module_1 = __webpack_require__(/*! ./modules/email-verification/email-verification.module */ "./src/modules/email-verification/email-verification.module.ts");
const reservation_confirmation_module_1 = __webpack_require__(/*! ./modules/reservation-confirmation/reservation-confirmation.module */ "./src/modules/reservation-confirmation/reservation-confirmation.module.ts");
const contact_form_module_1 = __webpack_require__(/*! ./modules/contact-form/contact-form.module */ "./src/modules/contact-form/contact-form.module.ts");
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
            email_verification_module_1.EmailVerificationModule,
            reservation_confirmation_module_1.ReservationConfirmationModule,
            contact_form_module_1.ContactFormModule,
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

/***/ "./src/modules/contact-form/contact-form.module.ts"
/*!*********************************************************!*\
  !*** ./src/modules/contact-form/contact-form.module.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactFormModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const email_module_1 = __webpack_require__(/*! ../email/email.module */ "./src/modules/email/email.module.ts");
const contact_form_processor_1 = __webpack_require__(/*! ./contact-form.processor */ "./src/modules/contact-form/contact-form.processor.ts");
let ContactFormModule = class ContactFormModule {
};
exports.ContactFormModule = ContactFormModule;
exports.ContactFormModule = ContactFormModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: 'contact-form' }),
            email_module_1.EmailModule,
        ],
        providers: [contact_form_processor_1.ContactFormProcessor],
    })
], ContactFormModule);


/***/ },

/***/ "./src/modules/contact-form/contact-form.processor.ts"
/*!************************************************************!*\
  !*** ./src/modules/contact-form/contact-form.processor.ts ***!
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
var ContactFormProcessor_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactFormProcessor = void 0;
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const email_service_1 = __webpack_require__(/*! ../email/email.service */ "./src/modules/email/email.service.ts");
let ContactFormProcessor = ContactFormProcessor_1 = class ContactFormProcessor extends bullmq_1.WorkerHost {
    emailService;
    logger = new common_1.Logger(ContactFormProcessor_1.name);
    constructor(emailService) {
        super();
        this.emailService = emailService;
    }
    async process(job) {
        this.logger.log(`İletişim formu maili işleniyor: ${job.data.email}`);
        await this.emailService.sendContactFormEmails(job.data);
        this.logger.log(`İletişim formu maili tamamlandı: ${job.data.email}`);
    }
};
exports.ContactFormProcessor = ContactFormProcessor;
exports.ContactFormProcessor = ContactFormProcessor = ContactFormProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('contact-form'),
    __metadata("design:paramtypes", [typeof (_a = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _a : Object])
], ContactFormProcessor);


/***/ },

/***/ "./src/modules/email-verification/email-verification.module.ts"
/*!*********************************************************************!*\
  !*** ./src/modules/email-verification/email-verification.module.ts ***!
  \*********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailVerificationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const email_verification_processor_1 = __webpack_require__(/*! ./email-verification.processor */ "./src/modules/email-verification/email-verification.processor.ts");
const email_module_1 = __webpack_require__(/*! ../email/email.module */ "./src/modules/email/email.module.ts");
let EmailVerificationModule = class EmailVerificationModule {
};
exports.EmailVerificationModule = EmailVerificationModule;
exports.EmailVerificationModule = EmailVerificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'email-verification',
            }),
            email_module_1.EmailModule,
        ],
        providers: [email_verification_processor_1.EmailVerificationProcessor],
    })
], EmailVerificationModule);


/***/ },

/***/ "./src/modules/email-verification/email-verification.processor.ts"
/*!************************************************************************!*\
  !*** ./src/modules/email-verification/email-verification.processor.ts ***!
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
var EmailVerificationProcessor_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailVerificationProcessor = void 0;
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const email_service_1 = __webpack_require__(/*! ../email/email.service */ "./src/modules/email/email.service.ts");
let EmailVerificationProcessor = EmailVerificationProcessor_1 = class EmailVerificationProcessor extends bullmq_1.WorkerHost {
    emailService;
    logger = new common_1.Logger(EmailVerificationProcessor_1.name);
    constructor(emailService) {
        super();
        this.emailService = emailService;
    }
    async process(job) {
        const { email, firstName, verificationToken, clientWebUrl } = job.data;
        this.logger.log(`E-posta doğrulama job'u işleniyor: ${email} (jobId: ${job.id})`);
        await this.emailService.sendVerificationEmail(email, firstName, verificationToken, clientWebUrl);
        this.logger.log(`E-posta doğrulama job'u tamamlandı: ${email} (jobId: ${job.id})`);
    }
};
exports.EmailVerificationProcessor = EmailVerificationProcessor;
exports.EmailVerificationProcessor = EmailVerificationProcessor = EmailVerificationProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('email-verification'),
    __metadata("design:paramtypes", [typeof (_a = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _a : Object])
], EmailVerificationProcessor);


/***/ },

/***/ "./src/modules/email/email.module.ts"
/*!*******************************************!*\
  !*** ./src/modules/email/email.module.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/modules/email/email.service.ts");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        providers: [email_service_1.EmailService],
        exports: [email_service_1.EmailService],
    })
], EmailModule);


/***/ },

/***/ "./src/modules/email/email.service.ts"
/*!********************************************!*\
  !*** ./src/modules/email/email.service.ts ***!
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
var EmailService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");
const email_verification_template_1 = __webpack_require__(/*! ./templates/email-verification.template */ "./src/modules/email/templates/email-verification.template.ts");
const reservation_confirmation_template_1 = __webpack_require__(/*! ./templates/reservation-confirmation.template */ "./src/modules/email/templates/reservation-confirmation.template.ts");
const contact_form_template_1 = __webpack_require__(/*! ./templates/contact-form.template */ "./src/modules/email/templates/contact-form.template.ts");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const host = this.configService.get('SMTP_HOST');
        const port = parseInt(this.configService.get('SMTP_PORT', '465'), 10);
        const secure = this.configService.get('SMTP_SECURE', 'ssl');
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: secure === 'ssl' || secure === 'true' || port === 465,
            auth: { user, pass },
            tls: {
                rejectUnauthorized: false,
            },
        });
        this.logger.log(`SMTP transporter oluşturuldu: ${host}:${port}`);
    }
    async sendVerificationEmail(to, firstName, verificationToken, clientWebUrl) {
        const from = this.configService.get('SMTP_FROM', 'noreply@venturaturizm.com');
        const verifyUrl = `${clientWebUrl}/verify-email?token=${verificationToken}`;
        const html = (0, email_verification_template_1.renderEmailVerificationTemplate)({ firstName, verifyUrl });
        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                subject: 'Ventura Turizm – E-posta Adresinizi Doğrulayın',
                html,
            });
            this.logger.log(`Doğrulama e-postası gönderildi: ${to} (messageId: ${info.messageId})`);
        }
        catch (error) {
            this.logger.error(`E-posta gönderilemedi: ${to}`, error?.stack || error);
            throw error;
        }
    }
    async sendReservationConfirmation(to, params) {
        const from = this.configService.get('SMTP_FROM', 'noreply@venturaturizm.com');
        const html = (0, reservation_confirmation_template_1.renderReservationConfirmationTemplate)(params);
        try {
            const info = await this.transporter.sendMail({
                from, to,
                subject: `Ventura Turizm – Rezervasyon Onayı: ${params.bookingCode}`,
                html,
            });
            this.logger.log(`Rezervasyon onay maili gönderildi: ${to} (messageId: ${info.messageId})`);
        }
        catch (error) {
            this.logger.error(`Rezervasyon onay maili gönderilemedi: ${to}`, error?.stack || error);
            throw error;
        }
    }
    async sendContactFormEmails(params) {
        const from = this.configService.get('SMTP_FROM', 'noreply@venturaturizm.com');
        const adminEmail = this.configService.get('CONTACT_ADMIN_EMAIL', from);
        const adminHtml = (0, contact_form_template_1.renderContactFormAdminTemplate)(params);
        const userHtml = (0, contact_form_template_1.renderContactFormUserTemplate)(params);
        try {
            await this.transporter.sendMail({
                from, to: adminEmail,
                subject: `Yeni İletişim Mesajı: ${params.subject}`,
                html: adminHtml,
                replyTo: params.email,
            });
            await this.transporter.sendMail({
                from, to: params.email,
                subject: 'Ventura Turizm – Mesajınız Alındı',
                html: userHtml,
            });
            this.logger.log(`İletişim formu mailleri gönderildi: ${params.email}`);
        }
        catch (error) {
            this.logger.error(`İletişim formu maili gönderilemedi`, error?.stack || error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EmailService);


/***/ },

/***/ "./src/modules/email/templates/base.layout.ts"
/*!****************************************************!*\
  !*** ./src/modules/email/templates/base.layout.ts ***!
  \****************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderBaseLayout = renderBaseLayout;
function renderBaseLayout(params) {
    const year = new Date().getFullYear();
    return `
<!DOCTYPE html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Ventura Turizm</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

    /* Responsive */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-body-inner { padding: 24px 20px !important; }
      .email-header { padding: 24px 20px !important; }
      .email-footer { padding: 20px !important; }
      .cta-button { padding: 12px 28px !important; font-size: 15px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#183641;">

  <!-- Preheader (hidden, for mail client preview) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Ventura Turizm
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f4f7fa;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Email Container -->
        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(24,54,65,0.08);">

          <!-- ============ HEADER ============ -->
          <tr>
            <td class="email-header"
                style="background:linear-gradient(135deg,#183641 0%,#4088b3 100%);padding:32px 40px;text-align:center;">
              <!-- Logo placeholder – text based -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:800;letter-spacing:1px;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
                      VENTURA TURİZM
                    </h1>
                    <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                      Seyahat &bull; Keşfet &bull; Yaşa
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ BODY ============ -->
          <tr>
            <td class="email-body-inner" style="padding:40px;">
              ${params.body}
            </td>
          </tr>

          <!-- ============ FOOTER ============ -->
          <tr>
            <td class="email-footer"
                style="background-color:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              ${params.footerExtra ? `<p style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 12px;">${params.footerExtra}</p>` : ''}
              <p style="color:#94a3b8;font-size:11px;line-height:1.5;margin:0;">
                &copy; ${year} Ventura Turizm A.Ş. Tüm hakları saklıdır.
              </p>
              <p style="color:#cbd5e1;font-size:11px;margin:8px 0 0;">
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email Container -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}


/***/ },

/***/ "./src/modules/email/templates/contact-form.template.ts"
/*!**************************************************************!*\
  !*** ./src/modules/email/templates/contact-form.template.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderContactFormAdminTemplate = renderContactFormAdminTemplate;
exports.renderContactFormUserTemplate = renderContactFormUserTemplate;
const base_layout_1 = __webpack_require__(/*! ./base.layout */ "./src/modules/email/templates/base.layout.ts");
function renderContactFormAdminTemplate(p) {
    const body = `
    <h2 style="color:#183641;font-size:22px;font-weight:700;margin:0 0 8px;">Yeni İletişim Mesajı</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 24px;">Web sitesi iletişim formundan yeni bir mesaj alındı.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>Ad Soyad:</strong> ${p.name}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>E-posta:</strong> ${p.email}</td></tr>
      ${p.phone ? `<tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>Telefon:</strong> ${p.phone}</td></tr>` : ''}
      <tr><td style="padding:6px 0;font-size:14px;color:#183641;"><strong>Konu:</strong> ${p.subject}</td></tr>
    </table>
    <h3 style="color:#183641;font-size:15px;font-weight:600;margin:0 0 10px;">Mesaj:</h3>
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:14px;color:#475569;line-height:1.7;">
      ${p.message.replace(/\n/g, '<br>')}
    </div>
  `;
    return (0, base_layout_1.renderBaseLayout)({ body, footerExtra: 'Bu mesaj Ventura Turizm web sitesi iletişim formundan iletilmiştir.' });
}
function renderContactFormUserTemplate(p) {
    const body = `
    <h2 style="color:#183641;font-size:22px;font-weight:700;margin:0 0 8px;">Mesajınız Alındı!</h2>
    <p style="color:#475569;font-size:15px;margin:0 0 20px;">Merhaba <strong>${p.name}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 20px;">
      İletişim formunu doldurduğunuz için teşekkür ederiz. Mesajınız başarıyla tarafımıza iletildi.
      En kısa sürede size geri dönüş yapacağız.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:4px 0;font-size:13px;color:#64748b;"><strong>Konu:</strong> ${p.subject}</td></tr>
    </table>
    <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
      Sorularınız için <a href="mailto:info@venturaturizm.com" style="color:#4088b3;">info@venturaturizm.com</a>
      adresinden bize ulaşabilirsiniz.
    </p>
  `;
    return (0, base_layout_1.renderBaseLayout)({ body, footerExtra: 'Bu e-posta otomatik olarak gönderilmiştir.' });
}


/***/ },

/***/ "./src/modules/email/templates/email-verification.template.ts"
/*!********************************************************************!*\
  !*** ./src/modules/email/templates/email-verification.template.ts ***!
  \********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderEmailVerificationTemplate = renderEmailVerificationTemplate;
const base_layout_1 = __webpack_require__(/*! ./base.layout */ "./src/modules/email/templates/base.layout.ts");
function renderEmailVerificationTemplate(params) {
    const { firstName, verifyUrl } = params;
    const body = `
    <!-- Greeting -->
    <h2 style="color:#183641;margin:0 0 8px;font-size:22px;font-weight:700;">
      Merhaba ${firstName} 👋
    </h2>
    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
      Ventura Turizm ailesine hoş geldiniz! Hesabınızı aktif hale getirmek ve
      tüm hizmetlerimizden yararlanabilmek için e-posta adresinizi doğrulamanız gerekmektedir.
    </p>

    <!-- Info Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin:0 0 28px;">
      <tr>
        <td style="background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="36" valign="top" style="padding-right:12px;">
                <div style="width:32px;height:32px;background:linear-gradient(135deg,#183641,#4088b3);border-radius:50%;text-align:center;line-height:32px;font-size:16px;">
                  ✉️
                </div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:14px;font-weight:600;margin:0 0 4px;">Doğrulama Gerekli</p>
                <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">
                  Aşağıdaki butona tıklayarak e-posta adresinizi onaylayın. Bu link <strong style="color:#183641;">24 saat</strong> geçerlidir.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:4px 0 32px;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
            href="${verifyUrl}" style="height:50px;v-text-anchor:middle;width:260px;" arcsize="16%"
            strokecolor="#183641" fillcolor="#183641">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">
              E-postamı Doğrula
            </center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${verifyUrl}" class="cta-button"
             style="display:inline-block;background:linear-gradient(135deg,#183641 0%,#2d6a8a 50%,#4088b3 100%);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 44px;border-radius:10px;letter-spacing:0.3px;box-shadow:0 4px 12px rgba(24,54,65,0.25);transition:all 0.2s;">
            ✓ &nbsp;E-postamı Doğrula
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>

    <!-- Fallback URL -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin:0 0 28px;">
      <tr>
        <td style="background-color:#f8fafc;border-radius:8px;padding:16px 20px;border:1px solid #e2e8f0;">
          <p style="color:#64748b;font-size:12px;line-height:1.5;margin:0 0 6px;">
            Buton çalışmıyorsa aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:
          </p>
          <p style="margin:0;word-break:break-all;">
            <a href="${verifyUrl}" style="color:#4088b3;font-size:12px;text-decoration:underline;">${verifyUrl}</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />

    <!-- Benefits Teaser -->
    <p style="color:#183641;font-size:14px;font-weight:600;margin:0 0 12px;">
      Üyelik Avantajlarınız:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:4px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="color:#22c55e;font-size:14px;padding-right:8px;">✓</td>
              <td style="color:#475569;font-size:13px;line-height:1.5;">Özel kampanya ve fırsatlardan ilk siz haberdar olun</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="color:#22c55e;font-size:14px;padding-right:8px;">✓</td>
              <td style="color:#475569;font-size:13px;line-height:1.5;">Hızlı rezervasyon ve kolay ödeme seçenekleri</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="color:#22c55e;font-size:14px;padding-right:8px;">✓</td>
              <td style="color:#475569;font-size:13px;line-height:1.5;">Puan biriktirin ve ödüllere dönüştürün</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Security Notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin:24px 0 0;">
      <tr>
        <td style="background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;">
          <p style="color:#92400e;font-size:12px;line-height:1.5;margin:0;">
            🔒 <strong>Güvenlik notu:</strong> Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz. Hesap, e-posta doğrulanmadan aktif olmayacaktır.
          </p>
        </td>
      </tr>
    </table>
  `;
    return (0, base_layout_1.renderBaseLayout)({
        body,
        footerExtra: 'Sorularınız için <a href="mailto:destek@venturaturizm.com" style="color:#4088b3;text-decoration:underline;">destek@venturaturizm.com</a> adresine yazabilirsiniz.',
    });
}


/***/ },

/***/ "./src/modules/email/templates/reservation-confirmation.template.ts"
/*!**************************************************************************!*\
  !*** ./src/modules/email/templates/reservation-confirmation.template.ts ***!
  \**************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderReservationConfirmationTemplate = renderReservationConfirmationTemplate;
const base_layout_1 = __webpack_require__(/*! ./base.layout */ "./src/modules/email/templates/base.layout.ts");
function paxTypeLabel(type) {
    if (type === 'CHD')
        return 'Çocuk';
    if (type === 'INF')
        return 'Bebek';
    return 'Yetişkin';
}
function formatDate(dateStr) {
    if (!dateStr)
        return '';
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
    if (!m)
        return dateStr;
    return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}
function renderFlightRow(leg, label) {
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:12px;">
      <tr>
        <td style="background-color:#f0f7ff;border:1px solid #bde0ff;border-radius:10px;padding:16px 20px;">

          <!-- Bacak Etiketi -->
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.08em;color:#2d6a8a;">${label}</p>

          <!-- Rota -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <!-- Kalkış -->
              <td valign="top" width="28%">
                <p style="margin:0;font-size:32px;font-weight:900;color:#0f1923;line-height:1;letter-spacing:-0.03em;">
                  ${leg.departure.airportCode}
                </p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#2d6a8a;">${leg.departure.time}</p>
                <p style="margin:2px 0 0;font-size:11px;color:#64748b;">${formatDate(leg.departure.date)}</p>
              </td>

              <!-- Orta -->
              <td valign="middle" align="center" width="44%"
                  style="padding:4px 8px;">
                <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1;">──── ✈ ────</p>
                <p style="margin:4px 0 0;font-size:11px;font-weight:600;color:#183641;">
                  ${leg.airline} &bull; ${leg.flightNumber}
                </p>
                ${leg.duration ? `<p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">${leg.duration}</p>` : ''}
              </td>

              <!-- Varış -->
              <td valign="top" width="28%" align="right">
                <p style="margin:0;font-size:32px;font-weight:900;color:#0f1923;line-height:1;letter-spacing:-0.03em;">
                  ${leg.arrival.airportCode}
                </p>
                <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#2d6a8a;">${leg.arrival.time}</p>
                <p style="margin:2px 0 0;font-size:11px;color:#64748b;">${formatDate(leg.arrival.date)}</p>
              </td>
            </tr>
          </table>

          <!-- Kabin / Bagaj -->
          ${leg.brandName || leg.baggageDescription ? `
          <p style="margin:10px 0 0;font-size:12px;color:#475569;">
            ${leg.brandName ? `<strong style="color:#183641;">${leg.brandName}</strong>` : ''}
            ${leg.baggageDescription ? `&nbsp;&bull;&nbsp;🧳 ${leg.baggageDescription}` : ''}
          </p>
          ` : ''}

        </td>
      </tr>
    </table>
  `;
}
function renderPassengers(passengers) {
    const rows = passengers.map((p, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:600;color:#0f1923;">
        ${i + 1}. ${p.firstName.toUpperCase()} ${p.lastName.toUpperCase()}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;text-align:right;">
        ${paxTypeLabel(p.type)}
      </td>
    </tr>
  `).join('');
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="1"
           style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <th style="background-color:#f8fafc;padding:8px 12px;text-align:left;font-size:11px;
                   text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:600;
                   border-bottom:1px solid #e2e8f0;">
          Yolcu Adı
        </th>
        <th style="background-color:#f8fafc;padding:8px 12px;text-align:right;font-size:11px;
                   text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:600;
                   border-bottom:1px solid #e2e8f0;">
          Tip
        </th>
      </tr>
      ${rows}
    </table>
  `;
}
function renderReservationConfirmationTemplate(params) {
    const { contactName, bookingCode, totalFare, currency, passengers, flight, flightLegs, payment } = params;
    const legs = [];
    if (flightLegs && flightLegs.length > 1) {
        flightLegs.forEach((l, i) => legs.push({ leg: l, label: i === 0 ? '✈ Gidiş' : '✈ Dönüş' }));
    }
    else if (flight) {
        legs.push({ leg: flight, label: '✈ Uçuş' });
    }
    const flightSection = legs.map(({ leg, label }) => renderFlightRow(leg, label)).join('');
    const body = `
    <!-- Başarı İkonu -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,#16a34a,#22c55e);
                      border-radius:50%;text-align:center;line-height:64px;font-size:28px;
                      margin:0 auto 12px;">
            ✓
          </div>
          <h2 style="color:#183641;margin:0 0 6px;font-size:22px;font-weight:800;">
            Rezervasyonunuz Onaylandı!
          </h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0;">
            Merhaba <strong>${contactName}</strong>, biletiniz başarıyla satın alındı.
          </p>
        </td>
      </tr>
    </table>

    <!-- PNR Kutusu -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:28px;">
      <tr>
        <td style="background:linear-gradient(135deg,#183641 0%,#2d6a8a 60%,#4088b3 100%);
                   border-radius:12px;padding:20px 24px;text-align:center;">
          <p style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;
                    letter-spacing:0.12em;margin:0 0 6px;">Rezervasyon Kodu (PNR)</p>
          <p style="color:#ffffff;font-size:36px;font-weight:900;letter-spacing:0.2em;
                    margin:0;font-family:'Courier New',Courier,monospace;">
            ${bookingCode}
          </p>
          ${totalFare ? `
          <p style="color:rgba(255,255,255,0.85);font-size:18px;font-weight:700;margin:10px 0 0;">
            Toplam: ${totalFare.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${currency || 'TRY'}
          </p>
          ` : ''}
        </td>
      </tr>
    </table>

    <!-- Uçuş Bilgileri -->
    <p style="color:#183641;font-size:14px;font-weight:700;margin:0 0 12px;
              text-transform:uppercase;letter-spacing:0.06em;">
      ✈ Uçuş Bilgileri
    </p>
    ${flightSection}

    <!-- Yolcular -->
    <p style="color:#183641;font-size:14px;font-weight:700;margin:0 0 12px;
              text-transform:uppercase;letter-spacing:0.06em;">
      👤 Yolcular (${passengers.length} kişi)
    </p>
    ${renderPassengers(passengers)}

    ${payment?.cardHolder ? `
    <!-- Ödeme Bilgisi -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;">
          <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 10px;
                    text-transform:uppercase;letter-spacing:0.06em;">💳 Ödeme Bilgisi</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${payment.cardHolder ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;width:120px;">Kart Sahibi</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.cardHolder}</td>
            </tr>` : ''}
            ${payment.cardNumber ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">Kart No</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">**** **** **** ${payment.cardNumber.slice(-4)}</td>
            </tr>` : ''}
            ${payment.bankName ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">Banka</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.bankName}</td>
            </tr>` : ''}
            ${payment.installmentCount && payment.installmentCount > 1 ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">Taksit</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.installmentCount} taksit</td>
            </tr>` : ''}
            ${payment.finalizedDate ? `
            <tr>
              <td style="font-size:12px;color:#64748b;padding:3px 0;">İşlem Tarihi</td>
              <td style="font-size:12px;font-weight:600;color:#0f1923;padding:3px 0;">${payment.finalizedDate}</td>
            </tr>` : ''}
          </table>
        </td>
      </tr>
    </table>
    ` : ''}

    <!-- Ayırıcı -->
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />

    <!-- Sonraki Adımlar -->
    <p style="color:#183641;font-size:14px;font-weight:700;margin:0 0 16px;
              text-transform:uppercase;letter-spacing:0.06em;">
      📋 Uçuşunuzdan Önce Yapmanız Gerekenler
    </p>

    <!-- Adım 1 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">1</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  PNR Kodunuzu Kaydedin
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Rezervasyon kodunuz (PNR): <strong style="color:#183641;letter-spacing:0.1em;">${bookingCode}</strong>.
                  Bu kodu uçuşa kadar güvenli bir yerde saklayın; havalimanında check-in ve her türlü işlemde kullanacaksınız.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 2 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">2</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Online Check-in Yapın (Zorunlu)
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Havayolu şirketinin <strong style="color:#183641;">kendi web sitesine</strong> giderek
                  PNR kodunuz ile online check-in işlemini tamamlayın.
                  Online check-in genellikle <strong style="color:#183641;">uçuştan 24–48 saat önce</strong> açılır,
                  kalkıştan <strong style="color:#183641;">1 saat öncesine</strong> kadar yapılabilir.
                  Bu işlemi tamamlamazsanız havalimanında ek ücret veya bekleme süresiyle karşılaşabilirsiniz.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 3 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">3</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Uçuş Bilgilerinizi Teyit Edin
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Kalkış saatleri zaman zaman değişebilir. Uçuş gününden en az
                  <strong style="color:#183641;">24 saat önce</strong> havayolu şirketinin
                  web sitesi veya mobil uygulamasından güncel kalkış saatini kontrol edin.
                  Uçuş numaranızla anlık durum takibi yapabilirsiniz.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 4 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:10px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">4</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Havalimanına Erken Gidin
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Yurt içi uçuşlarda en az <strong style="color:#183641;">1,5 saat</strong>,
                  yurt dışı uçuşlarda en az <strong style="color:#183641;">3 saat</strong>
                  önce havalimanında olmanızı öneririz. Pasaportunuzun veya kimlik kartınızın
                  geçerli olduğundan emin olun.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Adım 5 -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f0f7ff;border-left:4px solid #4088b3;
                   border-radius:0 8px 8px 0;padding:14px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:12px;">
                <div style="width:28px;height:28px;background:#4088b3;border-radius:50%;
                            text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">5</div>
              </td>
              <td valign="top">
                <p style="color:#183641;font-size:13px;font-weight:700;margin:0 0 3px;">
                  Sorun Yaşarsanız Bize Ulaşın
                </p>
                <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;">
                  Değişiklik, iptal veya herhangi bir sorun için
                  <a href="mailto:destek@venturaturizm.com" style="color:#4088b3;text-decoration:underline;">destek@venturaturizm.com</a>
                  adresine e-posta gönderin ya da müşteri hizmetlerimizi arayın.
                  İletişime geçerken PNR kodunuzu hazır bulundurun.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Uyarı Notu -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;">
          <p style="color:#92400e;font-size:12px;line-height:1.7;margin:0;">
            ⚠️ <strong>Önemli Hatırlatma:</strong> Bu e-posta bir rezervasyon onayıdır, uçuş bileti değildir.
            Biniş kartınızı (boarding pass) online check-in sırasında havayolu şirketinin sitesinden alabilirsiniz.
            Elektronik biletiniz (e-ticket) havayolu tarafından ayrıca gönderilecektir.
          </p>
        </td>
      </tr>
    </table>
  `;
    return (0, base_layout_1.renderBaseLayout)({
        body,
        footerExtra: 'Rezervasyonunuzla ilgili sorularınız için <a href="mailto:destek@venturaturizm.com" style="color:#4088b3;text-decoration:underline;">destek@venturaturizm.com</a> adresine yazabilirsiniz.',
    });
}


/***/ },

/***/ "./src/modules/reservation-confirmation/reservation-confirmation.module.ts"
/*!*********************************************************************************!*\
  !*** ./src/modules/reservation-confirmation/reservation-confirmation.module.ts ***!
  \*********************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationConfirmationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const email_module_1 = __webpack_require__(/*! ../email/email.module */ "./src/modules/email/email.module.ts");
const reservation_confirmation_processor_1 = __webpack_require__(/*! ./reservation-confirmation.processor */ "./src/modules/reservation-confirmation/reservation-confirmation.processor.ts");
let ReservationConfirmationModule = class ReservationConfirmationModule {
};
exports.ReservationConfirmationModule = ReservationConfirmationModule;
exports.ReservationConfirmationModule = ReservationConfirmationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: 'reservation-confirmation' }),
            email_module_1.EmailModule,
        ],
        providers: [reservation_confirmation_processor_1.ReservationConfirmationProcessor],
    })
], ReservationConfirmationModule);


/***/ },

/***/ "./src/modules/reservation-confirmation/reservation-confirmation.processor.ts"
/*!************************************************************************************!*\
  !*** ./src/modules/reservation-confirmation/reservation-confirmation.processor.ts ***!
  \************************************************************************************/
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
var ReservationConfirmationProcessor_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationConfirmationProcessor = void 0;
const bullmq_1 = __webpack_require__(/*! @nestjs/bullmq */ "@nestjs/bullmq");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const email_service_1 = __webpack_require__(/*! ../email/email.service */ "./src/modules/email/email.service.ts");
let ReservationConfirmationProcessor = ReservationConfirmationProcessor_1 = class ReservationConfirmationProcessor extends bullmq_1.WorkerHost {
    emailService;
    logger = new common_1.Logger(ReservationConfirmationProcessor_1.name);
    constructor(emailService) {
        super();
        this.emailService = emailService;
    }
    async process(job) {
        const { contactEmail, ...params } = job.data;
        this.logger.log(`Rezervasyon onay maili işleniyor: ${contactEmail} | PNR: ${params.bookingCode} (jobId: ${job.id})`);
        await this.emailService.sendReservationConfirmation(contactEmail, params);
        this.logger.log(`Rezervasyon onay maili tamamlandı: ${contactEmail} | PNR: ${params.bookingCode} (jobId: ${job.id})`);
    }
};
exports.ReservationConfirmationProcessor = ReservationConfirmationProcessor;
exports.ReservationConfirmationProcessor = ReservationConfirmationProcessor = ReservationConfirmationProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('reservation-confirmation'),
    __metadata("design:paramtypes", [typeof (_a = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _a : Object])
], ReservationConfirmationProcessor);


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

/***/ "@nestjs/mongoose"
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
(module) {

module.exports = require("@nestjs/mongoose");

/***/ },

/***/ "mongoose"
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
(module) {

module.exports = require("mongoose");

/***/ },

/***/ "nodemailer"
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
(module) {

module.exports = require("nodemailer");

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
    await app.listen(process.env.PORT ?? 3000);
    if (false) // removed by dead control flow
{}
}
bootstrap();

})();

/******/ })()
;