import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IssueModal from "@pages/issues/IssueModal";

const SecondaryHeader: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box
      mb={3}
      px={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>
        <Typography variant="h5">
          Welcome to the Office Issues Dashboard
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Report, vote, and comment on issues in the office that require our
          attention and fixing
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        sx={{ borderRadius: "50px" }}
        onClick={() => setModalOpen(true)}
      >
        Report Issue
      </Button>

      <IssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => setModalOpen(false)}
      />
    </Box>
  );
};

export default SecondaryHeader;
