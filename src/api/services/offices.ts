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

export interface CreateOfficeRequest {
  title: string;
  countryName: string;
}

export const createOffice = async (
  office: CreateOfficeRequest
): Promise<Office> => {
  const res = await api.post<Office>(ENDPOINTS.OFFICES, office);
  return res.data;
};

export interface UpsertOfficeRequest {
  id?: string;
  title: string;
  countryName: string;
}

export const saveOffices = async (
  offices: UpsertOfficeRequest[]
): Promise<Office[]> => {
  const res = await api.put<Office[]>(ENDPOINTS.OFFICES, offices);
  return res.data;
};
