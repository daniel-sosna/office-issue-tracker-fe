export interface ProfileFormValues {
  name: string;
  email: string;
  imageUrl: string;
  department: string;
  role: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postcode: string;
  country: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  imageUrl?: string;
  department?: string;
  role?: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postcode?: string;
  country?: string;
}
