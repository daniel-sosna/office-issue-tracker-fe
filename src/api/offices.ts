import { csrfFetch } from "@utils/csrfFetch.ts";
import { BASE_URL, ENDPOINTS } from "@api/urls.ts";

export interface Office {
  id: string;
  title: string;
  country: string;
}

export const fetchOffices = async (): Promise<Office[]> => {
  const res = await csrfFetch(`${BASE_URL}${ENDPOINTS.OFFICES}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as Office[];
  return data;
};
