import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IssueModal from "@pages/issues/IssueModal";

const SecondaryHeader: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box
        mb={3}
        px={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5">
            Welcome to the Office Issue Registration System
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Discover, report, and vote for office issues that require our
            attention and fix
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
      </Box>

      {/* Issue Modal */}
      <IssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => setModalOpen(false)}
      />
    </>
  );
};

export default SecondaryHeader;
