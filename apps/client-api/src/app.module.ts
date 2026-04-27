import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BiletbankModule } from './modules/biletbank/biletbank.module';
import { AirportsModule } from './modules/airports/airports.module';
import { AirlinesModule } from './modules/airlines/airlines.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'redis'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,   // 1 dakika
        limit: 10,    // IP başına 10 istek
      },
      {
        name: 'long',
        ttl: 3600000,  // 1 saat
        limit: 100,    // IP başına 100 istek
      },
    ]),
    BiletbankModule,
    AirportsModule,
    AirlinesModule,
    ContractsModule,
    AuthModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) { }

  onModuleInit() {
    this.connection.on('connected', () => {
      this.logger.log('✅ MongoDB connected successfully');
    });
    if (this.connection.readyState === 1) {
      this.logger.log('✅ MongoDB already connected');
    }
  }
}
