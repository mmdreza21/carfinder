"use client";

import { Flex, Grid, Skeleton, Text } from "@radix-ui/themes";
import { Car } from "@/types/CarType";
import CarCard from "./CarCard";

interface Props {
  items: Car[];
  isLoading: boolean;
}

export default function ResultGrid({ items, isLoading }: Props) {
  const columns = { initial: "1", sm: "2", md: "3", lg: "4" } as const;

  if (isLoading) {
    return (
      <Grid columns={columns} gap="4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} height="360px" />
        ))}
      </Grid>
    );
  }

  if (items.length === 0) {
    return (
      <Flex align="center" justify="center" py="8">
        <Text color="gray" size="3">No cars match your filters.</Text>
      </Flex>
    );
  }

  return (
    <Grid columns={columns} gap="4">
      {items.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </Grid>
  );
}
