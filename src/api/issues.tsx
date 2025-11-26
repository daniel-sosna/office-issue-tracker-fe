import { csrfFetch } from "@utils/csrfFetch";

export interface IssueData {
  summary: string;
  description: string;
  officeId: string;
}

export const createIssue = async (issue: IssueData): Promise<void> => {
  const res = await csrfFetch("http://localhost:8080/issues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issue),
  });

  if (!res.ok) {
    throw new Error("Failed to submit the issue");
  }

  await res.json();
};
