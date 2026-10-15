import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { QueryPersonDto } from './dto/query-person.dto';

@ApiTags('person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  @Post()
  @ApiOperation({ summary: 'Create a person record' })
  @ApiCreatedResponse({ description: 'The created person' })
  create(@Body() dto: CreatePersonDto) {
    return this.personService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List people (plain Postgres listing, no Elasticsearch)',
    description:
      'Basic paginated listing with simple keyword/skill/jobTitle filters, queried directly against Postgres. For the full-text search feature backed by Elasticsearch, use GET /search instead.',
  })
  @ApiOkResponse({
    description: 'Paginated list of people',
    schema: {
      example: {
        items: [{ id: 'abc123', fullName: 'Joseph Holland', jobTitle: 'Recruiting Manager' }],
        total: 42,
        page: 1,
        limit: 20,
      },
    },
  })
  findAll(@Query() query: QueryPersonDto) {
    return this.personService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single person by ID' })
  @ApiParam({ name: 'id', description: 'Person ID (cuid)' })
  @ApiOkResponse({ description: 'The matching person' })
  @ApiNotFoundResponse({ description: 'No person found with that ID' })
  findOne(@Param('id') id: string) {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a person by ID' })
  @ApiParam({ name: 'id', description: 'Person ID (cuid)' })
  @ApiOkResponse({ description: 'The updated person' })
  @ApiNotFoundResponse({ description: 'No person found with that ID' })
  update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.personService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a person by ID' })
  @ApiParam({ name: 'id', description: 'Person ID (cuid)' })
  @ApiOkResponse({ description: 'The deleted person' })
  @ApiNotFoundResponse({ description: 'No person found with that ID' })
  remove(@Param('id') id: string) {
    return this.personService.remove(id);
  }
}