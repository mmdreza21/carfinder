"use client";

import { useState } from "react";
import { Badge, Box, Button, Dialog, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { Car } from "@/types/CarType";

interface Props { car: Car; }

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Flex direction="column" gap="1">
      <Text size="1" color="gray" weight="bold" style={{ textTransform: "uppercase" }}>
        {label}
      </Text>
      <Text>{value ?? "—"}</Text>
    </Flex>
  );
}

export default function CarDetailsDialog({ car }: Props) {
  const gallery = car.imageUrls?.length ? car.imageUrls : car.imageUrl ? [car.imageUrl] : [];
  const [active, setActive] = useState(0);
  const activeUrl = gallery[active];

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="2" variant="soft">Details</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="900px">
        <Dialog.Title>{car.fullName}</Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="3">
          {car.brandName} · {car.modelName} · {car.generationCode} · {car.year}
        </Dialog.Description>

        {activeUrl && (
          <Box mb="3" style={{ borderRadius: 8, overflow: "hidden", background: "var(--gray-3)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeUrl}
              alt={car.fullName}
              style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
            />
          </Box>
        )}

        {gallery.length > 1 && (
          <Flex gap="2" mb="4" wrap="wrap">
            {gallery.map((u, i) => (
              <button
                key={u + i}
                onClick={() => setActive(i)}
                style={{
                  padding: 0, border: i === active ? "2px solid var(--orange-9)" : "2px solid transparent",
                  borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "transparent",
                  width: 72, height: 52,
                }}
                aria-label={`Image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </Flex>
        )}

        <Flex gap="2" mb="4" wrap="wrap">
          {car.fuelType && <Badge variant="soft" color={car.fuelType === "Electric" ? "green" : "gray"}>{car.fuelType}</Badge>}
          {car.bodyType && <Badge variant="soft">{car.bodyType}</Badge>}
          {car.drivetrain && <Badge variant="soft">{car.drivetrain}</Badge>}
          {car.condition && <Badge variant="soft" color="amber">{car.condition}</Badge>}
          {car.country && <Badge variant="soft">{car.country}</Badge>}
        </Flex>

        <Heading size="3" mb="2">Performance</Heading>
        <Grid columns={{ initial: "2", sm: "3" }} gap="3" mb="4">
          <Field label="Horsepower" value={car.horsepower ? `${car.horsepower} hp` : "—"} />
          <Field label="Torque" value={car.torqueNm ? `${car.torqueNm} Nm` : "—"} />
          <Field label="0–100 km/h" value={car.zeroTo100Kmh ? `${car.zeroTo100Kmh} s` : "—"} />
          <Field label="Top speed" value={car.topSpeedKph ? `${car.topSpeedKph} km/h` : "—"} />
          <Field label="Transmission" value={car.transmission ?? "—"} />
          <Field label="Engine" value={car.engineType ?? "—"} />
        </Grid>

        <Heading size="3" mb="2">Dimensions &amp; weight</Heading>
        <Grid columns={{ initial: "2", sm: "3" }} gap="3" mb="4">
          <Field label="Weight" value={car.weightKg ? `${car.weightKg} kg` : "—"} />
          <Field label="Seats" value={car.seats ?? "—"} />
          <Field label="Doors" value={car.doors ?? "—"} />
          {car.rangeKm != null && <Field label="Range" value={`${car.rangeKm} km`} />}
          {car.fuelConsumptionL100km != null && (
            <Field label="Fuel (L/100km)" value={car.fuelConsumptionL100km} />
          )}
          {car.co2Gkm != null && <Field label="CO₂" value={`${car.co2Gkm} g/km`} />}
        </Grid>

        <Heading size="3" mb="2">Market</Heading>
        <Grid columns={{ initial: "2", sm: "3" }} gap="3" mb="4">
          <Field label="Price USD" value={car.priceUsd ? `$${car.priceUsd.toLocaleString()}` : "—"} />
          {car.priceEur != null && <Field label="Price EUR" value={`€${car.priceEur.toLocaleString()}`} />}
          {car.mileageKm != null && <Field label="Mileage" value={`${car.mileageKm.toLocaleString()} km`} />}
          {car.color && <Field label="Color" value={car.color} />}
        </Grid>

        {car.funFact && (
          <Box mb="4" p="3" style={{ background: "var(--amber-2)", borderRadius: 8 }}>
            <Text size="1" weight="bold" color="amber" style={{ textTransform: "uppercase" }}>
              Fun fact
            </Text>
            <Text as="p" size="2" mt="1">{car.funFact}</Text>
          </Box>
        )}

        {car.description && (
          <Text as="p" size="2" color="gray" mb="4">{car.description}</Text>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
