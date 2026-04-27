import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Airport, AirportSchema } from './airports.schema';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { AirportsQueryController } from './airports.query.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Airport.name, schema: AirportSchema },
    ]),
  ],
  providers: [AirportsService],
  controllers: [AirportsController, AirportsQueryController],
})
export class AirportsModule {}

