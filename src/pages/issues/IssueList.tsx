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
import { type Issue, type IssueStats, IssueTab } from "@data/issues";
import { useAuth } from "@context/UseAuth";
import EmployeesDropdown from "@components/EmployeesDropdown";
import { useIssues } from "@api/queries/useIssues";
import { useOffices } from "@api/queries/useOffices";
import { useVoteOnIssue } from "@api/queries/useVoteOnIssue";
import Loader from "@components/Loader";
import { type FrontendSortKey } from "@api/services/issues";
import { formatOffice } from "@utils/formatters";

const tabLabels = [
  "All issues",
  "Open",
  "In progress",
  "Resolved",
  "Closed",
  "Reported by me",
] as const;

const tabStatuses: Record<
  IssueTab,
  "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | undefined
> = {
  [IssueTab.ALL]: undefined,
  [IssueTab.OPEN]: "OPEN",
  [IssueTab.PLANNED]: "IN_PROGRESS",
  [IssueTab.RESOLVED]: "RESOLVED",
  [IssueTab.CLOSED]: "CLOSED",
  [IssueTab.REPORTED_BY_ME]: undefined,
};

const IssuesList: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [page, setPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<IssueTab>(IssueTab.ALL);
  const [selectedSort, setSelectedSort] = useState<FrontendSortKey>("latest");
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );
  const [selectedOffice, setSelectedOffice] = useState<string | undefined>(
    undefined
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>(
    undefined
  );
  const [selectedIssueStats, setSelectedIssueStats] = useState<
    IssueStats | undefined
  >(undefined);

  const { data: offices = [], isLoading: isOfficesLoading } = useOffices();

  useEffect(() => {
    if (selectedTab === IssueTab.REPORTED_BY_ME && currentUserId) {
      setSelectedUser(currentUserId);
    } else if (selectedTab !== IssueTab.REPORTED_BY_ME) {
      setSelectedUser(undefined);
    }
    setPage(1);
  }, [selectedTab, currentUserId]);

  const reportedByParam =
    selectedTab === IssueTab.REPORTED_BY_ME ? currentUserId : selectedUser;
  const statusParamBackend = tabStatuses[selectedTab];

  const apiParams = {
    page,
    size: 10,
    status: statusParamBackend,
    reportedBy: reportedByParam,
    sort: selectedSort,
    officeId: selectedOffice,
  };

  const { data, isLoading, error } = useIssues(apiParams);
  const issues = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { mutate: voteOnIssue } = useVoteOnIssue();

  const handleCardClick = (issue: Issue) => {
    setSelectedIssueId(issue.id);
    setSelectedIssueStats({ ...issue });
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const pillSelectStyle = {
    borderRadius: "9999px",
    backgroundColor: "#f4f4f4",
    fontSize: 16,
    minWidth: 160,
    "& .MuiOutlinedInput-root": {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      boxSizing: "border-box",
    },
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      minHeight: "inherit",
    },
    "& fieldset": { borderRadius: "9999px" },
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Box p={4}>
        <Alert severity="error">Failed to load issues.</Alert>
      </Box>
    );

  return (
    <Box sx={{ position: "relative" }}>
      {/* Tabs */}
      <Box
        mb={3}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, newValue: number) =>
            setSelectedTab(newValue as IssueTab)
          }
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            cursor: "pointer",
            "& .MuiTabs-indicator": {
              backgroundColor: "#78ece8",
              boxShadow: "0 0 8px rgba(40,203,221,0.3)",
            },
            "& .MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
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
        flexWrap="wrap"
        justifyContent="space-between"
        gap={2}
        mb={4}
      >
        <Box display="flex" gap={2}>
          <FormControl size="small" disabled={isOfficesLoading}>
            <Select
              value={selectedOffice ?? "all"}
              sx={{ ...pillSelectStyle }}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedOffice(val === "all" ? undefined : String(val));
                setPage(1);
              }}
            >
              <MenuItem value="all">All offices</MenuItem>
              {offices.map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {formatOffice(office)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <EmployeesDropdown
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setPage={setPage}
            selectedTab={selectedTab}
            setSelectedTab={(tab: number) => setSelectedTab(tab as IssueTab)}
            currentUserId={currentUserId}
            disabled={selectedTab === IssueTab.REPORTED_BY_ME}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <InputLabel sx={{ fontSize: 14, color: "text.secondary" }}>
            Sort by:
          </InputLabel>
          <FormControl size="small">
            <Select
              value={selectedSort}
              sx={{ ...pillSelectStyle }}
              onChange={(e) => {
                setSelectedSort(e.target.value as FrontendSortKey);
                setPage(1);
              }}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="mostVotes">Most votes</MenuItem>
              <MenuItem value="mostComments">Most comments</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Issue Cards */}
      <Box>
        {issues.map((issue) => (
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

      {/* Issue drawer */}
      <IssueDrawer
        issueId={selectedIssueId}
        issueStats={selectedIssueStats}
        onClose={() => setSelectedIssueId(undefined)}
        onCommentCreated={() =>
          setSelectedIssueStats((prev) =>
            prev ? { ...prev, comments: prev.comments + 1 } : prev
          )
        }
        onSaved={() =>
          setSnackbar({
            open: true,
            message: "Issue saved successfully!",
            severity: "success",
          })
        }
        onError={(message) =>
          setSnackbar({ open: true, message, severity: "error" })
        }
      />

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={5}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value: number) => setPage(value)}
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
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default IssuesList;
