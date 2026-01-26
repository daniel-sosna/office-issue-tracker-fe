import type { ProfileResponse, ProfileRequest } from "@api/services/profile";
import type { ProfileFormValues } from "@data/profile.types";
import { allowedCountries } from "@pages/profile/profile.locationApi";

function normalizeCountryToCode(raw: string | null | undefined): string {
  const v = (raw ?? "").trim();
  if (!v) return "";
  const byCode = allowedCountries.find(
    (c) => c.code.toLowerCase() === v.toLowerCase()
  );
  if (byCode) return byCode.code;
  const byName = allowedCountries.find(
    (c) => c.name.toLowerCase() === v.toLowerCase()
  );
  if (byName) return byName.code;
  return "";
}

export function toFormValues(data: ProfileResponse): ProfileFormValues {
  return {
    name: data.name ?? "",
    email: data.email ?? "",
    imageUrl: data.imageUrl ?? "",
    department: data.department ?? "",
    role: data.role ?? "",
    streetAddress: data.streetAddress ?? "",
    city: data.city ?? "",
    stateProvince: data.stateProvince ?? "",
    postcode: data.postcode ?? "",
    country: normalizeCountryToCode(data.country),
  };
}

export function toRequestBody(values: ProfileFormValues): ProfileRequest {
  return {
    name: values.name || null,
    department: values.department || null,
    role: values.role || null,
    streetAddress: values.streetAddress || null,
    city: values.city || null,
    stateProvince: values.stateProvince || null,
    postcode: values.postcode || null,

    country: values.country || null,
  };
}
