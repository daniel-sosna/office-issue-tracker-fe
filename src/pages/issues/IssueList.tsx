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
import { type Issue, IssueTab, type FetchIssuesParams } from "@data/issues";
import { useAuth } from "@context/UseAuth";
import EmployeesDropdown from "@components/EmployeesDropdown";
import { useIssues } from "@api/queries/useIssues";
import { useOffices } from "@api/queries/useOffices";
import { useVoteOnIssue } from "@api/queries/useVoteOnIssue";
import Loader from "@components/Loader";

const tabLabels = [
  "All issues",
  "Open",
  "In Progress",
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

const sortMap: Record<
  string,
  "dateDesc" | "dateAsc" | "votesDesc" | "commentsDesc"
> = {
  latest: "dateDesc",
  oldest: "dateAsc",
  mostVotes: "votesDesc",
  mostComments: "commentsDesc",
};

const IssuesList: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [page, setPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<IssueTab>(IssueTab.ALL);
  const [selectedSort, setSelectedSort] = useState<string>("latest");
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );
  const [selectedOffice, setSelectedOffice] = useState<string | undefined>(
    undefined
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>(
    undefined
  );

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

  const params: FetchIssuesParams = {
    page,
    size: 10,
    status: statusParamBackend,
    sort: sortMap[selectedSort],
    reportedBy: reportedByParam,
    office: selectedOffice,
  };

  const { data, isLoading, error } = useIssues(params);
  const { mutate: voteOnIssue } = useVoteOnIssue();

  const handleCardClick = (issue: Issue) => {
    setSelectedIssueId(issue.id);
  };

  const relativeZBox = { position: "relative", zIndex: 1 };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Box p={4}>
        <Alert severity="error">Failed to load issues.</Alert>
      </Box>
    );

  return (
    <Box sx={{ position: "relative", overflow: "hidden", px: 4 }}>
      {/* Background image */}
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
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, newValue: number) =>
            setSelectedTab(newValue as IssueTab)
          }
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
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Box display="flex" gap={2}>
          <FormControl size="small" disabled={isOfficesLoading}>
            <Select
              value={selectedOffice ?? "all"}
              sx={{
                minWidth: 140,
                borderRadius: "9999px",
                backgroundColor: "#f4f4f4",
              }}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedOffice(val === "all" ? undefined : String(val));
                setPage(1);
              }}
            >
              <MenuItem value="all">All offices</MenuItem>
              {offices.map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.title}
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
              sx={{
                minWidth: 160,
                borderRadius: "9999px",
                backgroundColor: "#f4f4f4",
              }}
              onChange={(e) => {
                setSelectedSort(e.target.value);
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
      <Box sx={relativeZBox}>
        {Array.isArray(data?.content) &&
          data.content.map((issue: Issue) => (
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
        onClose={() => setSelectedIssueId(undefined)}
        user={user!}
        onSaved={() =>
          setSnackbar({
            open: true,
            message: "Issue saved successfully!",
            severity: "success",
          })
        }
        onError={(message) =>
          setSnackbar({
            open: true,
            message,
            severity: "error",
          })
        }
      />

      {/* Pagination */}
      <Box
        display="flex"
        justifyContent="center"
        mt={5}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Pagination
          count={data?.totalPages ?? 1}
          page={page}
          onChange={(_, value: number) => setPage(value)}
          color="primary"
          hidePrevButton={page === 1}
          hideNextButton={page === (data?.totalPages ?? 1)}
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
