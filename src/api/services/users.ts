import { csrfFetch } from "@utils/csrfFetch";
import { BASE_URL, ENDPOINTS } from "@api/services/urls";

export interface User {
  id: string;
  name: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const res = await csrfFetch(`${BASE_URL}${ENDPOINTS.USERS}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as User[];
  return data;
};
