import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { QueryCarDto } from './dto/query-car.dto';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a car' })
  create(@Body() dto: CreateCarDto) { return this.carService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'List cars (Postgres, no Elasticsearch)' })
  findAll(@Query() query: QueryCarDto) { return this.carService.findAll(query); }

  @Get('stats')
  @ApiOperation({ summary: 'Aggregate counts' })
  stats() { return this.carService.stats(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  findOne(@Param('id') id: string) { return this.carService.findOne(id); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car' })
  remove(@Param('id') id: string) { return this.carService.remove(id); }
}
