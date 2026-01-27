import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  errorText?: string;
  helperText?: string;
  fullWidth?: boolean;
  type?: string;
}

export function TextFieldX({
  label,
  value,
  onChange,
  onBlur,
  errorText,
  helperText,
  fullWidth = true,
  type,
}: Props) {
  return (
    <Stack gap={0.75} sx={{ width: fullWidth ? "100%" : "auto" }}>
      <Typography sx={{ fontSize: 13, color: "#64748b" }}>{label}</Typography>

      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={!!errorText}
        helperText={errorText ?? helperText}
        fullWidth={fullWidth}
        type={type}
      />
    </Stack>
  );
}
