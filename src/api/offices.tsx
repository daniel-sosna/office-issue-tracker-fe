import { csrfFetch } from "@utils/csrfFetch";

export interface Office {
  id: string;
  title: string;
  country: string;
}

export const fetchOffices = async (): Promise<Office[]> => {
  const res = await csrfFetch("http://localhost:8080/offices");
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as Office[];
  return data;
};
