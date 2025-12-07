import { api } from "@api/httpClient";
import { ENDPOINTS } from "@api/urls";

export interface Office {
  id: string;
  title: string;
  country: string;
}

export const fetchOffices = async (): Promise<Office[]> => {
  const res = await api.get<Office[]>(ENDPOINTS.OFFICES);
  return res.data;
};
