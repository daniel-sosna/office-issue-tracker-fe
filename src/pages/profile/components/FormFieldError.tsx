import Typography from "@mui/material/Typography";

interface Props {
  error?: string;
}

export function FormFieldError({ error }: Props) {
  if (!error) return null;

  return (
    <Typography sx={{ mt: 0.75, fontSize: 12, color: "#d32f2f" }}>
      {error}
    </Typography>
  );
}
