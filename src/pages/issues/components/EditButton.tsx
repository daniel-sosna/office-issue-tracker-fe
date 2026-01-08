import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface EditButtonProps {
  onClick: () => void;
}

export function EditButton({ onClick }: EditButtonProps) {
  return (
    <IconButton size="small" onClick={onClick}>
      <EditIcon fontSize="small" />
    </IconButton>
  );
}
