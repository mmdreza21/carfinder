import { CarSearchParams, CarSearchResult, CarStats } from "@/types/CarType";
import APIClient from "./api-client";
import { axiosInstance } from "./api-client";

const carClient = new APIClient<CarSearchResult>("/car");

export const listCars = (params: CarSearchParams) => carClient.getAll({ params });

export const getCarStats = () =>
  axiosInstance.get<CarStats>("/car/stats").then((r) => r.data);
