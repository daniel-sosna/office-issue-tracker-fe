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
  type?: string;
}

export function TextFieldX({
  label,
  value,
  onChange,
  onBlur,
  errorText,
  helperText,
  type,
}: Props) {
  return (
    <Stack gap={0.75} sx={{ width: "100%" }}>
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {label}
      </Typography>

      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={!!errorText}
        helperText={errorText ?? helperText}
        type={type}
      />
    </Stack>
  );
}
