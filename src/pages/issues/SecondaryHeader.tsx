import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IssueModal from "@pages/issues/IssueModal";

const SecondaryHeader: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box
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

      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        sx={{ borderRadius: "50px", whiteSpace: "nowrap" }}
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
