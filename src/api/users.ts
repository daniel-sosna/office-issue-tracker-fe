import { csrfFetch } from "@utils/csrfFetch";
import { BASE_URL, ENDPOINTS } from "./urls";

export interface Users {
  id: string;
  name: string;
}

export const fetchAllUsers = async (): Promise<Users[]> => {
  const res = await csrfFetch(`${BASE_URL}${ENDPOINTS.USERS}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = (await res.json()) as Users[];
  return data;
};
