import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

import { FormFieldError } from "./FormFieldError";

interface Props {
  label?: string;
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  onBlur?: () => void;
  errorText?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function SelectField({
  label,
  value,
  onChange,
  onBlur,
  errorText,
  disabled,
  children,
}: Props) {
  return (
    <FormControl error={!!errorText} disabled={disabled}>
      <InputLabel shrink>{label}</InputLabel>
      <Select label={label} value={value} onChange={onChange} onBlur={onBlur}>
        {children}
      </Select>
      <FormFieldError error={errorText} />
    </FormControl>
  );
}
