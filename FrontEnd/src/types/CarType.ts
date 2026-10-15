export interface Car {
  id: string;
  fullName: string;
  brandName: string | null;
  modelName: string | null;
  generationCode: string | null;
  trim: string | null;
  year: number;
  bodyType: string | null;
  segment: string | null;
  fuelType: string | null;
  transmission: string | null;
  drivetrain: string | null;
  horsepower: number | null;
  torqueNm: number | null;
  zeroTo100Kmh: number | null;
  topSpeedKph: number | null;
  priceUsd: number | null;
  mileageKm: number | null;
  condition: string | null;
  color: string | null;
  country: string | null;
  seats: number | null;
  doors: number | null;
  weightKg: number | null;
  imageUrl: string | null;
  imageUrls?: string[];
  funFact: string | null;
  description: string | null;
  // Postgres-only fields (populated by /api/car)
  brandId?: string;
  modelId?: string;
  generationId?: string | null;
  engineType?: string | null;
  engineDisplacementL?: number | null;
  cylinders?: number | null;
  priceEur?: number | null;
  rangeKm?: number | null;
  fuelConsumptionL100km?: number | null;
  co2Gkm?: number | null;
  vin?: string | null;
}

export interface CarSearchResult {
  items: Car[];
  total: number;
  page: number;
  limit: number;
}

export interface CarSearchParams {
  keyword?: string;
  brand?: string;
  model?: string;
  generation?: string;
  bodyType?: string;
  fuelType?: string;
  country?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  hpMin?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CarStats {
  total: number;
  brands: number;
  models: number;
  generations: number;
}
