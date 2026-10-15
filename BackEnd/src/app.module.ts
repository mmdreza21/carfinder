import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [CarModule, ElasticsearchModule, SearchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
