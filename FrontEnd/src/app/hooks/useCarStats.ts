import { getCarStats } from "@/services/carService";
import { useQuery } from "@tanstack/react-query";

export function useCarStats() {
  return useQuery({
    queryKey: ["car-stats"],
    queryFn: getCarStats,
    staleTime: 60_000,
  });
}
