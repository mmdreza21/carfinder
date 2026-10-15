import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { QueryCarDto } from './dto/query-car.dto';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCarDto) { return this.prisma.car.create({ data: dto as any }); }

  async findAll(query: QueryCarDto) {
    const { keyword, brand, model, bodyType, fuelType, yearMin, yearMax, page = 1, limit = 20 } = query;
    const where: any = {};
    if (keyword) where.OR = [
      { fullName: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
      { funFact: { contains: keyword, mode: 'insensitive' } },
    ];
    if (brand) where.brand = { slug: brand };
    if (model) where.model = { slug: model };
    if (bodyType) where.bodyType = bodyType;
    if (fuelType) where.fuelType = fuelType;
    if (yearMin || yearMax) where.year = { ...(yearMin && { gte: yearMin }), ...(yearMax && { lte: yearMax }) };

    const [items, total] = await Promise.all([
      this.prisma.car.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { brand: true, model: true, generation: true },
      }),
      this.prisma.car.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({ where: { id }, include: { brand: true, model: true, generation: true } });
    if (!car) throw new NotFoundException(`Car ${id} not found`);
    return car;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.car.delete({ where: { id } });
  }

  async stats() {
    const [total, brands, models, generations] = await Promise.all([
      this.prisma.car.count(), this.prisma.brand.count(),
      this.prisma.model.count(), this.prisma.generation.count(),
    ]);
    return { total, brands, models, generations };
  }
}
