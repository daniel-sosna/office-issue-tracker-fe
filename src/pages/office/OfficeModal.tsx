import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import {
  fetchCountries,
  fetchOffices,
  type UpsertOfficeRequest,
  type Office,
} from "@api/services/offices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveOffices } from "@api/services/offices";
import { queryKeys } from "@api/queries/queryKeys";
import { useDeleteOffice } from "@api/queries/useDeleteOffice";

interface ManageOfficesModalProps {
  open: boolean;
  onClose: () => void;
  offices: Office[];
  onSave: (offices: Office[]) => void;
}

export default function ManageOfficesModal({
  open,
  onClose,
  offices,
  onSave,
}: ManageOfficesModalProps) {
  const [localOffices, setLocalOffices] = useState<Office[]>(offices);
  const [errorMessage, setErrorMessage] = useState("");
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [officeToConfirmDelete, setOfficeToConfirmDelete] =
    useState<Office | null>(null);

  const queryClient = useQueryClient();
  const deleteOfficeMutation = useDeleteOffice();

  const saveMutation = useMutation<Office[], unknown, UpsertOfficeRequest[]>({
    mutationFn: async (offices) => {
      return await saveOffices(offices);
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.offices() });
      setLocalOffices(data);
      onSave(data);
    },
    onError: (error: unknown) => {
      let message = "Failed to save offices";
      if (error instanceof Error) message = error.message;
      setErrorMessage(message);
    },
  });

  const isSaving = saveMutation.isPending;

  const handleCountryChange = (id: string, country: string) => {
    setLocalOffices((previousOffices) =>
      previousOffices.map((office) =>
        office.id === id ? { ...office, country } : office
      )
    );
  };

  const handleSave = () => {
    const payload: UpsertOfficeRequest[] = localOffices.map((office) => ({
      ...(office.id.startsWith("new-") ? {} : { id: office.id }),
      title: office.title,
      countryName: office.country,
    }));
    saveMutation.mutate(payload);
  };

  const requestDeleteConfirmation = (office: Office) => {
    setOfficeToConfirmDelete(office);
  };

  const confirmDelete = () => {
    if (!officeToConfirmDelete) {
      return;
    }

    const { id } = officeToConfirmDelete;

    if (id.startsWith("new-")) {
      setLocalOffices((previous) =>
        previous.filter((office) => office.id !== id)
      );
      setOfficeToConfirmDelete(null);
      return;
    }

    setIsDeletingId(id);

    deleteOfficeMutation.mutate(id, {
      onSuccess: () => {
        setLocalOffices((previous) =>
          previous.filter((office) => office.id !== id)
        );
        setIsDeletingId(null);
        setOfficeToConfirmDelete(null);
      },
      onError: (error: unknown) => {
        let message = "Failed to delete office";
        if (error instanceof Error) {
          message = error.message;
        }
        setErrorMessage(message);
        setIsDeletingId(null);
        setOfficeToConfirmDelete(null);
      },
    });
  };

  const cancelDelete = () => {
    setOfficeToConfirmDelete(null);
  };

  const isFormValid = localOffices.every(
    (office) => office.title.trim() !== "" && office.country !== ""
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadOffices = async () => {
      try {
        const data = await fetchOffices();
        setLocalOffices(data);
        const countriesResponse = await fetchCountries();
        setAllCountries(countriesResponse);
      } catch {
        setErrorMessage("Failed to load offices or countries");
      }
    };

    void loadOffices();
  }, [open]);

  return (
    <>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setErrorMessage("")}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Dialog open={!!officeToConfirmDelete} onClose={cancelDelete}>
        <DialogTitle>Delete office</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete{" "}
            <strong>
              {officeToConfirmDelete?.title} ({officeToConfirmDelete?.country})
            </strong>
            ? This action cannot be undone.
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        slots={{ paper: Paper }}
        slotProps={{ paper: { sx: { width: 700 } } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "24px",
            fontWeight: 400,
            position: "relative",
            marginTop: "16px",
          }}
        >
          Manage offices
        </DialogTitle>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            color: "secondary.main",
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Box display="flex" gap={34}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "text.secondary", fontSize: "13px" }}>
                Office Title
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "text.secondary", fontSize: "13px" }}>
                Country
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            {localOffices.map((office) => (
              <Box key={office.id} display="flex" gap={1} alignItems="center">
                <IconButton
                  onClick={() => requestDeleteConfirmation(office)}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "error.main" },
                  }}
                  disabled={office.id === isDeletingId}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>

                <Box
                  sx={{
                    flex: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    sx={{ color: "text.secondary", fontSize: "13px" }}
                  ></Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={office.title}
                    sx={{ backgroundColor: "#fff" }}
                    onChange={(event) => {
                      const newTitle = event.target.value;
                      setLocalOffices((previousOffices) =>
                        previousOffices.map((existingOffice) =>
                          existingOffice.id === office.id
                            ? { ...existingOffice, title: newTitle }
                            : existingOffice
                        )
                      );
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    sx={{ color: "text.secondary", fontSize: "13px" }}
                  ></Typography>
                  <FormControl sx={{ flex: 1, pl: "10px" }} size="small">
                    <Select
                      value={office.country}
                      displayEmpty
                      onChange={(e) =>
                        handleCountryChange(office.id, e.target.value)
                      }
                      input={<OutlinedInput />}
                      IconComponent={ExpandMoreIcon}
                      renderValue={(selected) =>
                        selected === "" ? "Select" : selected
                      }
                      sx={{
                        backgroundColor: "#fff",
                        fontSize: "13px",
                        p: "3px",
                        color:
                          office.country === ""
                            ? "text.disabled"
                            : "text.primary",
                        "& .MuiSelect-icon": {
                          color: "secondary.main",
                        },
                      }}
                    >
                      {allCountries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            ))}
          </Box>

          <Typography
            sx={{
              mt: 2,
              mb: 7,
              color: "primary.main",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() =>
              setLocalOffices((prev) => [
                ...prev,
                { id: `new-${Date.now()}`, title: "", country: "" },
              ])
            }
          >
            Add Office
          </Typography>
        </DialogContent>

        <Box sx={{ borderTop: "1px solid #d3d3d3", marginTop: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            columnGap: "10px",
            padding: "16px",
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: "999px", paddingX: 3, color: "secondary.main" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            sx={{
              borderRadius: "999px",
              paddingX: 4,
              backgroundColor: "secondary.main",
            }}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
