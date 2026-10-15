export const CAR_INDEX = 'cars';

export const carIndexSettings: any = {
  analysis: {
    analyzer: {
      car_analyzer: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'asciifolding'],
      },
    },
  },
};

export const carIndexMappings: any = {
  properties: {
    id: { type: 'keyword' },
    fullName: { type: 'text', analyzer: 'car_analyzer', fields: { keyword: { type: 'keyword' } } },
    brandName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
    modelName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
    generationCode: { type: 'keyword' },
    trim: { type: 'keyword' },
    year: { type: 'integer' },
    bodyType: { type: 'keyword' },
    segment: { type: 'keyword' },
    fuelType: { type: 'keyword' },
    transmission: { type: 'keyword' },
    drivetrain: { type: 'keyword' },
    horsepower: { type: 'integer' },
    torqueNm: { type: 'integer' },
    zeroTo100Kmh: { type: 'float' },
    topSpeedKph: { type: 'integer' },
    priceUsd: { type: 'integer' },
    mileageKm: { type: 'integer' },
    condition: { type: 'keyword' },
    color: { type: 'keyword' },
    country: { type: 'keyword' },
    seats: { type: 'integer' },
    doors: { type: 'integer' },
    weightKg: { type: 'integer' },
    imageUrl: { type: 'keyword', index: false },
    funFact: { type: 'text' },
    description: { type: 'text' },
  },
};
