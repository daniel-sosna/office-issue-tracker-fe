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
import type { Issue, IssueDetails, FetchIssuesParams } from "@data/issues";
import { useIssues } from "@hooks/useIssues";
import { useOffices } from "@hooks/useOffices";
import { useAuth } from "@context/UseAuth";

const tabLabels = [
  "All issues",
  "Open",
  "Planned",
  "Resolved",
  "Closed",
  "Reported by me",
];

const statusMap: Record<
  number,
  "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | undefined
> = {
  1: "OPEN",
  2: "IN_PROGRESS",
  3: "RESOLVED",
  4: "CLOSED",
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
  const currentUserId = user?.name;

  const [page, setPage] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<string>("latest");
  const [selectedOffice, setSelectedOffice] = useState<string | undefined>(
    undefined
  );
  const [selectedIssue, setSelectedIssue] = useState<IssueDetails | null>(null);

  const { data: offices = [], isLoading: isOfficesLoading } = useOffices();

  const statusParam = statusMap[selectedTab];
  const sortParam = sortMap[selectedSort];

  const params: FetchIssuesParams = {
    page,
    size: 10,
    status: statusParam,
    sort: sortParam,
    reportedBy: selectedTab === 5 ? currentUserId : undefined,
    office: selectedOffice,
  };

  const { data, isLoading } = useIssues(params);

  const handleCardClick = (issue: Issue) => {
    setSelectedIssue({
      ...issue,
      office: "Vilnius, Lithuania",
      reportedBy: "John Doe",
      reportedByAvatar: "/src/assets/profile_placeholder.jpeg",
    });
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
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, newValue: number) => {
            setSelectedTab(newValue);
            setPage(1);
          }}
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

      {/* Filters / Sort */}
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

          <FormControl size="small" disabled>
            <Select
              value="allEmployees"
              sx={{
                minWidth: 140,
                borderRadius: "9999px",
                backgroundColor: "#f4f4f4",
              }}
            >
              <MenuItem value="allEmployees">All employees</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Sort */}
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

      {/* Issue cards */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {isLoading && <p>Loading issues…</p>}
        {!isLoading &&
          Array.isArray(data?.content) &&
          data.content.map((issue: Issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClickCard={() => handleCardClick(issue)}
            />
          ))}
      </Box>

      {/* Issue drawer */}
      <IssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
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
    </Box>
  );
};

export default IssuesList;
