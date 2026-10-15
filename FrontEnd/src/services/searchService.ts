import { CarSearchParams, CarSearchResult } from "@/types/CarType";
import APIClient from "./api-client";

const searchClient = new APIClient<CarSearchResult>("/search");

export const searchCars = (params: CarSearchParams) =>
  searchClient.getAll({ params });
