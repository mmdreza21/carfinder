import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  @ApiOperation({
    summary: 'Search LinkedIn profiles',
    description:
      'Keyword search over name/job title/company/summary/skills, with optional exact filters on skill and job title. Backed by Elasticsearch.',
  })
  @ApiOkResponse({
    description: 'Paginated list of matching profiles',
    schema: {
      example: {
        items: [{ id: 'abc123', fullName: 'Joseph Holland', jobTitle: 'Recruiting Manager' }],
        total: 42,
        page: 1,
        limit: 20,
      },
    },
  })
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }
}