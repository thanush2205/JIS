import React, { useState } from "react";
import Layout from "../components/Layout";
import ProfileSummary from "../components/ProfileSummary";

import MyAssignedCases from "../components/lawyerActions/MyAssignedCases";
import SubmitCaseReport from "../components/lawyerActions/SubmitCaseReport";
import UploadDocuments from "../components/lawyerActions/UploadDocuments";
import ViewHearingSchedule from "../components/lawyerActions/ViewHearingSchedule";

const ACTIONS = [
  "View Assigned Cases",
  "Submit Case Report",
  "Upload Documents",
  "View Hearing Schedule",
];

export default function Lawyer() {
  const [active, setActive] = useState(ACTIONS[0]);

  const renderContent = () => {
    switch (active) {
      case "View Assigned Cases":
  return <MyAssignedCases />;
      case "Submit Case Report":
        return <SubmitCaseReport />;
      case "Upload Documents":
        return <UploadDocuments />;
      case "View Hearing Schedule":
        return <ViewHearingSchedule />;
      default:
        return <p>Select an action from the sidebar.</p>;
    }
  };

  return (
    <Layout roleName="Lawyer" actions={ACTIONS} active={active} setActive={setActive}>
      <ProfileSummary />
      {renderContent()}
    </Layout>
  );
}
