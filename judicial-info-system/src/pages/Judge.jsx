import React, { useState } from "react";
import Layout from "../components/Layout";
import styles from "./Judge.module.css";
import ProfileSummary from "../components/ProfileSummary";

import ViewCaseDetails from "../components/judgeActions/ViewCaseDetails";
import AssignLawyer from "../components/judgeActions/AssignLawyer";
import ScheduleHearing from "../components/judgeActions/ScheduleHearing";
import ReviewEvidence from "../components/judgeActions/ReviewEvidence";
import MyAssignedCases from "../components/judgeActions/MyAssignedCases";
import DeliverJudgement from "../components/judgeActions/DeliverJudgement";

const ACTIONS = [
  "My Assigned Cases", // default first
  "View Case Details",
  "Assign Lawyer",
  "Schedule Hearing",
  "Review Evidence",
  "Deliver Judgement",
];

export default function Judge() {
  // Default to My Assigned Cases
  const [active, setActive] = useState("My Assigned Cases");

  const renderContent = () => {
    switch (active) {
      case "View Case Details":
        return <ViewCaseDetails />;
      case "My Assigned Cases":
        return <MyAssignedCases />;
      case "Assign Lawyer":
        return <AssignLawyer />;
      case "Schedule Hearing":
        return <ScheduleHearing />;
      case "Review Evidence":
        return <ReviewEvidence />;
      case "Deliver Judgement":
        return <DeliverJudgement />;
      default:
        return <div>Select an action</div>;
    }
  };

  return (
    <Layout roleName="Judge" actions={ACTIONS} active={active} setActive={setActive}>
      <ProfileSummary />
      <div className={styles.main}>
        <h2 className={styles.heading}>{active}</h2>
        <div className={styles.placeholder}>{renderContent()}</div>
      </div>
    </Layout>
  );
}
