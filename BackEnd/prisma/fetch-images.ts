import fs from 'fs';
import path from 'path';
import { BRANDS } from './seed-data/brands';
import { MODELS } from './seed-data/models';

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- generic HTTP helpers ----------
async function fetchText(
  url: string,
  headers: Record<string, string> = {},
  timeoutMs = 8000,
): Promise<string | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          ...headers,
        },
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch {
      clearTimeout(timer);
      await sleep(400 * (attempt + 1));
    }
  }
  return null;
}

// Runs a promise but gives up after ms, so one slow source can't block everything.
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    p,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

function uniq(arr: string[]): string[] {
  return [...new Set(arr)];
}

// ============================================================
// SOURCE 1: Bing image search
// ============================================================
async function bingImages(query: string): Promise<string[]> {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1&count=35`;
  const html = await fetchText(url);
  if (!html) return [];

  // Bing embeds original URLs as murl":"..." or murl&quot;:&quot;..."
  const urls = new Set<string>();
  const regex = /murl(?:&quot;|")\s*:\s*(?:&quot;|")([^"&]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    const u = m[1].replace(/\\\//g, '/');
    if (/\.(jpe?g|png|webp)($|\?)/i.test(u) && !/bing\.com/i.test(u)) urls.add(u);
  }
  return [...urls].slice(0, 30);
}

// ============================================================
// SOURCE 2: DuckDuckGo image search
// ============================================================
async function ddgImages(query: string): Promise<string[]> {
  const seed = await fetchText(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`);
  if (!seed) return [];
  const vqd = /vqd=["']?([\d-]+)/.exec(seed)?.[1];
  if (!vqd) return [];
  await sleep(400);
  const res = await fetchText(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`,
    { Referer: 'https://duckduckgo.com/' },
  );
  if (!res) return [];
  try {
    const data = JSON.parse(res) as { results?: { image: string }[] };
    return uniq(
      (data.results ?? [])
        .map((r) => r.image)
        .filter((u) => u && /\.(jpe?g|png|webp)($|\?)/i.test(u)),
    ).slice(0, 30);
  } catch {
    return [];
  }
}

// ============================================================
// SOURCE 3: Official press sites (best-effort)
// ============================================================
type PressFn = (modelName: string) => Promise<string[]>;

function extractAllImages(html: string, baseUrl: string, ext = /\.(jpe?g|png|webp)($|\?)/i): string[] {
  const urls = new Set<string>();
  const attrRe = /(?:src|data-src|href|content)=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(html)) !== null) {
    let u = m[1];
    if (u.startsWith('//')) u = 'https:' + u;
    else if (u.startsWith('/')) {
      try { u = new URL(u, baseUrl).toString(); } catch { continue; }
    }
    if (!/^https?:\/\//.test(u)) continue;
    if (ext.test(u)) urls.add(u);
  }
  return [...urls];
}

const PRESS_SITES: Record<string, PressFn> = {
  bmw: async (model) => {
    const html = await fetchText(
      `https://www.press.bmwgroup.com/global/search?q=${encodeURIComponent(model)}`,
    );
    if (!html) return [];
    return extractAllImages(html, 'https://www.press.bmwgroup.com')
      .filter((u) => /press\.bmwgroup\.com|bmwgroup/i.test(u))
      .slice(0, 20);
  },
  porsche: async (model) => {
    const html = await fetchText(
      `https://newsroom.porsche.com/en/search.html?q=${encodeURIComponent(model)}`,
    );
    if (!html) return [];
    return extractAllImages(html, 'https://newsroom.porsche.com')
      .filter((u) => /newsroom\.porsche\.com|porsche/i.test(u))
      .slice(0, 20);
  },
  'mercedes-benz': async (model) => {
    const html = await fetchText(
      `https://media.mercedes-benz.com/en/search?q=${encodeURIComponent(model)}`,
    );
    if (!html) return [];
    return extractAllImages(html, 'https://media.mercedes-benz.com')
      .filter((u) => /mercedes|daimler/i.test(u))
      .slice(0, 20);
  },
  audi: async (model) => {
    const html = await fetchText(
      `https://www.audi-mediacenter.com/en/search?q=${encodeURIComponent(model)}`,
    );
    if (!html) return [];
    return extractAllImages(html, 'https://www.audi-mediacenter.com')
      .filter((u) => /audi-mediacenter|audi\.com/i.test(u))
      .slice(0, 20);
  },
};

// ============================================================
// SOURCE 4: Wikimedia Commons category (reliable fallback)
// ============================================================
async function commonsImages(category: string, limit = 60): Promise<string[]> {
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      formatversion: '2',
      generator: 'categorymembers',
      gcmtitle: `Category:${category}`,
      gcmtype: 'file',
      gcmlimit: String(limit),
      prop: 'imageinfo',
      iiprop: 'url|mime',
      iiurlwidth: '1200',
    }).toString();
  const text = await fetchText(url);
  if (!text) return [];
  try {
    const data: any = JSON.parse(text);
    const pages: any[] = data?.query?.pages ?? [];
    return uniq(
      pages
        .map((p) => p.imageinfo?.[0])
        .filter((ii) => ii && !/svg/i.test(ii.mime ?? '') && !/\.svg($|\?)/i.test(ii.url ?? ''))
        .map((ii) => ii.thumburl ?? ii.url)
        .filter(Boolean),
    );
  } catch {
    return [];
  }
}

const COMMONS_CATEGORIES: Record<string, string[]> = {
  'bmw/3-series':            ['BMW 3 Series', 'BMW G20'],
  'bmw/5-series':            ['BMW 5 Series', 'BMW G30'],
  'bmw/7-series':            ['BMW 7 Series', 'BMW G70'],
  'bmw/x3':                  ['BMW X3', 'BMW G01'],
  'bmw/x5':                  ['BMW X5', 'BMW G05'],
  'bmw/m3':                  ['BMW M3', 'BMW G80'],
  'bmw/m5':                  ['BMW M5', 'BMW F90'],
  'bmw/i4':                  ['BMW i4'],
  'mercedes-benz/c-class':   ['Mercedes-Benz W206', 'Mercedes-Benz C-Class'],
  'mercedes-benz/e-class':   ['Mercedes-Benz W214', 'Mercedes-Benz E-Class'],
  'mercedes-benz/s-class':   ['Mercedes-Benz W223', 'Mercedes-Benz S-Class'],
  'mercedes-benz/glc':       ['Mercedes-Benz X254'],
  'mercedes-benz/gle':       ['Mercedes-Benz V167'],
  'mercedes-benz/amg-gt':    ['Mercedes-AMG GT', 'Mercedes-Benz C190'],
  'mercedes-benz/g-class':   ['Mercedes-Benz G-Class', 'Mercedes-Benz W463'],
  'mercedes-benz/eqs':       ['Mercedes-Benz EQS'],
  'audi/a3':                 ['Audi A3 8Y', 'Audi A3'],
  'audi/a4':                 ['Audi A4 B9', 'Audi A4'],
  'audi/a6':                 ['Audi A6 C8', 'Audi A6'],
  'audi/q5':                 ['Audi Q5 FY', 'Audi Q5'],
  'audi/q7':                 ['Audi Q7 4M', 'Audi Q7'],
  'audi/rs6':                ['Audi RS6 C8', 'Audi RS6'],
  'audi/e-tron-gt':          ['Audi e-tron GT'],
  'porsche/911':             ['Porsche 992', 'Porsche 911'],
  'porsche/cayenne':         ['Porsche Cayenne', 'Porsche 9YA'],
  'porsche/macan':           ['Porsche Macan'],
  'porsche/panamera':        ['Porsche Panamera', 'Porsche 971'],
  'porsche/taycan':          ['Porsche Taycan'],
  'porsche/718-cayman':      ['Porsche 982', 'Porsche Cayman'],
  'volkswagen/golf':         ['Volkswagen Golf Mk8', 'Volkswagen Golf'],
  'volkswagen/passat':       ['Volkswagen Passat B8', 'Volkswagen Passat'],
  'volkswagen/tiguan':       ['Volkswagen Tiguan', 'Volkswagen Tiguan AD1'],
  'volkswagen/id4':          ['Volkswagen ID.4'],
  'volkswagen/polo':         ['Volkswagen Polo Mk6', 'Volkswagen Polo'],
  'ford/mustang':            ['Ford Mustang (sixth generation)', 'Ford Mustang'],
  'ford/f-150':              ['Ford F-150', 'Ford F-Series'],
  'ford/explorer':           ['Ford Explorer'],
  'ford/focus':              ['Ford Focus', 'Ford Focus Mk4'],
  'ford/bronco':             ['Ford Bronco', 'Ford Bronco (sixth generation)'],
  'chevrolet/corvette':      ['Chevrolet Corvette C8', 'Chevrolet Corvette'],
  'chevrolet/camaro':        ['Chevrolet Camaro (sixth generation)', 'Chevrolet Camaro'],
  'chevrolet/silverado':     ['Chevrolet Silverado', 'Chevrolet Silverado 1500'],
  'chevrolet/malibu':        ['Chevrolet Malibu'],
  'chevrolet/tahoe':         ['Chevrolet Tahoe'],
  'dodge/challenger':        ['Dodge Challenger (2008)', 'Dodge Challenger'],
  'dodge/charger':           ['Dodge Charger (LD)', 'Dodge Charger'],
  'dodge/durango':           ['Dodge Durango'],
  'tesla/model-3':           ['Tesla Model 3'],
  'tesla/model-s':           ['Tesla Model S'],
  'tesla/model-x':           ['Tesla Model X'],
  'tesla/model-y':           ['Tesla Model Y'],
  'ferrari/488-gtb':         ['Ferrari 488 GTB', 'Ferrari 488'],
  'ferrari/f8-tributo':      ['Ferrari F8 Tributo'],
  'ferrari/sf90-stradale':   ['Ferrari SF90 Stradale'],
  'ferrari/296-gtb':         ['Ferrari 296 GTB'],
  'ferrari/roma':            ['Ferrari Roma'],
  'lamborghini/huracan':     ['Lamborghini Huracán'],
  'lamborghini/aventador':   ['Lamborghini Aventador'],
  'lamborghini/urus':        ['Lamborghini Urus'],
  'lamborghini/revuelto':    ['Lamborghini Revuelto'],
  'maserati/ghibli':         ['Maserati Ghibli (M157)', 'Maserati Ghibli'],
  'maserati/levante':        ['Maserati Levante'],
  'maserati/granturismo':    ['Maserati GranTurismo'],
  'maserati/mc20':           ['Maserati MC20'],
  'alfa-romeo/giulia':       ['Alfa Romeo Giulia (952)', 'Alfa Romeo Giulia'],
  'alfa-romeo/stelvio':      ['Alfa Romeo Stelvio'],
  'alfa-romeo/giulietta':    ['Alfa Romeo Giulietta (940)'],
  'alfa-romeo/4c':           ['Alfa Romeo 4C'],
  'fiat/500':                ['Fiat 500 (2007)', 'Fiat 500'],
  'fiat/panda':              ['Fiat Panda', 'Fiat Panda (2011)'],
  'fiat/124-spider':         ['Fiat 124 Spider (2016)'],
  'pagani/huayra':           ['Pagani Huayra'],
  'pagani/zonda':            ['Pagani Zonda'],
  'pagani/utopia':           ['Pagani Utopia'],
};

// ============================================================
// MAIN: for each model, try sources in priority order
// ============================================================
async function collectForModel(
  brandSlug: string,
  modelName: string,
  slug: string,
): Promise<{ urls: string[]; source: string }> {
  const brand = BRANDS.find((b) => b.slug === brandSlug);
  const brandName = brand?.name ?? brandSlug;
  const key = `${brandSlug}/${slug}`;

  // 1) Official press site (if configured for this brand)
  const press = PRESS_SITES[brandSlug];
  if (press) {
    const urls = (await withTimeout(press(modelName), 12000)) ?? [];
    if (urls.length >= 3) return { urls: urls.slice(0, 25), source: `press:${brandSlug}` };
  }

  // 2) Bing image search
  try {
    const urls = (await withTimeout(bingImages(`${brandName} ${modelName} car`), 15000)) ?? [];
    if (urls.length >= 3) return { urls: urls.slice(0, 25), source: 'bing' };
  } catch { /* fall through */ }

  // 3) DuckDuckGo image search
  try {
    const urls = (await withTimeout(ddgImages(`${brandName} ${modelName} car`), 15000)) ?? [];
    if (urls.length >= 3) return { urls: urls.slice(0, 25), source: 'ddg' };
  } catch { /* fall through */ }

  // 4) Wikimedia Commons categories
  const cats = COMMONS_CATEGORIES[key] ?? [`${brandName} ${modelName}`];
  for (const cat of cats) {
    const urls = (await withTimeout(commonsImages(cat), 12000)) ?? [];
    if (urls.length >= 3) return { urls: urls.slice(0, 30), source: `commons:${cat}` };
  }

  return { urls: [], source: 'none' };
}

async function main() {
  const out: Record<string, string[]> = {};
  const stats = { bing: 0, ddg: 0, commons: 0, press: 0, none: 0 };
  let total = 0;
  let ok = 0;

  for (const [brandSlug, name, slug] of MODELS) {
    const key = `${brandSlug}/${slug}`;
    const { urls, source } = await collectForModel(brandSlug, name, slug);

    if (urls.length > 0) {
      out[key] = urls;
      total += urls.length;
      ok++;
      const tag = source.split(':')[0];
      stats[tag as keyof typeof stats]++;
      console.log(`✓ ${key.padEnd(28)} ${String(urls.length).padStart(3)}  [${source}]`);
    } else {
      stats.none++;
      console.log(`✗ ${key}`);
    }

    await sleep(400); // politeness
  }

  const outPath = path.join(__dirname, 'seed-data', 'car-images.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log(`\n============ SUMMARY ============`);
  console.log(`Models with images: ${ok}/${MODELS.length}`);
  console.log(`Total URLs: ${total}`);
  console.log(`  press sites : ${stats.press}`);
  console.log(`  bing        : ${stats.bing}`);
  console.log(`  ddg         : ${stats.ddg}`);
  console.log(`  commons     : ${stats.commons}`);
  console.log(`  missing     : ${stats.none}`);
  console.log(`\nSaved to ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
