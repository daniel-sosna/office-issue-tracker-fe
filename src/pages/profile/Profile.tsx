import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import type { SelectChangeEvent } from "@mui/material/Select";

import { useAuth } from "@context/UseAuth";
import { useProfile } from "@api/queries/useProfile";
import { useUpdateProfile } from "@api/queries/useUpdateProfile";
import { toFormValues, toRequestBody } from "@pages/profile/profile.mappers";
import type { ProfileFormValues } from "@data/profile.types";
import { validate } from "@pages/profile/profile.validation";
import {
  fetchCountries,
  fetchCitiesByCountryName,
  type CountryOption,
} from "@pages/profile/profile.locationApi";

import { SelectField } from "@pages/profile/components/SelectField";
import { TextFieldX } from "@pages/profile/components/TextFieldX";

const departments = ["Operations", "Engineering", "HR", "Finance", "Sales"];

interface AuthUserWithPicture {
  picture?: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();
  const { data, isLoading, isError, error } = useProfile();
  const update = useUpdateProfile();

  const authPicture = (user as unknown as AuthUserWithPicture | null)?.picture;

  const [initial, setInitial] = useState<ProfileFormValues | null>(null);
  const [form, setForm] = useState<ProfileFormValues>({
    name: "",
    email: "",
    imageUrl: "",
    department: "",
    role: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postcode: "",
    country: "",
  });

  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [citiesOptions, setCitiesOptions] = useState<string[]>([]);
  const [countryChangedByUser, setCountryChangedByUser] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [touched, setTouched] = useState<
    Partial<Record<keyof ProfileFormValues, boolean>>
  >({});

  const [snack, setSnack] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const isPageLoading = loading || isLoading;

  useEffect(() => {
    setCountryOptions(fetchCountries());
  }, []);

  useEffect(() => {
    if (!data) return;
    if (hydrated) return;

    const fv = toFormValues(data);

    if (!fv.imageUrl && authPicture) {
      fv.imageUrl = authPicture;
    }

    setInitial(fv);
    setForm(fv);
    setTouched({});
    setCountryChangedByUser(false);
    setHydrated(true);
  }, [data, authPicture, hydrated]);

  const errors = useMemo(() => validate(form), [form]);

  const selectedCountryName = useMemo(() => {
    const found = countryOptions.find((c) => c.code === form.country);
    return found?.name ?? "";
  }, [countryOptions, form.country]);

  useEffect(() => {
    if (!selectedCountryName) {
      setCitiesOptions([]);
      return;
    }

    const controller = new AbortController();

    void (async () => {
      const cities = await fetchCitiesByCountryName(
        selectedCountryName,
        controller.signal
      );
      setCitiesOptions(cities);
    })().catch(() => setCitiesOptions([]));

    return () => controller.abort();
  }, [selectedCountryName]);
  useEffect(() => {
    if (!countryChangedByUser) return;
    setForm((p) => ({ ...p, city: "" }));
  }, [countryChangedByUser, form.country]);

  const isDirty = useMemo(
    () => (initial ? JSON.stringify(initial) !== JSON.stringify(form) : false),
    [initial, form]
  );

  const canSave =
    isDirty && Object.keys(errors).length === 0 && !update.isPending;

  const markTouched = (k: keyof ProfileFormValues) =>
    setTouched((t) => ({ ...t, [k]: true }));

  const fieldError = (k: keyof ProfileFormValues) =>
    touched[k] ? errors[k] : undefined;

  const onCancel = () => {
    if (!initial) return;
    setForm(initial);
    setTouched({});
    setSnack(null);
    setCountryChangedByUser(false);
    void navigate("/issues", { replace: true });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      department: true,
      role: true,
      streetAddress: true,
      city: true,
      stateProvince: true,
      postcode: true,
      country: true,
      imageUrl: true,
    });

    const current = validate(form);
    if (Object.keys(current).length > 0) return;

    try {
      await update.mutateAsync(toRequestBody(form));
      setInitial(form);
      setCountryChangedByUser(false);
      setSnack({ type: "success", msg: "Profile updated successfully" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
      setSnack({ type: "error", msg });
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    void onSubmit(e);
  };

  if (isPageLoading) {
    return (
      <Stack sx={{ p: 6 }} alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (isError) {
    return (
      <Stack sx={{ p: 6, gap: 2 }}>
        <Alert severity="error">
          {error instanceof Error ? error.message : "Failed to load profile"}
        </Alert>
      </Stack>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, background: "#fff", minHeight: "100vh" }}>
      <Stack sx={{ maxWidth: 1200, mx: "auto" }} gap={3}>
        <Stack>
          <Typography
            sx={{
              fontSize: { xs: 32, md: 44 },
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            My profile
          </Typography>

          <Typography sx={{ mt: 1, color: "#64748b" }}>
            Edit your personal information, position and working address
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={5}
          alignItems="flex-start"
        >
          <Stack sx={{ width: { xs: "100%", md: 340 } }} gap={1.2}>
            <Typography sx={{ fontSize: 13, color: "#64748b" }}>
              Photo
            </Typography>

            <Box
              sx={{
                width: "100%",
                maxWidth: 320,
                height: 320,
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                background: "#f8fafc",
                display: "grid",
                placeItems: "center",
              }}
            >
              {form.imageUrl ? (
                <Box
                  component="img"
                  src={form.imageUrl}
                  alt="Profile"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box sx={{ color: "#94a3b8", fontSize: 14 }}>No photo</Box>
              )}
            </Box>
          </Stack>

          <Stack
            component="form"
            onSubmit={handleSubmit}
            sx={{ flex: 1, maxWidth: 980 }}
            gap={2}
            noValidate
          >
            <Stack direction={{ xs: "column", md: "row" }} gap={2.5}>
              <TextFieldX
                label="Full name"
                value={form.name}
                onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                onBlur={() => markTouched("name")}
                errorText={fieldError("name")}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} gap={2.5}>
              <Stack gap={0.75} sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                  Department
                </Typography>

                <SelectField
                  value={form.department}
                  onChange={(e: SelectChangeEvent) =>
                    setForm((p) => ({
                      ...p,
                      department: String(e.target.value),
                    }))
                  }
                  onBlur={() => markTouched("department")}
                  errorText={fieldError("department")}
                >
                  {departments.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </SelectField>
              </Stack>

              <TextFieldX
                label="Role"
                value={form.role}
                onChange={(v) => setForm((p) => ({ ...p, role: v }))}
                onBlur={() => markTouched("role")}
                errorText={fieldError("role")}
              />
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Typography sx={{ fontSize: 13, color: "#64748b" }}>
              Address
            </Typography>

            <TextFieldX
              label="Street address"
              value={form.streetAddress}
              onChange={(v) => setForm((p) => ({ ...p, streetAddress: v }))}
              onBlur={() => markTouched("streetAddress")}
              errorText={fieldError("streetAddress")}
            />

            <Stack direction={{ xs: "column", md: "row" }} gap={2.5}>
              <Stack gap={0.75} sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                  City
                </Typography>

                <Autocomplete
                  freeSolo
                  clearOnBlur={false}
                  fullWidth
                  options={citiesOptions}
                  value={form.city || null}
                  inputValue={form.city}
                  isOptionEqualToValue={(option, value) => option === value}
                  filterOptions={(opts, state) =>
                    opts.filter((o) =>
                      o.toLowerCase().includes(state.inputValue.toLowerCase())
                    )
                  }
                  onChange={(_, newValue) =>
                    setForm((p) => ({ ...p, city: String(newValue ?? "") }))
                  }
                  onInputChange={(_, newInputValue) =>
                    setForm((p) => ({ ...p, city: newInputValue }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onBlur={() => markTouched("city")}
                      error={!!fieldError("city")}
                      helperText={fieldError("city")}
                      fullWidth
                    />
                  )}
                />
              </Stack>

              <TextFieldX
                label="State / Province"
                value={form.stateProvince}
                onChange={(v) => setForm((p) => ({ ...p, stateProvince: v }))}
                onBlur={() => markTouched("stateProvince")}
                errorText={fieldError("stateProvince")}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} gap={2.5}>
              <TextFieldX
                label="Postcode"
                value={form.postcode}
                onChange={(v) => setForm((p) => ({ ...p, postcode: v }))}
                onBlur={() => markTouched("postcode")}
                errorText={fieldError("postcode")}
              />

              <Stack gap={0.75} sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>
                  Country
                </Typography>

                <SelectField
                  value={countryOptions.length ? form.country : ""}
                  disabled={!countryOptions.length}
                  onChange={(e: SelectChangeEvent) => {
                    setCountryChangedByUser(true);
                    setForm((p) => ({ ...p, country: String(e.target.value) }));
                  }}
                  onBlur={() => markTouched("country")}
                  errorText={fieldError("country")}
                >
                  {countryOptions.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      {c.name}
                    </MenuItem>
                  ))}
                </SelectField>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-end"
              gap={1.5}
              sx={{ mt: 3 }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={update.isPending}
                sx={{ borderRadius: 999 }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={!canSave}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  backgroundColor: "#0b0f2a",
                  "&:hover": { backgroundColor: "#0b0f2a" },
                }}
              >
                {update.isPending ? "Saving..." : "Save"}
              </Button>
            </Stack>

            <Snackbar
              open={!!snack}
              autoHideDuration={3500}
              onClose={() => setSnack(null)}
              message={snack?.msg ?? ""}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
