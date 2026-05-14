"use client";

import React, { useState } from "react";
import styles from "./GraphCanvas.module.css";

// Interface for mock client-side nodes representing parsed AST components
interface ASTNode {
  id: string;
  title: string;
  type: "service" | "controller" | "model";
  x: number;
  y: number;
  complexity: number;
  inEdges: string[];
}

export default function GraphCanvas() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-auth-service");
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Mock static demonstration nodes loaded from system AST representation
  const initialNodes: ASTNode[] = [
    { id: "node-api-gateway", title: "ApiGatewayController", type: "controller", x: 120, y: 80, complexity: 12, inEdges: [] },
    { id: "node-auth-service", title: "AuthenticationService", type: "service", x: 380, y: 160, complexity: 28, inEdges: ["node-api-gateway"] },
    { id: "node-user-model", title: "UserModelEntity", type: "model", x: 680, y: 120, complexity: 8, inEdges: ["node-auth-service"] },
    { id: "node-payment-service", title: "BillingEngineService", type: "service", x: 420, y: 380, complexity: 42, inEdges: ["node-api-gateway"] },
    { id: "node-ledger-model", title: "TransactionLedger", type: "model", x: 740, y: 400, complexity: 19, inEdges: ["node-payment-service"] },
  ];

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(selectedNodeId === id ? null : id);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoomLevel(100);

  // Helper function to check if an edge is active or impacted by the simulated blast radius
  const isEdgeImpacted = (sourceId: string, targetId: string) => {
    if (!selectedNodeId) return false;
    // Trace propagation paths mock logic
    return sourceId === selectedNodeId || targetId === selectedNodeId;
  };

  return (
    <div className={styles.canvasWrapper} id="interactive-graph-canvas" onClick={() => setSelectedNodeId(null)}>
      {/* Ambient lighting overlays */}
      <div className={styles.ambientLighting} />
      <div className={styles.ambientLightingSecondary} />

      {/* SVG Container for dynamic edge line overlays */}
      <svg className={styles.connectionsOverlay}>
        {/* Connection: Gateway -> Auth */}
        <path
          d="M 230 110 C 300 110, 300 180, 380 180"
          className={`${styles.edgePath} ${isEdgeImpacted("node-api-gateway", "node-auth-service") ? styles.blastImpact : styles.active}`}
        />
        {/* Connection: Auth -> UserModel */}
        <path
          d="M 600 180 C 640 180, 640 140, 680 140"
          className={`${styles.edgePath} ${isEdgeImpacted("node-auth-service", "node-user-model") ? styles.blastImpact : ""}`}
        />
        {/* Connection: Gateway -> Payment */}
        <path
          d="M 230 120 C 300 120, 320 400, 420 400"
          className={`${styles.edgePath} ${isEdgeImpacted("node-api-gateway", "node-payment-service") ? styles.blastImpact : ""}`}
        />
        {/* Connection: Payment -> Ledger */}
        <path
          d="M 640 400 C 690 400, 690 420, 740 420"
          className={`${styles.edgePath} ${isEdgeImpacted("node-payment-service", "node-ledger-model") ? styles.blastImpact : ""}`}
        />
      </svg>

      {/* Render AST Workspace Nodes */}
      <div style={{ width: "100%", height: "100%", position: "absolute", transform: `scale(${zoomLevel / 100})`, transition: "transform 0.2s ease-out", transformOrigin: "center center" }}>
        {initialNodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isImpacted = selectedNodeId && (node.inEdges.includes(selectedNodeId) || node.id === selectedNodeId);

          let borderClass = styles.primaryService;
          if (node.type === "controller") borderClass = styles.controllerNode;
          if (node.type === "model") borderClass = styles.modelNode;

          return (
            <div
              key={node.id}
              id={node.id}
              className={`${styles.nodeShell} ${borderClass} ${isSelected || isImpacted ? styles.activeBlast : ""}`}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              onClick={(e) => handleNodeClick(node.id, e)}
            >
              <div className={styles.nodeHeader}>
                <span className={styles.nodeTitle} title={node.title}>
                  {node.title}
                </span>
                <span className={`badge ${node.type === "service" ? "cyan" : node.type === "controller" ? "amber" : "emerald"}`}>
                  {node.type.substring(0, 4)}
                </span>
              </div>
              <div className={styles.nodeMetrics}>
                <span>Complexity: <strong>{node.complexity}</strong></span>
                {isSelected && <span className={styles.impactBadge}>Blast Root</span>}
                {isImpacted && !isSelected && <span className={styles.impactBadge}>Impacted</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Floating Zoom & Controls Box */}
      <div className={styles.canvasControls}>
        <button className={styles.iconBtn} onClick={handleZoomOut} id="btn-zoom-out" title="Zoom Out">
          -
        </button>
        <button className={styles.iconBtn} onClick={handleResetZoom} id="btn-zoom-reset" style={{ fontSize: "0.75rem" }} title="Reset Zoom">
          {zoomLevel}%
        </button>
        <button className={styles.iconBtn} onClick={handleZoomIn} id="btn-zoom-in" title="Zoom In">
          +
        </button>
      </div>
    </div>
  );
}
