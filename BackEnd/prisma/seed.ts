import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { BRANDS } from './seed-data/brands';
import { MODELS } from './seed-data/models';
import { GENERATIONS } from './seed-data/generations';

const prisma = new PrismaClient();

// Load pre-fetched Wikipedia images (run `yarn images:fetch` first)
const imagesPath = path.join(__dirname, 'seed-data', 'car-images.json');
const carImages: Record<string, string[]> = fs.existsSync(imagesPath)
  ? JSON.parse(fs.readFileSync(imagesPath, 'utf-8'))
  : {};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
const pick = <T,>(a: T[], s: number): T => a[s % a.length];
const rnd = (s: number, min: number, max: number) => min + (s % (max - min + 1));
const round1 = (n: number) => Math.round(n * 10) / 10;

const COLORS = ["Black","White","Silver","Gray","Blue","Red","Green","Yellow","Orange","Brown","Beige"];
const TRIMS = ["Base","Sport","Premium","Luxury","Performance","S Line","M Sport","AMG Line","S","R Line","Titanium","Limited"];
const TRANSMISSIONS = ["6-speed manual","7-speed DCT","8-speed automatic","9-speed automatic","10-speed automatic","Single-speed (EV)","6-speed automatic"];
const DRIVETRAINS = ["RWD","FWD","AWD","4WD"];

// Returns [heroUrl, ...gallery] — 3 to 6 unique images per car, rotated
// through the model's image pool so every car looks distinct.
function carImageSet(
  brandSlug: string, modelSlug: string, brandName: string, modelName: string, seed: number,
): { hero: string; all: string[] } {
  const key = `${brandSlug}/${modelSlug}`;
  const pool = carImages[key];
  if (pool && pool.length > 0) {
    const count = Math.min(3 + (seed % 4), pool.length);   // 3..6 images
    const start = seed % pool.length;
    const picked: string[] = [];
    for (let i = 0; i < count; i++) picked.push(pool[(start + i) % pool.length]);
    return { hero: picked[0], all: picked };
  }
  const q = encodeURIComponent(`${brandName},${modelName},car`);
  const hero = `https://loremflickr.com/800/600/${q}?lock=${seed}`;
  return { hero, all: [hero] };
}

interface Spec {
  engineType: string; engineDisplacementL: number | null; cylinders: number | null;
  fuelType: string; horsepower: number; torqueNm: number;
  transmission: string; drivetrain: string;
  zeroTo100Kmh: number; topSpeedKph: number;
  lengthMm: number; widthMm: number; heightMm: number; wheelbaseMm: number; weightKg: number;
  fuelConsumptionL100km: number | null; co2Gkm: number | null; rangeKm: number | null;
  doors: number; seats: number; priceUsd: number; priceEur: number;
  mileageKm: number; condition: string; color: string;
}

function buildSpec(seed: number, segment: string, bodyType: string, fuelOverride?: string): Spec {
  const isEV = fuelOverride === "Electric" || segment === "Electric";
  const isSupercar = segment === "Supercar" || segment === "Hypercar";
  const isSports = segment === "Sports" || segment === "Muscle";
  const isLuxury = segment === "Luxury";

  const fuelType = fuelOverride ?? (isEV ? "Electric" : pick(["Gasoline","Diesel","Hybrid"], seed + 1));
  const cylinders = isEV ? null : isSupercar ? pick([8, 10, 12], seed) : isSports ? pick([6, 8], seed) : pick([4, 6], seed);
  const displacement = isEV ? null : cylinders === 4 ? round1(1.4 + (seed % 8) / 10) : cylinders === 6 ? round1(2.5 + (seed % 10) / 10) : cylinders === 8 ? round1(4.0 + (seed % 20) / 10) : cylinders === 10 ? 5.2 : 6.5;

  let hp: number;
  if (isEV) hp = segment === "Electric" && seed % 3 === 0 ? rnd(seed, 500, 1020) : rnd(seed, 200, 650);
  else if (isSupercar) hp = rnd(seed, 550, 830);
  else if (isSports) hp = rnd(seed, 350, 650);
  else if (isLuxury) hp = rnd(seed, 280, 630);
  else hp = rnd(seed + 7, 110, 400);

  const torque = Math.round(hp * (isEV ? 1.4 : 1.2));
  const zeroTo100 = isEV ? round1(3 + (seed % 40) / 10) : isSupercar ? round1(2.6 + (seed % 15) / 10) : isSports ? round1(3.8 + (seed % 25) / 10) : round1(5.5 + (seed % 50) / 10);
  const topSpeed = isSupercar ? rnd(seed, 300, 355) : isSports ? rnd(seed, 250, 300) : isEV ? rnd(seed, 160, 260) : rnd(seed, 180, 250);

  const isSUV = bodyType === "SUV" || bodyType === "Pickup";
  const isCompact = segment === "Compact" || bodyType === "Hatchback";
  const L = isSUV ? rnd(seed, 4500, 5200) : isCompact ? rnd(seed, 4000, 4400) : rnd(seed, 4400, 5100);
  const W = isSUV ? rnd(seed + 1, 1850, 2050) : isCompact ? rnd(seed + 1, 1750, 1850) : rnd(seed + 1, 1800, 1950);
  const H = isSUV ? rnd(seed + 2, 1650, 1850) : isSupercar ? rnd(seed + 2, 1180, 1280) : isCompact ? rnd(seed + 2, 1440, 1520) : rnd(seed + 2, 1420, 1520);
  const wheelbase = L - rnd(seed + 3, 700, 900);
  const weight = isEV ? rnd(seed + 4, 1700, 2400) : isSUV ? rnd(seed + 4, 1800, 2500) : isSupercar ? rnd(seed + 4, 1300, 1600) : isCompact ? rnd(seed + 4, 1200, 1450) : rnd(seed + 4, 1400, 1800);

  let basePrice: number;
  if (segment === "Hypercar") basePrice = rnd(seed, 2_000_000, 3_500_000);
  else if (segment === "Supercar") basePrice = rnd(seed, 220_000, 550_000);
  else if (segment === "Luxury") basePrice = rnd(seed, 75_000, 160_000);
  else if (segment === "Electric") basePrice = rnd(seed, 40_000, 120_000);
  else if (segment === "Sports") basePrice = rnd(seed, 55_000, 130_000);
  else if (segment === "Muscle") basePrice = rnd(seed, 35_000, 80_000);
  else if (segment === "Full-size") basePrice = rnd(seed, 45_000, 85_000);
  else if (segment === "Mid-size") basePrice = rnd(seed, 30_000, 55_000);
  else basePrice = rnd(seed, 22_000, 40_000);

  const mileage = rnd(seed + 6, 0, 220_000);
  const condition = mileage < 1_000 ? "New" : mileage < 60_000 ? "Excellent" : mileage < 150_000 ? "Good" : "Fair";

  return {
    engineType: isEV ? "Permanent Magnet Synchronous Motor" : `${cylinders}-cylinder ${pick(["Turbocharged","Naturally Aspirated","Twin-Turbo","Supercharged"], seed)}`,
    engineDisplacementL: displacement,
    cylinders,
    fuelType,
    horsepower: hp,
    torqueNm: torque,
    transmission: isEV ? "Single-speed (EV)" : pick(TRANSMISSIONS.slice(0, 5), seed),
    drivetrain: pick(DRIVETRAINS, seed + 2),
    zeroTo100Kmh: zeroTo100,
    topSpeedKph: topSpeed,
    lengthMm: L, widthMm: W, heightMm: H, wheelbaseMm: wheelbase, weightKg: weight,
    fuelConsumptionL100km: isEV ? null : round1(4 + (seed % 130) / 10),
    co2Gkm: isEV ? 0 : rnd(seed + 7, 95, 320),
    rangeKm: isEV ? rnd(seed + 8, 250, 650) : null,
    doors: bodyType === "Coupe" || bodyType === "Convertible" ? 2 : bodyType === "Pickup" ? 4 : isCompact ? 5 : 4,
    seats: bodyType === "Coupe" ? 4 : bodyType === "Pickup" ? 5 : 5,
    priceUsd: basePrice, priceEur: Math.round(basePrice * 0.92),
    mileageKm: mileage, condition, color: pick(COLORS, seed + 3),
  };
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.car.deleteMany();
  await prisma.generation.deleteMany();
  await prisma.model.deleteMany();
  await prisma.brand.deleteMany();

  console.log(`Seeding ${BRANDS.length} brands...`);
  const brandIdBySlug: Record<string, string> = {};
  for (const b of BRANDS) {
    const created = await prisma.brand.create({ data: { ...b, logoUrl: `https://logo.clearbit.com/${b.slug}.com` } });
    brandIdBySlug[b.slug] = created.id;
  }

  console.log(`Seeding ${MODELS.length} models...`);
  const modelIdByKey: Record<string, { id: string; brandSlug: string; name: string; slug: string; bodyType: string; segment: string }> = {};
  for (const [brandSlug, name, slug, bodyType, segment] of MODELS) {
    const created = await prisma.model.create({
      data: { name, slug, bodyType, segment, brandId: brandIdBySlug[brandSlug] },
    });
    modelIdByKey[`${brandSlug}/${slug}`] = { id: created.id, brandSlug, name, slug, bodyType, segment };
  }

  let genCount = 0;
  let carCount = 0;
  let imageHit = 0;

  for (const [key, gens] of Object.entries(GENERATIONS)) {
    const model = modelIdByKey[key];
    if (!model) continue;
    const brandName = BRANDS.find((b) => b.slug === model.brandSlug)!.name;

    for (const [code, yearFrom, yearToNullable, funFact] of gens) {
      const yearTo = yearToNullable ?? 2024;
      const created = await prisma.generation.create({
        data: {
          name: `${model.name} ${code}`, code,
          yearFrom, yearTo: yearToNullable, platform: code,
          description: `${model.name} generation ${code} (${yearFrom}${yearToNullable ? `–${yearToNullable}` : "–present"}).`,
          funFact, modelId: model.id,
        },
      });
      genCount++;

      const span = yearTo - yearFrom + 1;
      const stride = Math.max(1, Math.floor(span / 4));
      const sampledYears: number[] = [];
      for (let y = yearFrom; y <= yearTo && sampledYears.length < 5; y += stride) sampledYears.push(y);
      if (!sampledYears.includes(yearTo) && yearTo <= 2024) sampledYears.push(yearTo);

      for (const year of sampledYears) {
        const trimCount = 1 + (hash(`${key}-${year}`) % 2);
        for (let t = 0; t < trimCount; t++) {
          const seed = hash(`${key}-${code}-${year}-${t}`);
          const fuelOverride = model.segment === "Electric" ? "Electric" : undefined;
          const spec = buildSpec(seed, model.segment, model.bodyType, fuelOverride);
          const trim = pick(TRIMS, seed + t);
          const fullName = `${brandName} ${model.name} ${code} ${trim}`;
          const imgs = carImageSet(model.brandSlug, model.slug, brandName, model.name, seed);
          if (carImages[`${model.brandSlug}/${model.slug}`]?.length) imageHit++;
          await prisma.car.create({
            data: {
              brandId: brandIdBySlug[model.brandSlug],
              modelId: model.id,
              generationId: created.id,
              fullName, year, trim,
              bodyType: model.bodyType, doors: spec.doors, seats: spec.seats,
              engineType: spec.engineType, engineDisplacementL: spec.engineDisplacementL,
              cylinders: spec.cylinders, fuelType: spec.fuelType,
              horsepower: spec.horsepower, torqueNm: spec.torqueNm,
              transmission: spec.transmission, drivetrain: spec.drivetrain,
              zeroTo100Kmh: spec.zeroTo100Kmh, topSpeedKph: spec.topSpeedKph,
              lengthMm: spec.lengthMm, widthMm: spec.widthMm, heightMm: spec.heightMm,
              wheelbaseMm: spec.wheelbaseMm, weightKg: spec.weightKg,
              fuelConsumptionL100km: spec.fuelConsumptionL100km, co2Gkm: spec.co2Gkm, rangeKm: spec.rangeKm,
              priceUsd: spec.priceUsd, priceEur: spec.priceEur,
              mileageKm: spec.mileageKm, condition: spec.condition, color: spec.color,
              vin: `VIN${seed.toString(36).toUpperCase().padStart(8, "0")}${carCount}`,
              imageUrl: imgs.hero,
              imageUrls: imgs.all,
              funFact: funFact ?? null,
              description: `${fullName} — ${spec.horsepower} hp ${spec.fuelType.toLowerCase()} ${model.bodyType.toLowerCase()} from ${year}.`,
            },
          });
          carCount++;
        }
      }
    }
  }

  console.log(`Seeded ${BRANDS.length} brands, ${MODELS.length} models, ${genCount} generations, ${carCount} cars.`);
  console.log(`Cars with real Wikipedia images: ${imageHit}/${carCount}.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
