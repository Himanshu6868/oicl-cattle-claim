import { useState } from "react";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";
import Card from "../components/Card";
import SidebarPanel from "../components/SidebarPanel";
import { useNavigate } from "react-router-dom";

import cattleIcon from "../assets/ai_enabled_cattle_claim_analytics.svg";

import "../dashboard.css";

function Dashboard() {
  const [tab, setTab] = useState("Policies");
  const navigate = useNavigate();


  const renderCards = () => {
    if (tab === "Policies") {
      return (
        <>
          <Card title="Policy Status" />
          <Card title="Claim Status" />
          <Card title="Renew Policy" />
        </>
      );
    }

    if (tab === "Support") {
      return (
        <>
          <Card title="Raise Complaint" />
          <Card title="Track Complaint" />
          <Card title="Contact Support" />
        </>
      );
    }

    if (tab === "Download") {
      return (
        <>
          <Card title="Policy Documents" />
          <Card title="Receipts" />
          <Card title="Certificates" />
        </>
      );
    }

    if (tab === "Others") {
      return (
        <>



          <Card
            title="AI Enabled Cattle Claim Analytics"
            icon={cattleIcon}
            onClick={() => navigate("/cattle-reidentification?tab=others")}
          />
        </>
      );
    }
  };

  return (
    <div>

      <Navbar />

      <div className="container">

        <div className="breadcrumb">
          Home &gt; Digital Products & Services
        </div>

        <h1>Digital Products & Services</h1>

        <Tabs setTab={setTab} />

        <div className="layout">

          <div className="cards-area">
            {renderCards()}
          </div>

          <SidebarPanel />

        </div>

      </div>

    </div>
  );
}

export default Dashboard;