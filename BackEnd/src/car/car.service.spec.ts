import { Test } from '@nestjs/testing';
import { CarService } from './car.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  car: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  brand: { count: jest.fn() },
  model: { count: jest.fn() },
  generation: { count: jest.fn() },
};

describe('CarService', () => {
  let service: CarService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CarService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get(CarService);
    jest.clearAllMocks();
  });

  it('returns paginated list', async () => {
    mockPrisma.car.findMany.mockResolvedValue([{ id: '1' }]);
    mockPrisma.car.count.mockResolvedValue(1);
    const result = await service.findAll({ page: 1, limit: 20 });
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
  });

  it('throws when car missing', async () => {
    mockPrisma.car.findUnique.mockResolvedValue(null);
    await expect(service.findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns aggregate stats', async () => {
    mockPrisma.car.count.mockResolvedValue(1500);
    mockPrisma.brand.count.mockResolvedValue(15);
    mockPrisma.model.count.mockResolvedValue(73);
    mockPrisma.generation.count.mockResolvedValue(180);
    const stats = await service.stats();
    expect(stats).toEqual({ total: 1500, brands: 15, models: 73, generations: 180 });
  });
});
