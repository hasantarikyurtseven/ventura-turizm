import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    emailVerified?: string,
  ): Promise<{ data: Partial<Member>[]; total: number }> {
    const filter: any = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (emailVerified === 'true') {
      filter.emailVerified = true;
    } else if (emailVerified === 'false') {
      filter.emailVerified = false;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.memberModel
        .find(filter)
        .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.memberModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<Partial<Member>> {
    const member = await this.memberModel
      .findById(id)
      .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
      .lean()
      .exec();

    if (!member) {
      throw new NotFoundException('Müşteri bulunamadı');
    }

    return member;
  }

  async updateStatus(id: string, status: string): Promise<Partial<Member>> {
    const member = await this.memberModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
      .lean()
      .exec();

    if (!member) {
      throw new NotFoundException('Müşteri bulunamadı');
    }

    return member;
  }

  /** Kontrol paneli: en son kayıt olan müşteriler (yeniden eskiye) */
  async findRecent(limit = 8): Promise<Partial<Member>[]> {
    const n = Math.min(Math.max(Number(limit) || 8, 1), 50);
    return this.memberModel
      .find()
      .select('-passwordHash -verificationToken -verificationTokenExpiresAt')
      .sort({ createdAt: -1 })
      .limit(n)
      .lean()
      .exec();
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    suspended: number;
  }> {
    const [total, active, pending, suspended] = await Promise.all([
      this.memberModel.countDocuments().exec(),
      this.memberModel.countDocuments({ status: 'active' }).exec(),
      this.memberModel.countDocuments({ status: 'pending' }).exec(),
      this.memberModel.countDocuments({ status: 'suspended' }).exec(),
    ]);

    return { total, active, pending, suspended };
  }
}
