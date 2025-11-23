import { useEffect, useState, type FC } from "react";
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
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => setVersion((v) => v + 1);

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
    };
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) => ({
    minWidth: 0,
    padding: "6px",
    borderRadius: "6px",
    backgroundColor: active ? "#e0e0e0" : "transparent",
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.2,
        borderBottom: "1px solid #ddd",
        padding: "4px 8px",
        backgroundColor: "#fafafa",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="text"
        onClick={() => editor.chain().focus().toggleBold().run()}
        sx={btn(editor.isActive("bold"))}
      >
        <FormatBoldIcon sx={{ color: "black" }} fontSize="small" />
      </Button>

      <Button
        variant="text"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        sx={btn(editor.isActive("italic"))}
      >
        <FormatItalicIcon sx={{ color: "black" }} fontSize="small" />
      </Button>

      <Button
        variant="text"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        sx={btn(editor.isActive("strike"))}
      >
        <StrikethroughSIcon sx={{ color: "black" }} fontSize="small" />
      </Button>

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
          sx={btn(editor.isActive("bulletList"))}
        >
          <FormatListBulletedIcon sx={{ color: "black" }} fontSize="small" />
        </Button>

        <Button
          variant="text"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          sx={btn(editor.isActive("orderedList"))}
        >
          <FormatListNumberedIcon sx={{ color: "black" }} fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default EditorToolbar;
