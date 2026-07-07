import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SavedPassenger } from './schemas/saved-passenger.schema';
import { CreateSavedPassengerDto, UpdateSavedPassengerDto } from './dto/saved-passenger.dto';

const MAX_SAVED_PASSENGERS = 20;

@Injectable()
export class SavedPassengersService {
  constructor(
    @InjectModel(SavedPassenger.name)
    private readonly model: Model<SavedPassenger>,
  ) {}

  async findAll(memberId: string): Promise<SavedPassenger[]> {
    return this.model
      .find({ memberId: new Types.ObjectId(memberId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec() as any;
  }

  async create(memberId: string, dto: CreateSavedPassengerDto): Promise<SavedPassenger> {
    const count = await this.model.countDocuments({ memberId: new Types.ObjectId(memberId) });
    if (count >= MAX_SAVED_PASSENGERS) {
      throw new BadRequestException(
        `En fazla ${MAX_SAVED_PASSENGERS} kayıtlı yolcu ekleyebilirsiniz.`,
      );
    }

    const doc = new this.model({
      memberId: new Types.ObjectId(memberId),
      label: dto.label?.trim() || '',
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      birthDate: dto.birthDate,
      gender: dto.gender,
      nationality: dto.nationality.toUpperCase(),
      paxType: dto.paxType,
      tcNo: dto.tcNo?.trim() || '',
      passportNumber: dto.passportNumber?.trim() || '',
      passportExpiry: dto.passportExpiry || '',
      email: dto.email?.trim() || '',
      phone: dto.phone?.trim() || '',
    });

    return doc.save() as any;
  }

  async update(
    memberId: string,
    id: string,
    dto: UpdateSavedPassengerDto,
  ): Promise<SavedPassenger> {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('Kayıtlı yolcu bulunamadı.');
    if (doc.memberId.toString() !== memberId) throw new ForbiddenException();

    Object.assign(doc, {
      label: dto.label?.trim() ?? doc.label,
      firstName: dto.firstName?.trim() ?? doc.firstName,
      lastName: dto.lastName?.trim() ?? doc.lastName,
      birthDate: dto.birthDate ?? doc.birthDate,
      gender: dto.gender ?? doc.gender,
      nationality: (dto.nationality?.toUpperCase()) ?? doc.nationality,
      paxType: dto.paxType ?? doc.paxType,
      tcNo: dto.tcNo?.trim() ?? doc.tcNo,
      passportNumber: dto.passportNumber?.trim() ?? doc.passportNumber,
      passportExpiry: dto.passportExpiry ?? doc.passportExpiry,
      email: dto.email?.trim() ?? doc.email,
      phone: dto.phone?.trim() ?? doc.phone,
    });

    return doc.save() as any;
  }

  async remove(memberId: string, id: string): Promise<void> {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('Kayıtlı yolcu bulunamadı.');
    if (doc.memberId.toString() !== memberId) throw new ForbiddenException();
    await doc.deleteOne();
  }
}
