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
  Snackbar,
  Alert,
} from "@mui/material";
import IssueCard from "@pages/issues/components/IssueCard";
import IssueDrawer from "@pages/issues/components/IssueDrawer";
import backgroundImage from "@assets/background.png";
import type { Issue, IssueDetails } from "@data/issues";
import { fetchIssues, fetchIssueDetails } from "@api/services/issues.ts";
import { normalizeStatus } from "@utils/status.ts";
import { useAuth } from "@context/UseAuth.tsx";
import {
  formatDate,
  stripHtml,
  stripHtmlDescription,
} from "@utils/formatters.ts";
import { truncate } from "@utils/truncation.ts";

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
  const [paginatedIssues, setIssues] = useState<Issue[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const size = 10;

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await fetchIssues({ page, size });
        const normalized = data.content.map((issue) => ({
          id: issue.id,
          summary: truncate(issue.summary, 50),
          description: truncate(issue.description, 50),
          status: normalizeStatus(issue.status),
          createdBy: issue.createdBy,
          officeId: issue.officeId,
          dateCreated: formatDate(issue.dateCreated),
          dateModified: issue.dateModified ?? null,
          votes: issue.votes ?? 0,
          comments: issue.comments ?? 0,
        }));
        setIssues(normalized);
        setTotalPages(data.totalPages ?? 1);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load issues.");
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
      setError(
        err instanceof Error ? err.message : "Failed to load issue details."
      );
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

  const refreshIssues = async () => {
    const data = await fetchIssues({ page, size });
    const normalized = data.content.map((issue) => ({
      id: issue.id,
      summary: truncate(stripHtml(issue.summary), 50),
      description: truncate(stripHtmlDescription(issue.description), 47),
      status: normalizeStatus(issue.status),
      createdBy: issue.createdBy,
      officeId: issue.officeId,
      dateCreated: formatDate(issue.dateCreated),
      dateModified: issue.dateModified ?? null,
      votes: issue.votes ?? 0,
      comments: issue.comments ?? 0,
    }));
    setIssues(normalized);
    setTotalPages(data.totalPages ?? 1);
  };

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
        {paginatedIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClickCard={() => void handleCardClick(issue)}
          />
        ))}
      </Box>

      {/* Issue details sidebar */}
      <IssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issueOwner={
          selectedIssue !== null &&
          selectedIssue.reportedByEmail === user?.email
        }
        admin={user?.role === "ADMIN"}
        onIssueUpdated={(updated) => {
          const normalized = {
            id: updated.id,
            summary: stripHtml(updated.summary),
            description: stripHtmlDescription(updated.description),
            status: normalizeStatus(updated.status),
            createdBy: updated.createdBy,
            officeId: updated.officeId,
            dateCreated: formatDate(updated.dateCreated),
            dateModified: updated.dateModified ?? null,
            votes: updated.votes ?? 0,
            comments: updated.comments ?? 0,
          };
          setIssues((prev) =>
            prev.map((issue) => (issue.id === updated.id ? normalized : issue))
          );
          setSelectedIssue(updated);
        }}
        onIssueDeleted={(deletedId) => {
          setIssues((prev) => prev.filter((issue) => issue.id !== deletedId));
          setSelectedIssue(null);
        }}
        onRefreshIssues={() => {
          void refreshIssues();
        }}
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
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IssuesList;
