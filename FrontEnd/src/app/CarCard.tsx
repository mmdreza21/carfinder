"use client";

import { Badge, Box, Button, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { AiOutlineThunderbolt, AiOutlineDashboard, AiOutlineClockCircle, AiOutlineFire } from "react-icons/ai";
import { Car } from "@/types/CarType";
import CarDetailsDialog from "./CarDetailsDialog";

const fuelColor = (fuel: string | null) => {
  switch (fuel) {
    case "Electric": return "green";
    case "Hybrid":   return "teal";
    case "Diesel":   return "amber";
    default:         return "gray";
  }
};

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | null | undefined }) {
  return (
    <Flex direction="column" gap="0" align="start">
      <Flex align="center" gap="1" style={{ color: "var(--gray-9)" }}>
        {icon}
        <Text size="1" color="gray" style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</Text>
      </Flex>
      <Text size="3" weight="medium">{value ?? "—"}</Text>
    </Flex>
  );
}

export default function CarCard({ car }: { car: Car }) {
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <Box style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--gray-3)" }}>
        {car.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.imageUrl}
            alt={car.fullName}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
        <Flex gap="1" style={{ position: "absolute", top: 10, right: 10 }}>
          {car.condition && (
            <Badge color="amber" variant="solid" radius="full">{car.condition}</Badge>
          )}
        </Flex>
        <Box style={{ position: "absolute", bottom: 10, left: 10 }}>
          <Badge color={fuelColor(car.fuelType)} variant="solid" radius="full">
            {car.fuelType ?? "—"}
          </Badge>
        </Box>
      </Box>

      <Box p="3">
        <Flex direction="column" gap="0" mb="3">
          <Text size="3" weight="bold" style={{ lineHeight: 1.25 }}>{car.fullName}</Text>
          <Text size="2" color="gray">
            {car.year} · {car.bodyType ?? "—"} · {car.drivetrain ?? "—"}
          </Text>
        </Flex>

        <Grid columns="2" gap="3" mb="3">
          <Spec icon={<AiOutlineThunderbolt />} label="HP" value={car.horsepower} />
          <Spec icon={<AiOutlineFire />} label="Torque" value={car.torqueNm ? `${car.torqueNm} Nm` : null} />
          <Spec icon={<AiOutlineClockCircle />} label="0–100" value={car.zeroTo100Kmh ? `${car.zeroTo100Kmh}s` : null} />
          <Spec icon={<AiOutlineDashboard />} label="Top speed" value={car.topSpeedKph ? `${car.topSpeedKph} km/h` : null} />
        </Grid>

        <Flex justify="between" align="center" pt="3" style={{ borderTop: "1px solid var(--gray-a4)" }}>
          <Flex direction="column">
            <Text size="1" color="gray">Price</Text>
            <Text size="5" weight="bold">
              {car.priceUsd ? `$${car.priceUsd.toLocaleString()}` : "—"}
            </Text>
          </Flex>
          <CarDetailsDialog car={car} />
        </Flex>
      </Box>
    </Card>
  );
}
