import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtMemberGuard } from '../auth/guards/jwt-member.guard';
import { SavedPassengersService } from './saved-passengers.service';
import { CreateSavedPassengerDto, UpdateSavedPassengerDto } from './dto/saved-passenger.dto';

@Controller('saved-passengers')
@UseGuards(JwtMemberGuard)
export class SavedPassengersController {
  constructor(private readonly service: SavedPassengersService) {}

  @Get()
  async findAll(@Req() req: any) {
    const list = await this.service.findAll(req.user.memberId);
    return { success: true, passengers: list };
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateSavedPassengerDto) {
    const doc = await this.service.create(req.user.memberId, dto);
    return { success: true, passenger: doc };
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSavedPassengerDto,
  ) {
    const doc = await this.service.update(req.user.memberId, id, dto);
    return { success: true, passenger: doc };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.service.remove(req.user.memberId, id);
  }
}
