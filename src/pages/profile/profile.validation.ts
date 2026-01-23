import type {
  ProfileFormValues,
  ValidationErrors,
} from "@pages/profile/profile.types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(v: ProfileFormValues): ValidationErrors {
  const e: ValidationErrors = {};

  if (!v.name.trim()) e.name = "Name is required";
  if (!v.email.trim()) e.email = "Email is required";
  else if (!emailRegex.test(v.email)) e.email = "Invalid email format";

  if (!v.department.trim()) e.department = "Department is required";
  if (!v.role.trim()) e.role = "Role is required";
  if (!v.streetAddress.trim()) e.streetAddress = "Street address is required";
  if (!v.city.trim()) e.city = "City is required";
  if (!v.postcode.trim()) e.postcode = "Postcode is required";
  if (!v.country.trim()) e.country = "Country is required";

  return e;
}
