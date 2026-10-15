"use client";

import { Button, Flex, Select, TextField } from "@radix-ui/themes";
import { AiOutlineSearch } from "react-icons/ai";

export interface Filters {
  keyword: string;
  brand: string;
  model: string;
  bodyType: string;
  fuelType: string;
  yearMin: string;
  yearMax: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onSubmit: () => void;
  brands?: string[];
}

const BODY_TYPES = ["Sedan", "SUV", "Coupe", "Hatchback", "Convertible", "Wagon", "Pickup", "Van"];
const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric"];

export default function SearchBar({ filters, onChange, onSubmit, brands }: Props) {
  const brandList = brands?.length
    ? brands
    : ["BMW","Mercedes-Benz","Audi","Porsche","Volkswagen","Ford","Chevrolet","Dodge","Tesla","Ferrari","Lamborghini","Maserati","Alfa Romeo","Fiat","Pagani"];

  return (
    <Flex direction="column" gap="3">
      <Flex gap="3" wrap="wrap" align="end">
        <TextField.Root
          placeholder="Search cars (e.g. Ferrari Roma, BMW M3, 911 Turbo)"
          value={filters.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          style={{ minWidth: "260px", flex: "1 1 260px" }}
        >
          <TextField.Slot>
            <AiOutlineSearch />
          </TextField.Slot>
        </TextField.Root>

        <Select.Root value={filters.brand || "any"} onValueChange={(v) => onChange({ brand: v === "any" ? "" : v })}>
          <Select.Trigger placeholder="Brand" style={{ minWidth: 160 }} />
          <Select.Content position="popper">
            <Select.Item value="any">All brands</Select.Item>
            {brandList.map((b) => <Select.Item key={b} value={b}>{b}</Select.Item>)}
          </Select.Content>
        </Select.Root>

        <Select.Root value={filters.bodyType || "any"} onValueChange={(v) => onChange({ bodyType: v === "any" ? "" : v })}>
          <Select.Trigger placeholder="Body" style={{ minWidth: 130 }} />
          <Select.Content position="popper">
            <Select.Item value="any">All bodies</Select.Item>
            {BODY_TYPES.map((b) => <Select.Item key={b} value={b}>{b}</Select.Item>)}
          </Select.Content>
        </Select.Root>

        <Select.Root value={filters.fuelType || "any"} onValueChange={(v) => onChange({ fuelType: v === "any" ? "" : v })}>
          <Select.Trigger placeholder="Fuel" style={{ minWidth: 130 }} />
          <Select.Content position="popper">
            <Select.Item value="any">All fuels</Select.Item>
            {FUEL_TYPES.map((f) => <Select.Item key={f} value={f}>{f}</Select.Item>)}
          </Select.Content>
        </Select.Root>

        <TextField.Root
          placeholder="Year from"
          value={filters.yearMin}
          onChange={(e) => onChange({ yearMin: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          style={{ width: 100 }}
        />
        <TextField.Root
          placeholder="Year to"
          value={filters.yearMax}
          onChange={(e) => onChange({ yearMax: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          style={{ width: 100 }}
        />

        <Button onClick={onSubmit}>Search</Button>
      </Flex>
    </Flex>
  );
}
