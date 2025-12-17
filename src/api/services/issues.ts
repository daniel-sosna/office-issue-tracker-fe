import {
  type Issue,
  type IssueDetails,
  type IssueStatusType,
  type IssuePage,
  IssueStatus,
} from "@data/issues";
import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

interface CreateIssuePayload {
  summary: string;
  description: string;
  officeId: string;
}

export interface CreateIssueArgs {
  issue: CreateIssuePayload;
  files?: File[];
}

export interface FetchIssuePageArgs {
  page: number;
  size: number;
  status?: string;
  reportedBy?: string;
  sort?: string;
  office?: string;
}

interface IssueResponse {
  id: string;
  summary: string;
  description: string;
  status: string;
  date: string;
  hasVoted: boolean;
  voteCount: number;
  commentCount: number | null;
}

interface IssuePageResponse {
  content: IssueResponse[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

interface IssueDetailsResponse {
  issue: IssueResponse;
  office: string;
  reportedBy: string;
  reportedByAvatar: string;
}

function mapIssueStatus(apiStatus: string): IssueStatusType {
  const map: Record<string, IssueStatusType> = {
    OPEN: IssueStatus.Open,
    IN_PROGRESS: IssueStatus.InProgress,
    RESOLVED: IssueStatus.Resolved,
    CLOSED: IssueStatus.Closed,
    BLOCKED: IssueStatus.Blocked,
  };

  return map[apiStatus] ?? IssueStatus.Open;
}

export const fetchIssueDetails = async (
  issueId: string
): Promise<IssueDetails> => {
  const { data } = await api.get<IssueDetailsResponse>(
    ENDPOINTS.ISSUE_DETAILS.replace(":issueId", issueId)
  );

  const issue: Issue = {
    id: data.issue.id,
    title: data.issue.summary,
    description: data.issue.description,
    status: mapIssueStatus(data.issue.status),
    hasVoted: data.issue.hasVoted,
    votes: data.issue.voteCount,
    comments: data.issue.commentCount ?? 0,
    date: data.issue.date,
  };

  return {
    ...issue,
    office: data.office,
    reportedBy: data.reportedBy,
    reportedByAvatar: data.reportedByAvatar,
  };
};

export const createIssue = async ({
  issue,
  files,
}: CreateIssueArgs): Promise<void> => {
  const formData = new FormData();

  formData.append(
    "issue",
    new Blob([JSON.stringify(issue)], { type: "application/json" })
  );

  (files ?? []).forEach((file) => {
    formData.append("files", file);
  });

  await api.post(ENDPOINTS.ISSUES, formData);
};

export const fetchIssues = async (
  params: FetchIssuePageArgs
): Promise<IssuePage> => {
  const { data } = await api.get<IssuePageResponse>(ENDPOINTS.ISSUES, {
    params,
  });

  const content: Issue[] = (data.content ?? []).map((issue) => ({
    id: issue.id,
    title: issue.summary,
    description: issue.description,
    status: mapIssueStatus(issue.status),
    hasVoted: issue.hasVoted,
    votes: issue.voteCount,
    comments: issue.commentCount ?? 0,
    date: issue.date,
  }));

  return {
    content,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    page: data.page,
    size: data.size,
  };
};
