import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  InputLabel,
} from "@mui/material";
import IssueCard from "@pages/issues/components/IssueCard";
import IssueDrawer from "@pages/issues/components/IssueDrawer";
import backgroundImage from "@assets/background.png";
import type { Issue, IssueDetails } from "@data/issues";
import { useIssues } from "@api/queries/useIssues";
import { useVoteOnIssue } from "@api/queries/useVoteOnIssue";
import Loader from "@components/Loader";

const tabLabels = [
  "All issues",
  "Open",
  "Planned",
  "Resolved",
  "Closed",
  "Reported by me",
];

const size = 10;

const IssuesList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState<IssueDetails | null>(null);

  const {
    data = { content: [], totalPages: 1 },
    isLoading,
    error,
  } = useIssues({ page, size });

  const paginatedIssues = data.content;
  const totalPages = data.totalPages;

  const handleCardClick = (issue: Issue) => {
    setSelectedIssue({
      ...issue,
      office: "Vilnius, Lithuania",
      reportedBy: "John Doe",
      reportedByAvatar: "/src/assets/profile_placeholder.jpeg",
    });
  };

  const { mutate: voteOnIssue } = useVoteOnIssue();

  const relativeZBox = { position: "relative", zIndex: 1 };
  const pillSelectStyle = {
    borderRadius: "9999px",
    backgroundColor: "#f4f4f4",
    px: 1.5,
    fontSize: 14,
    "& .MuiSelect-select": { py: "6px", borderRadius: "9999px" },
    "& fieldset": { borderRadius: "9999px" },
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box p={4} color="error.main">
        Failed to load issues. Please try again later.
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", overflow: "hidden", px: 4 }}>
      <Box
        component="img"
        src={backgroundImage}
        alt="Background logo"
        sx={{
          position: "absolute",
          top: "60%",
          left: "40%",
          width: "90%",
          transform: "translate(-50%, -50%)",
          opacity: 0.12,
          zIndex: 0,
          pointerEvents: "none",
          filter: "grayscale(80%) brightness(1.2)",
        }}
      />

      {/* Tabs */}
      <Box
        mb={3}
        sx={{ borderBottom: 1, borderColor: "divider", ...relativeZBox }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue as number)}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            cursor: "pointer",
            "& .MuiTabs-indicator": {
              backgroundColor: "#78ece8",
              boxShadow: "0 0 8px rgba(40,203,221,0.3)",
            },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab
              key={label}
              label={label}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color:
                  index === selectedTab ? "text.primary" : "text.secondary",
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        mb={4}
        sx={relativeZBox}
      >
        <Box display="flex" gap={2}>
          {["All offices", "All employees"].map((label) => (
            <FormControl size="small" disabled key={label}>
              <Select value="all" sx={{ minWidth: 140, ...pillSelectStyle }}>
                <MenuItem value="all">{label}</MenuItem>
              </Select>
            </FormControl>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <InputLabel sx={{ fontSize: 14, color: "text.secondary" }}>
            Sort by:
          </InputLabel>
          <FormControl size="small" disabled>
            <Select value="latest" sx={{ minWidth: 160, ...pillSelectStyle }}>
              <MenuItem value="reportedByMe">Reported by me</MenuItem>
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="mostVotes">Most votes</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Issue Cards */}
      <Box sx={relativeZBox}>
        {paginatedIssues.map((issue: Issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClickCard={() => handleCardClick(issue)}
            onClickVote={() =>
              voteOnIssue({ issueId: issue.id, vote: !issue.hasVoted })
            }
          />
        ))}
      </Box>

      {/* Issue details sidebar */}
      <IssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onCommentCreated={() =>
          setSelectedIssue((prev) =>
            prev ? { ...prev, comments: prev.comments + 1 } : prev
          )
        }
      />

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={5} sx={relativeZBox}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          hidePrevButton={page === 1}
          hideNextButton={page === totalPages}
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#78ece8",
              borderRadius: "50%",
              color: "primary.text",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default IssuesList;
