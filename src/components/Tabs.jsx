import { useState } from "react";

function Tabs({ setTab }) {
  const [active, setActive] = useState("Policies");

  const tabs = ["Policies", "Support", "Others", "Download"];

  const handleTab = (tab) => {
    setActive(tab);
    setTab(tab);
  };

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-btn ${active === tab ? "active-tab" : ""}`}
          onClick={() => handleTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;