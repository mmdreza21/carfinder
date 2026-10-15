import { searchCars } from "@/services/searchService";
import { CarSearchParams } from "@/types/CarType";
import { useQuery } from "@tanstack/react-query";

export function useSearch(params: CarSearchParams) {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => searchCars(params),
    placeholderData: (prev) => prev,
  });
}
