import MainLayout from "../../layouts/MainLayout";
import SecondaryHeader from "./SecondaryHeader";
import IssueList from "./IssueList";

export const IssueHome = () => {
  return (
    <MainLayout>
      <SecondaryHeader />
      <IssueList />
    </MainLayout>
  );
};
