import Box from "@mui/material/Box";
import SecondaryHeader from "@pages/issues/SecondaryHeader";
import IssueList from "@pages/issues/IssueList";

export const IssueHome = () => {
  return (
    <Box minWidth={0} px={{ lg: 2, xl: 4 }}>
      <SecondaryHeader />
      <IssueList />
    </Box>
  );
};
