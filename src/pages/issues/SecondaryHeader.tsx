import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const SecondaryHeader: React.FC = () => {
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

      <Button
        disabled
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        sx={{ borderRadius: "50px" }}
      >
        Report Issue
      </Button>
    </Box>
  );
};

export default SecondaryHeader;
