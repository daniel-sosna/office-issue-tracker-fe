import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

interface Props {
  onSubmit: (text: string) => void;
  loading?: boolean;
}

const MAX_LENGTH = 500;

export default function CommentInput({ onSubmit, loading = false }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;

    onSubmit(value.trim());
    setValue("");
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder="Add a comment..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        slotProps={{
          htmlInput: {
            maxLength: MAX_LENGTH,
          },
        }}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={0.5}
      >
        <Typography
          variant="caption"
          color={value.length >= MAX_LENGTH ? "error" : "text.secondary"}
        >
          {value.length}/{MAX_LENGTH}
        </Typography>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
