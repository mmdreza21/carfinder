-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "foundedYear" INTEGER,
    "headquarters" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bodyType" TEXT,
    "segment" TEXT,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER,
    "platform" TEXT,
    "description" TEXT,
    "funFact" TEXT,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "generationId" TEXT,
    "fullName" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "trim" TEXT,
    "bodyType" TEXT,
    "doors" INTEGER,
    "seats" INTEGER,
    "engineType" TEXT,
    "engineDisplacementL" DOUBLE PRECISION,
    "cylinders" INTEGER,
    "fuelType" TEXT,
    "horsepower" INTEGER,
    "torqueNm" INTEGER,
    "transmission" TEXT,
    "drivetrain" TEXT,
    "zeroTo100Kmh" DOUBLE PRECISION,
    "topSpeedKph" INTEGER,
    "lengthMm" INTEGER,
    "widthMm" INTEGER,
    "heightMm" INTEGER,
    "wheelbaseMm" INTEGER,
    "weightKg" INTEGER,
    "fuelConsumptionL100km" DOUBLE PRECISION,
    "co2Gkm" INTEGER,
    "rangeKm" INTEGER,
    "priceUsd" INTEGER,
    "priceEur" INTEGER,
    "mileageKm" INTEGER,
    "condition" TEXT,
    "color" TEXT,
    "vin" TEXT,
    "imageUrl" TEXT,
    "funFact" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "brands_country_idx" ON "brands"("country");

-- CreateIndex
CREATE INDEX "models_brandId_idx" ON "models"("brandId");

-- CreateIndex
CREATE INDEX "models_bodyType_idx" ON "models"("bodyType");

-- CreateIndex
CREATE UNIQUE INDEX "models_brandId_slug_key" ON "models"("brandId", "slug");

-- CreateIndex
CREATE INDEX "generations_modelId_idx" ON "generations"("modelId");

-- CreateIndex
CREATE INDEX "generations_yearFrom_idx" ON "generations"("yearFrom");

-- CreateIndex
CREATE UNIQUE INDEX "generations_modelId_name_key" ON "generations"("modelId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "cars_vin_key" ON "cars"("vin");

-- CreateIndex
CREATE INDEX "cars_brandId_idx" ON "cars"("brandId");

-- CreateIndex
CREATE INDEX "cars_modelId_idx" ON "cars"("modelId");

-- CreateIndex
CREATE INDEX "cars_generationId_idx" ON "cars"("generationId");

-- CreateIndex
CREATE INDEX "cars_year_idx" ON "cars"("year");

-- CreateIndex
CREATE INDEX "cars_fuelType_idx" ON "cars"("fuelType");

-- CreateIndex
CREATE INDEX "cars_bodyType_idx" ON "cars"("bodyType");

-- CreateIndex
CREATE INDEX "cars_priceUsd_idx" ON "cars"("priceUsd");

-- CreateIndex
CREATE INDEX "cars_horsepower_idx" ON "cars"("horsepower");

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generations" ADD CONSTRAINT "generations_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "generations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
