import type { FC } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.2,
        borderBottom: "1px solid #ddd",
        padding: "4px 8px",
        backgroundColor: "#fafafa",
        "& svg": { color: "black" },
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Bold */}
      <Button
        variant="text"
        onClick={() => editor.chain().focus().toggleBold().run()}
        sx={{ minWidth: 0, padding: "6px" }}
        aria-label="Bold"
      >
        <FormatBoldIcon fontSize="small" />
      </Button>

      {/* Italic */}
      <Button
        variant="text"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        sx={{ minWidth: 0, padding: "6px" }}
        aria-label="Italic"
      >
        <FormatItalicIcon fontSize="small" />
      </Button>

      {/* Strike */}
      <Button
        variant="text"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        sx={{ minWidth: 0, padding: "6px" }}
        aria-label="Strikethrough"
      >
        <StrikethroughSIcon fontSize="small" />
      </Button>

      {/* Lists */}
      <Box
        sx={{
          display: "flex",
          borderLeft: "1px solid #ccc",
          pl: 0.5,
          gap: 0.2,
        }}
      >
        <Button
          variant="text"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          sx={{ minWidth: 0, padding: "6px" }}
          aria-label="Bullet List"
        >
          <FormatListBulletedIcon fontSize="small" />
        </Button>

        <Button
          variant="text"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          sx={{ minWidth: 0, padding: "6px" }}
          aria-label="Numbered List"
        >
          <FormatListNumberedIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default EditorToolbar;
