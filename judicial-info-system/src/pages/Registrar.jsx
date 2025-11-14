import React, { useState } from "react";
import Layout from "../components/Layout";
import ProfileSummary from "../components/ProfileSummary";

// Import action components
import RegisterNewCase from "../components/registrarActions/RegisterNewCase";
import UpdateCaseInfo from "../components/registrarActions/UpdateCaseInfo";
import ApproveCaseFiles from "../components/registrarActions/ApproveCaseFiles";
import AssignCaseToJudge from "../components/registrarActions/AssignCaseToJudge";
import ManageCourtSchedule from "../components/registrarActions/ManageCourtSchedule";
import CaseDetailProposals from "../components/registrarActions/CaseDetailProposals";
import ManageUsers from "../components/registrarActions/ManageUsers";
import ActivityLog from "../components/registrarActions/ActivityLog";
import ViewAllCases from "../components/registrarActions/ViewAllCases";

const ACTIONS = [
  "Register New Case",
  "View All Cases",
  "Update Case Information",
  "Approve Case Files",
  "Assign Case to Judge",
  "Manage Court Schedule",
  "Manage Users",
  "Activity Log",
  "Case Detail Requests",
];

export default function Registrar() {
  const [active, setActive] = useState(ACTIONS[0]);

  const renderAction = () => {
    switch (active) {
      case "Register New Case":
        return <RegisterNewCase />;
      case "View All Cases":
        return <ViewAllCases />;
      case "Update Case Information":
        return <UpdateCaseInfo />;
      case "Approve Case Files":
        return <ApproveCaseFiles />;
      case "Assign Case to Judge":
        return <AssignCaseToJudge />;
      case "Manage Court Schedule":
        return <ManageCourtSchedule />;
      case "Manage Users":
        return <ManageUsers />;
      case "Activity Log":
        return <ActivityLog />;
      case "Case Detail Requests":
        return <CaseDetailProposals />;
      default:
        return <p>Select an action from the sidebar.</p>;
    }
  };

  return (
    <Layout roleName="Registrar" actions={ACTIONS} active={active} setActive={setActive}>
      <ProfileSummary />
      {renderAction()}
    </Layout>
  );
}
