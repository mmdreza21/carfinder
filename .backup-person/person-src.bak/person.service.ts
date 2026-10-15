import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { QueryPersonDto } from './dto/query-person.dto';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) { }

  create(dto: CreatePersonDto) {
    return this.prisma.person.create({ data: dto });
  }

  // Simple Postgres-based listing (fallback / non-ES path)
  async findAll(query: QueryPersonDto) {
    const { keyword, skill, jobTitle, page = 1, limit = 20 } = query;

    const where: any = {};
    if (keyword) {
      where.OR = [
        { fullName: { contains: keyword, mode: 'insensitive' } },
        { summary: { contains: keyword, mode: 'insensitive' } },
        { jobTitle: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (skill) where.skills = { has: skill };
    if (jobTitle) where.jobTitle = { contains: jobTitle, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.person.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.person.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const person = await this.prisma.person.findUnique({ where: { id } });
    if (!person) throw new NotFoundException(`Person ${id} not found`);
    return person;
  }

  async update(id: string, dto: UpdatePersonDto) {
    await this.findOne(id);
    return this.prisma.person.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.person.delete({ where: { id } });
  }
}