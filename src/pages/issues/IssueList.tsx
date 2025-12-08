import { useState, useEffect } from "react";
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
import { fetchIssues, fetchIssueDetails } from "@api/issues";
import { normalizeStatus } from "@utils/status.ts";
import { useAuth } from "@context/UseAuth.tsx";

const tabLabels = [
  "All issues",
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
  "Reported by me",
];

const IssuesList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [paginatedIssues, setPaginatedIssues] = useState<Issue[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueDetails | null>(null);
  const { user } = useAuth();

  const size = 10;

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await fetchIssues(page, size);
        const normalized = data.content.map((issue) => ({
          id: issue.id,
          summary: issue.summary,
          description: issue.description,
          status: normalizeStatus(issue.status),
          createdBy: issue.createdBy,
          officeId: issue.officeId,
          dateCreated: issue.dateCreated,
          dateModified: issue.dateModified ?? null,

          votes: issue.votes ?? 0,
          comments: issue.comments ?? 0,
        }));
        setPaginatedIssues(normalized);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to load issues:", err);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [page]);

  const handleCardClick = async (issue: Issue) => {
    try {
      const details = await fetchIssueDetails(issue.id.toString());
      setSelectedIssue(details);
    } catch (err) {
      console.error("Failed to fetch issue details:", err);
    }
  };

  const relativeZBox = { position: "relative", zIndex: 1 };
  const pillSelectStyle = {
    borderRadius: "9999px",
    backgroundColor: "#f4f4f4",
    px: 1.5,
    fontSize: 14,
    "& .MuiSelect-select": { py: "6px", borderRadius: "9999px" },
    "& fieldset": { borderRadius: "9999px" },
  };

  if (loading) return <Box p={4}>Loading issues...</Box>;

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
          pointerEvents: "none",
          zIndex: 0,
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
          onChange={(_, v) => setSelectedTab(v as number)}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#78ece8",
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          {tabLabels.map((label, i) => (
            <Tab
              key={label}
              label={label}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: i === selectedTab ? "text.primary" : "text.secondary",
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
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="mostVotes">Most votes</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={relativeZBox}>
        {paginatedIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClickCard={() => void handleCardClick(issue)}
          />
        ))}
      </Box>

      <IssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issueOwner={
          selectedIssue !== null && selectedIssue.createdByEmail === user?.email
        }
        admin={user?.role === "ADMIN"}
        onIssueUpdated={(updated) => {
          setPaginatedIssues((prev) =>
            prev.map((issue) => (issue.id === updated.id ? updated : issue))
          );
          setSelectedIssue(updated);
        }}
        onIssueDeleted={(deletedId) => {
          setPaginatedIssues((prev) =>
            prev.filter((issue) => issue.id !== deletedId)
          );
          setSelectedIssue(null);
        }}
      />

      <Box display="flex" justifyContent="center" mt={5} sx={relativeZBox}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#78ece8",
              borderRadius: "50%",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default IssuesList;
