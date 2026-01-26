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
    <TextField
      label={label}
      slotProps={{ inputLabel: { shrink: true } }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      error={!!errorText}
      helperText={errorText ?? helperText}
      fullWidth={fullWidth}
      type={type}
    />
  );
}
