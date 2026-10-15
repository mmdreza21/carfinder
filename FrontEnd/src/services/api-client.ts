import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

class APIClient<T> {
  private endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  getAll(config?: AxiosRequestConfig) {
    return axiosInstance.get<T>(this.endpoint, config).then((res) => res.data);
  }
  getById(id: string) {
    return axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);
  }
}

export default APIClient;
