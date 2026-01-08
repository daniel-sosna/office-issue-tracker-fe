import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

export interface Office {
  id: string;
  title: string;
  country: string;
}

export const fetchOffices = async (): Promise<Office[]> => {
  const res = await api.get<Office[]>(ENDPOINTS.OFFICES);
  return res.data;
};

export const fetchCountries = async (): Promise<string[]> => {
  const res = await api.get<string[]>(ENDPOINTS.COUNTRIES);
  return res.data;
};
