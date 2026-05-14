import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GraphCanvas from "@/components/GraphCanvas";

export default function Home() {
  return (
    <div className="app-container">
      {/* Background ambient glow keyframe layers */}
      <div className="ambient-glow" style={{ top: "-10%", left: "-5%", width: "40vw", height: "40vw", background: "rgba(0, 240, 255, 0.08)" }} />
      <div className="ambient-glow" style={{ bottom: "-10%", right: "-5%", width: "50vw", height: "50vw", background: "rgba(189, 0, 255, 0.05)" }} />

      <div className="workspace-shell">
        {/* Navigation Header */}
        <Header />

        {/* Central Workspace Shell Area containing Sidebar controls and Interactive Canvas */}
        <div className="main-content-area">
          <Sidebar />
          <GraphCanvas />
        </div>
      </div>
    </div>
  );
}
