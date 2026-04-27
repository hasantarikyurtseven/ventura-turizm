import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AirlinesService } from './airlines.service';
import { AirlinesController } from './airlines.controller';
import { Airline, AirlineSchema } from './schemas/airline.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Airline.name, schema: AirlineSchema }])],
    controllers: [AirlinesController],
    providers: [AirlinesService],
    exports: [AirlinesService],
})
export class AirlinesModule {}
