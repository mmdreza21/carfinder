import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { ELASTICSEARCH_CLIENT } from '../elasticsearch/elasticsearch.module';
import { CAR_INDEX } from './car-index.mapping';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(@Inject(ELASTICSEARCH_CLIENT) private readonly es: Client) {}

  async search(query: SearchQueryDto) {
    const { keyword, brand, model, generation, bodyType, fuelType, country,
      yearMin, yearMax, priceMin, priceMax, hpMin,
      sortBy, sortDir, page = 1, limit = 20 } = query;

    const must: any[] = [];
    const filter: any[] = [];

    if (keyword) must.push({ multi_match: { query: keyword, fields: ['fullName^3','brandName^2','modelName^2','description','funFact'], type: 'bool_prefix' } });
    if (brand)      filter.push({ match: { brandName: brand } });
    if (model)      filter.push({ match: { modelName: model } });
    if (generation) filter.push({ term:  { generationCode: generation } });
    if (bodyType)   filter.push({ term:  { bodyType } });
    if (fuelType)   filter.push({ term:  { fuelType } });
    if (country)    filter.push({ term:  { country } });
    if (yearMin || yearMax)   filter.push({ range: { year:     { ...(yearMin && { gte: yearMin }), ...(yearMax && { lte: yearMax }) } } });
    if (priceMin || priceMax) filter.push({ range: { priceUsd: { ...(priceMin && { gte: priceMin }), ...(priceMax && { lte: priceMax }) } } });
    if (hpMin)                filter.push({ range: { horsepower: { gte: hpMin } } });

    const esQuery = must.length || filter.length ? { bool: { must, filter } } : { match_all: {} };

    const res = await this.es.search({
      index: CAR_INDEX,
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: esQuery,
        ...(sortBy ? { sort: [{ [sortBy]: { order: sortDir ?? 'asc' } }] } : {}),
      },
    });

    const body: any = res.body;
    const items = body.hits.hits.map((h: any) => h._source);
    const total = typeof body.hits.total === 'number' ? body.hits.total : (body.hits.total?.value ?? 0);
    return { items, total, page, limit };
  }

  async suggest(q: string) {
    if (!q) return [];
    const res = await this.es.search({
      index: CAR_INDEX,
      body: {
        size: 10,
        _source: ['id','fullName','brandName','modelName','year'],
        query: { multi_match: { query: q, fields: ['fullName^3','brandName^2','modelName^2'], type: 'bool_prefix' } },
      },
    });
    return (res.body as any).hits.hits.map((h: any) => h._source);
  }
}
