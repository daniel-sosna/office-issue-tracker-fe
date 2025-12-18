import { api } from "@api/services/httpClient";
import { ENDPOINTS } from "@api/services/urls";

export interface VoteOnIssueArgs {
  issueId: string;
  vote: boolean;
}

export const voteOnIssue = async ({
  issueId,
  vote,
}: VoteOnIssueArgs): Promise<void> => {
  const url = ENDPOINTS.ISSUE_VOTE.replace(":issueId", issueId);

  if (vote) {
    await api.post(url);
  } else {
    await api.delete(url);
  }
};
