import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Full-text search for cars (Elasticsearch)' })
  search(@Query() query: SearchQueryDto) { return this.searchService.search(query); }

  @Get('suggest')
  @ApiOperation({ summary: 'Autocomplete suggestions' })
  suggest(@Query('q') q: string) { return this.searchService.suggest(q); }
}
