import { useQuery } from "@tanstack/react-query";
import { fetchOffices } from "../api/offices";

export function useOffices() {
  return useQuery({
    queryKey: ["offices"],
    queryFn: fetchOffices,
  });
}
