import { useState, useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IssueModal from "@pages/issues/IssueModal";
import OfficeModal from "@pages/office/OfficeModal";
import { AuthContext } from "@context/AuthContext";

const SecondaryHeader: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN";

  return (
    <Box
      component="header"
      aria-label="Secondary dashboard actions"
      p={1}
      mb={2}
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      gap={3}
    >
      <Box
        flex={1}
        minWidth={0}
        width={{ xs: "100%", md: "auto" }}
        textAlign={{ xs: "center", md: "left" }}
        mr={{ xs: 0, md: 3 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Welcome to the{" "}
          <Box component="span" whiteSpace="nowrap">
            Office Issue Tracker
          </Box>{" "}
          dashboard
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Report, vote, and comment on issues in the office that require our
          attention and fixing
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        {isAdmin && (
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
            aria-label="Manage Offices"
          >
            Manage Offices
          </Button>
        )}

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: "50px", whiteSpace: "nowrap" }}
          onClick={() => setModalOpen(true)}
          aria-label="Report Issue"
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
