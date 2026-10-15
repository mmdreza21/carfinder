export interface BrandSeed {
  name: string; slug: string; country: string;
  foundedYear: number; headquarters: string; description: string;
}
export const BRANDS: BrandSeed[] = [
  { name: "BMW", slug: "bmw", country: "Germany", foundedYear: 1916, headquarters: "Munich, Germany", description: "Bayerische Motoren Werke — sheer driving pleasure." },
  { name: "Mercedes-Benz", slug: "mercedes-benz", country: "Germany", foundedYear: 1926, headquarters: "Stuttgart, Germany", description: "The best or nothing." },
  { name: "Audi", slug: "audi", country: "Germany", foundedYear: 1909, headquarters: "Ingolstadt, Germany", description: "Vorsprung durch Technik." },
  { name: "Porsche", slug: "porsche", country: "Germany", foundedYear: 1931, headquarters: "Stuttgart, Germany", description: "There is no substitute." },
  { name: "Volkswagen", slug: "volkswagen", country: "Germany", foundedYear: 1937, headquarters: "Wolfsburg, Germany", description: "Das Auto." },
  { name: "Ford", slug: "ford", country: "United States", foundedYear: 1903, headquarters: "Dearborn, Michigan", description: "Built Ford Tough." },
  { name: "Chevrolet", slug: "chevrolet", country: "United States", foundedYear: 1911, headquarters: "Detroit, Michigan", description: "Find New Roads." },
  { name: "Dodge", slug: "dodge", country: "United States", foundedYear: 1900, headquarters: "Auburn Hills, Michigan", description: "Domestic. Not domesticated." },
  { name: "Tesla", slug: "tesla", country: "United States", foundedYear: 2003, headquarters: "Austin, Texas", description: "Accelerating the world's transition to sustainable energy." },
  { name: "Ferrari", slug: "ferrari", country: "Italy", foundedYear: 1939, headquarters: "Maranello, Italy", description: "We are the competition." },
  { name: "Lamborghini", slug: "lamborghini", country: "Italy", foundedYear: 1963, headquarters: "Sant'Agata Bolognese, Italy", description: "Expect the unexpected." },
  { name: "Maserati", slug: "maserati", country: "Italy", foundedYear: 1914, headquarters: "Modena, Italy", description: "Audaci per natura." },
  { name: "Alfa Romeo", slug: "alfa-romeo", country: "Italy", foundedYear: 1910, headquarters: "Turin, Italy", description: "La meccanica delle emozioni." },
  { name: "Fiat", slug: "fiat", country: "Italy", foundedYear: 1899, headquarters: "Turin, Italy", description: "Driven by passion." },
  { name: "Pagani", slug: "pagani", country: "Italy", foundedYear: 1992, headquarters: "San Cesario sul Panaro, Italy", description: "Art and science." },
];
