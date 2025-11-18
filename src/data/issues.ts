export const IssueStatus = {
  Open: "Open",
  InProgress: "In progress",
  Resolved: "Resolved",
  Closed: "Closed",
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatusType;
  votes: number;
  comments: number;
  date: string;
  reportedBy: string;
}

const baseIssues: Issue[] = [
  {
    id: 1,
    title: "Meeting rooms often fully booked",
    description:
      "Sometimes it's hard to find a free meeting room for discussions or client calls.",
    status: IssueStatus.Open,
    votes: 48,
    comments: 12,
    date: "23 Oct 2025, 11:34",
    reportedBy: "John Doe",
  },
  {
    id: 2,
    title: "Slow Wi-Fi on the 2nd floor",
    description: "Internet connection drops occasionally, slowing work.",
    status: IssueStatus.InProgress,
    votes: 4,
    comments: 2,
    date: "24 Oct 2025, 09:12",
    reportedBy: "Jane Smith",
  },
  {
    id: 3,
    title: "3rd floor printer not discoverable",
    description:
      "Printer in the third-floor hallway doesn't appear on Wi-Fi or Bluetooth sometimes.",
    status: IssueStatus.Closed,
    votes: 137,
    comments: 1,
    date: "22 Nov 2025, 15:45",
    reportedBy: "Michael Brown",
  },
  {
    id: 4,
    title: "Projector and AV setup unreliable",
    description:
      "Occasional failures during presentations; setup can be tricky at times.",
    status: IssueStatus.Resolved,
    votes: 32,
    comments: 3,
    date: "21 Nov 2025, 14:20",
    reportedBy: "Sarah Johnson",
  },
  {
    id: 5,
    title: "Parking spots limited",
    description:
      "Employees sometimes struggle to find parking near the Gdansk office.",
    status: IssueStatus.Open,
    votes: 19,
    comments: 0,
    date: "25 Oct 2025, 08:50",
    reportedBy: "Chris Lee",
  },
];

const issues: Issue[] = Array.from({ length: 190 }, (_, i) => ({
  ...baseIssues[i % baseIssues.length],
  id: i + 1,
  reportedBy: baseIssues[i % baseIssues.length].reportedBy,
}));

export default issues;
