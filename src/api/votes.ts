import { csrfFetch } from "@utils/csrfFetch";
import { BASE_URL, ENDPOINTS } from "./urls";

export const voteOnIssue = async (
  issueId: string,
  vote: boolean
): Promise<void> => {
  const res = await csrfFetch(
    `${BASE_URL}${ENDPOINTS.ISSUE_VOTE.replace(":issueId", issueId)}`,
    {
      method: vote ? "POST" : "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
};
