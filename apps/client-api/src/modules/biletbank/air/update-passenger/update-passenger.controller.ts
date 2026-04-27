import { Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UpdatePassengerRequestDto } from '../../dto/update-passenger-request.dto';
import { BiletbankUpdatePassengerService } from './update-passenger.service';

@Controller('biletbank')
export class BiletbankUpdatePassengerController {
  constructor(
    private readonly updatePassengerService: BiletbankUpdatePassengerService,
  ) {}

  @Post('update-passengers')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async updatePassengers(@Body() body: UpdatePassengerRequestDto) {
    return await this.updatePassengerService.updatePassengers(body);
  }
}
