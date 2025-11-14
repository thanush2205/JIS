import React, { useState } from "react";
import Layout from "../components/Layout";
import ProfileSummary from "../components/ProfileSummary";

// Import the action components
import SearchByCaseID from "../components/policeActions/SearchByCaseID";
import SubmitEvidence from "../components/policeActions/SubmitEvidence";
import RegisterFIR from "../components/policeActions/RegisterFIR";
import ViewCaseStatus from "../components/policeActions/ViewCaseStatus";

const ACTIONS = [
  "Search by Case ID",
  "Submit Evidence",
  "Register FIR/Case",
  "View Case Status",
];

export default function Police() {
  const [active, setActive] = useState(ACTIONS[0]);

  const renderAction = () => {
    switch (active) {
      case "Search by Case ID":
        return <SearchByCaseID />;
      case "Submit Evidence":
        return <SubmitEvidence />;
      case "Register FIR/Case":
        return <RegisterFIR />;
      case "View Case Status":
        return <ViewCaseStatus />;
      default:
        return <p>Select an action from the sidebar.</p>;
    }
  };

  return (
    <Layout roleName="Police" actions={ACTIONS} active={active} setActive={setActive}>
      <ProfileSummary />
      {renderAction()}
    </Layout>
  );
}
