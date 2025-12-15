import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IssueModal from "@pages/issues/IssueModal";
import OfficeModal from "@pages/office/OfficeModal";

const SecondaryHeader: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);

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
          Welcome to the Office Issue Registration System
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Discover, report, and vote for office issues that require our
          attention and fix
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: "50px",
            borderColor: "text.secondary",
            color: "secondary",
            backgroundColor: "#fff",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#d8d8d8ff",
              borderColor: "#0000001f",
            },
          }}
          onClick={() => setOfficeModalOpen(true)}
        >
          Manage Offices
        </Button>

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

      <IssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => setModalOpen(false)}
      />

      <OfficeModal
        open={officeModalOpen}
        onClose={() => setOfficeModalOpen(false)}
        offices={[]}
        onSave={() => setOfficeModalOpen(false)}
      />
    </Box>
  );
};

export default SecondaryHeader;
