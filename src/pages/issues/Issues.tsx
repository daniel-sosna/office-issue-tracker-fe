import MainLayout from "@layouts/MainLayout";
import SecondaryHeader from "@pages/issues/SecondaryHeader";
import IssueList from "@pages/issues/IssueList";

export const IssueHome = () => {
  return (
    <MainLayout>
      <SecondaryHeader />
      <IssueList />
    </MainLayout>
  );
};
