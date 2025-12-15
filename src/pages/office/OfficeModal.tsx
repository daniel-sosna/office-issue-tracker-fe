import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import Paper from "@mui/material/Paper";

interface Office {
  id: string;
  title: string;
  country: string;
}

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

  const handleCountryChange = (id: string, country: string) => {
    setLocalOffices((prev) =>
      prev.map((o) => (o.id === id ? { ...o, country } : o))
    );
  };

  const isFormValid = localOffices.every(
    (office) => office.title.trim() !== "" && office.country !== ""
  );

  return (
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

      <DialogContent>
        <Box display="flex" gap={32}>
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
              <DragIndicatorIcon
                sx={{
                  cursor: "grab",
                  color: "text.secondary",
                  fontSize: "13px",
                }}
              />

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
                  slots={{ input: OutlinedInput }}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
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
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="UK">UK</MenuItem>
                    <MenuItem value="France">France</MenuItem>
                    <MenuItem value="Germany">Germany</MenuItem>
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
              { id: Date.now().toString(), title: "", country: "" },
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
          onClick={() => onSave(localOffices)}
          disabled={!isFormValid}
          sx={{
            borderRadius: "999px",
            paddingX: 4,
            backgroundColor: "secondary.main",
          }}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
}
