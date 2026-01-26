import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

export interface ProfileResponse {
  userId: string;
  name: string;
  email: string;
  imageUrl: string | null;
  department: string | null;
  role: string | null;
  streetAddress: string | null;
  city: string | null;
  stateProvince: string | null;
  postcode: string | null;
  country: string | null;
  updatedAt: string | null;
}

export interface ProfileRequest {
  name?: string | null;
  department?: string | null;
  role?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  postcode?: string | null;
  country?: string | null;
}

export async function getMyProfile(): Promise<ProfileResponse> {
  const res = await api.get<ProfileResponse>(ENDPOINTS.PROFILE_ME);
  return res.data;
}

export async function updateMyProfile(
  body: ProfileRequest
): Promise<ProfileResponse> {
  const payload: ProfileRequest = {
    ...body,
    country: body.country ? body.country.toUpperCase() : body.country,
  };

  const res = await api.put<ProfileResponse>(ENDPOINTS.PROFILE_ME, payload);
  return res.data;
}
