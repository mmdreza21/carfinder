"use client";

import { useMemo, useState } from "react";
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import SearchBar, { Filters } from "../SearchBar";
import Pagination from "../Pagination";
import ResultGrid from "../ResultGrid";
import { useCars } from "../hooks/useCars";
import { CarSearchParams } from "@/types/CarType";

const LIMIT = 12;
const emptyFilters: Filters = {
  keyword: "", brand: "", model: "", bodyType: "", fuelType: "", yearMin: "", yearMax: "",
};

export default function SimpleSearchPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<CarSearchParams>({});

  const { data, isLoading } = useCars({ ...active, page, limit: LIMIT });

  const body = useMemo<CarSearchParams>(() => ({
    keyword: filters.keyword || undefined,
    bodyType: filters.bodyType || undefined,
    fuelType: filters.fuelType || undefined,
    yearMin: filters.yearMin ? Number(filters.yearMin) : undefined,
    yearMax: filters.yearMax ? Number(filters.yearMax) : undefined,
  }), [filters]);

  return (
    <Flex direction="column" gap="5">
      <Box p="5" style={{ background: "var(--gray-3)", borderRadius: 12 }}>
        <Heading size="7" mb="1">PostgreSQL listing</Heading>
        <Text size="2" color="gray">
          Direct query against PostgreSQL — no Elasticsearch involved. Same grid, different backend.
        </Text>
      </Box>

      <Card>
        <SearchBar
          filters={filters}
          onChange={(p) => setFilters((f) => ({ ...f, ...p }))}
          onSubmit={() => { setPage(1); setActive(body); }}
        />
      </Card>

      <Text size="2" color="gray">
        {data ? `${data.total.toLocaleString()} result${data.total === 1 ? "" : "s"}` : "Loading…"}
      </Text>

      <ResultGrid items={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > 0 && (
        <Pagination page={page} total={data.total} limit={LIMIT} onPageChange={setPage} />
      )}
    </Flex>
  );
}
