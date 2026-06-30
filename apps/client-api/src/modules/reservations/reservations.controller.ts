import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { OptionalJwtMemberGuard } from '../auth/guards/optional-jwt-member.guard';
import { JwtMemberGuard } from '../auth/guards/jwt-member.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
  ) {}

  /**
   * Rezervasyon kaydet.
   * Token varsa memberId bağlanır, misafir için null kalır.
   */
  @Post()
  @UseGuards(OptionalJwtMemberGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateReservationDto,
    @Request() req: any,
  ) {
    const memberId: string | null = req.user?.memberId ?? null;
    const reservation = await this.reservationsService.create(dto, memberId ?? undefined);
    return {
      success: true,
      reservationId: (reservation as any)._id?.toString(),
      bookingCode: reservation.bookingCode,
    };
  }

  /**
   * Giriş yapmış üyenin rezervasyonlarını döndürür.
   */
  @Get('mine')
  @UseGuards(JwtMemberGuard)
  async getMyReservations(@Request() req: any) {
    const memberId: string = req.user.memberId;
    const reservations = await this.reservationsService.findByMember(memberId);
    return {
      success: true,
      reservations: reservations.map((r) => ({
        id: (r as any)._id?.toString(),
        bookingCode: r.bookingCode,
        status: r.status,
        type: r.type,
        flight: r.flight,
        flightLegs: r.flightLegs,
        passengers: r.passengers,
        payment: r.payment,
        totalFare: r.totalFare,
        currency: r.currency,
        createdAt: (r as any).createdAt,
      })),
    };
  }
}
