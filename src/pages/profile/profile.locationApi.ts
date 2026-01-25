export interface CountryOption {
  code: "LITHUANIA" | "LATVIA" | "POLAND";
  name: string;
}

export const allowedCountries: CountryOption[] = [
  { code: "LITHUANIA", name: "Lithuania" },
  { code: "LATVIA", name: "Latvia" },
  { code: "POLAND", name: "Poland" },
];

export function fetchCountries(): CountryOption[] {
  return allowedCountries;
}

export async function fetchCitiesByCountryName(
  countryName: string,
  signal?: AbortSignal
): Promise<string[]> {
  const key = (countryName ?? "").trim();
  if (!key) return [];

  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/cities",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: key }),
      signal,
    }
  );

  if (!res.ok) throw new Error("Failed to load cities");

  const json = (await res.json()) as { data?: string[] };
  const cities = Array.isArray(json.data) ? json.data : [];
  return cities.slice(0, 200);
}
