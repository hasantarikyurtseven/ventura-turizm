import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedPassenger, SavedPassengerSchema } from './schemas/saved-passenger.schema';
import { SavedPassengersService } from './saved-passengers.service';
import { SavedPassengersController } from './saved-passengers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedPassenger.name, schema: SavedPassengerSchema },
    ]),
  ],
  controllers: [SavedPassengersController],
  providers: [SavedPassengersService],
})
export class SavedPassengersModule {}
