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

  const handleClear = () => {
    setValue("");
  };

  const canSend = !!value.trim();
  const canClear = value.length > 0;

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

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={loading || !canClear}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !canSend}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
