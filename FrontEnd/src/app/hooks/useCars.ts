import { listCars } from "@/services/carService";
import { CarSearchParams } from "@/types/CarType";
import { useQuery } from "@tanstack/react-query";

export function useCars(params: CarSearchParams) {
  return useQuery({
    queryKey: ["cars", params],
    queryFn: () => listCars(params),
    placeholderData: (previousData) => previousData,
  });
}
