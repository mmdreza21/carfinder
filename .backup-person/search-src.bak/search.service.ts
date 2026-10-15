import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_CLIENT } from '../elasticsearch/elasticsearch.module';
import { PERSON_INDEX } from './person-index.mapping';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(@Inject(ELASTICSEARCH_CLIENT) private readonly es: Client) { }

  async search(query: SearchQueryDto) {
    const { keyword, skill, jobTitle, page = 1, limit = 20 } = query;

    const must: any[] = [];
    const filter: any[] = [];

    if (keyword) {
      must.push({
        multi_match: {
          query: keyword,
        },
      });
    }

    if (skill) {
      filter.push({ term: { skills: skill.toLowerCase() } });
    }

    if (jobTitle) {
      filter.push({ match: { jobTitle } });
    }

    const esQuery =
      must.length || filter.length
        ? { bool: { must, filter } }
        : { match_all: {} };

    const result = await this.es.search({
      index: PERSON_INDEX,
      from: (page - 1) * limit,
      size: limit,
      query: esQuery,
    });

    const hits = result.hits.hits.map((h) => h._source);
    const total =
      typeof result.hits.total === 'number'
        ? result.hits.total
        : (result.hits.total?.value ?? 0);

    return { items: hits, total, page, limit };
  }
}