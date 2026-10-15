"use client";

import { useMemo, useState } from "react";
import { Badge, Box, Card, Flex, Heading, Select, Text } from "@radix-ui/themes";
import SearchBar, { Filters } from "./SearchBar";
import Pagination from "./Pagination";
import ResultGrid from "./ResultGrid";
import { useSearch } from "./hooks/useSearch";
import { useCarStats } from "./hooks/useCarStats";
import { CarSearchParams } from "@/types/CarType";

const LIMIT = 12;
const emptyFilters: Filters = {
  keyword: "", brand: "", model: "", bodyType: "", fuelType: "", yearMin: "", yearMax: "",
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<CarSearchParams>({});
  const [sort, setSort] = useState<"relevance" | "priceUsd:asc" | "priceUsd:desc" | "year:desc" | "horsepower:desc">("relevance");

  const sortParams = sort === "relevance"
    ? {}
    : { sortBy: sort.split(":")[0], sortDir: sort.split(":")[1] as "asc" | "desc" };

  const { data, isLoading, isPlaceholderData } = useSearch({ ...active, ...sortParams, page, limit: LIMIT });
  const { data: stats } = useCarStats();

  const body = useMemo<CarSearchParams>(() => ({
    keyword: filters.keyword || undefined,
    brand: filters.brand || undefined,
    bodyType: filters.bodyType || undefined,
    fuelType: filters.fuelType || undefined,
    yearMin: filters.yearMin ? Number(filters.yearMin) : undefined,
    yearMax: filters.yearMax ? Number(filters.yearMax) : undefined,
  }), [filters]);

  const onSearch = () => { setPage(1); setActive(body); };
  const onChange = (partial: Partial<Filters>) => setFilters((f) => ({ ...f, ...partial }));

  return (
    <Flex direction="column" gap="5">
      <Box
        p="5"
        style={{
          background: "linear-gradient(135deg, var(--orange-3), var(--amber-3))",
          borderRadius: 12,
        }}
      >
        <Heading size="8" mb="2">🚗 Find your next car</Heading>
        <Text size="3" color="gray" as="p" mb="3">
          Full-text search across{" "}
          <Text weight="bold">{stats?.total.toLocaleString() ?? "…"}</Text> cars from{" "}
          <Text weight="bold">{stats?.brands ?? "…"}</Text> brands ·{" "}
          <Text weight="bold">{stats?.models ?? "…"}</Text> models ·{" "}
          <Text weight="bold">{stats?.generations ?? "…"}</Text> generations.
        </Text>
        <Flex gap="2" wrap="wrap">
          <Badge color="orange" variant="soft" radius="full">{stats?.total ?? 0} cars</Badge>
          <Badge color="orange" variant="soft" radius="full">{stats?.brands ?? 0} brands</Badge>
          <Badge color="orange" variant="soft" radius="full">{stats?.models ?? 0} models</Badge>
          <Badge color="orange" variant="soft" radius="full">Powered by Elasticsearch</Badge>
        </Flex>
      </Box>

      <Card>
        <SearchBar filters={filters} onChange={onChange} onSubmit={onSearch} />
      </Card>

      <Flex justify="between" align="center" wrap="wrap" gap="3">
        <Text size="2" color="gray">
          {data ? `${data.total.toLocaleString()} result${data.total === 1 ? "" : "s"}` : "Loading…"}
        </Text>
        <Flex align="center" gap="2">
          <Text size="2" color="gray">Sort</Text>
          <Select.Root value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <Select.Trigger style={{ minWidth: 160 }} />
            <Select.Content position="popper">
              <Select.Item value="relevance">Relevance</Select.Item>
              <Select.Item value="priceUsd:asc">Price · low to high</Select.Item>
              <Select.Item value="priceUsd:desc">Price · high to low</Select.Item>
              <Select.Item value="year:desc">Newest year</Select.Item>
              <Select.Item value="horsepower:desc">Most powerful</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <ResultGrid items={data?.items ?? []} isLoading={isLoading && !isPlaceholderData} />

      {data && data.total > 0 && (
        <Pagination page={page} total={data.total} limit={LIMIT} onPageChange={setPage} />
      )}
    </Flex>
  );
}
