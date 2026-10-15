import { Module, Global } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';

export const ELASTICSEARCH_CLIENT = 'ELASTICSEARCH_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: ELASTICSEARCH_CLIENT,
      useFactory: () => {
        return new Client({
          node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        });
      },
    },
  ],
  exports: [ELASTICSEARCH_CLIENT],
})
export class ElasticsearchModule {}
