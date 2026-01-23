import type { ProfileResponse, ProfileRequest } from "@api/services/profile";
import type { ProfileFormValues } from "@pages/profile/profile.types";

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
    country: data.country ?? "",
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
