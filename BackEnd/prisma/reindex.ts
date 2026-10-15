import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';
import { CAR_INDEX, carIndexSettings, carIndexMappings } from '../src/search/car-index.mapping';

const prisma = new PrismaClient();
const es = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

async function main() {
  console.log('Pinging search engine...');
  await es.ping();

  const exists = await es.indices.exists({ index: CAR_INDEX });
  if (exists.body) {
    console.log(`Deleting existing index '${CAR_INDEX}'...`);
    await es.indices.delete({ index: CAR_INDEX });
  }

  console.log(`Creating index '${CAR_INDEX}'...`);
  await es.indices.create({
    index: CAR_INDEX,
    body: {
      settings: carIndexSettings,
      mappings: carIndexMappings,
    },
  });

  const cars = await prisma.car.findMany({
    include: { brand: true, model: true, generation: true },
  });

  console.log(`Indexing ${cars.length} cars...`);

  const BATCH = 500;
  let indexed = 0;

  for (let i = 0; i < cars.length; i += BATCH) {
    const chunk = cars.slice(i, i + BATCH);
    const operations = chunk.flatMap((c) => [
      { index: { _index: CAR_INDEX, _id: c.id } },
      {
        id: c.id,
        fullName: c.fullName,
        brandName: c.brand?.name ?? null,
        modelName: c.model?.name ?? null,
        generationCode: c.generation?.code ?? null,
        trim: c.trim,
        year: c.year,
        bodyType: c.bodyType,
        segment: c.model?.segment ?? null,
        fuelType: c.fuelType,
        transmission: c.transmission,
        drivetrain: c.drivetrain,
        horsepower: c.horsepower,
        torqueNm: c.torqueNm,
        zeroTo100Kmh: c.zeroTo100Kmh,
        topSpeedKph: c.topSpeedKph,
        priceUsd: c.priceUsd,
        mileageKm: c.mileageKm,
        condition: c.condition,
        color: c.color,
        country: c.brand?.country ?? null,
        seats: c.seats,
        doors: c.doors,
        weightKg: c.weightKg,
        imageUrl: c.imageUrl,
        funFact: c.funFact,
        description: c.description,
      },
    ]);

    const res = await es.bulk({ refresh: false, body: operations });
    if ((res.body as any).errors) {
      const bad = (res.body as any).items.filter((it: any) => it.index?.error);
      console.error(`${bad.length} docs failed; sample:`, JSON.stringify(bad.slice(0, 2), null, 2));
    }
    indexed += chunk.length;
    console.log(`  indexed ${indexed}/${cars.length}`);
  }

  await es.indices.refresh({ index: CAR_INDEX });
  const count = await es.count({ index: CAR_INDEX });
  console.log(`Done. Index '${CAR_INDEX}' now has ${count.body.count} documents.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
