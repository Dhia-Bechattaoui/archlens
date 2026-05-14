"use client";

import React, { useState, useRef } from "react";
import styles from "./GraphCanvas.module.css";

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
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  // Absolute coordinate base references enabling 100% deterministic drag mapping free of batched state drifts
  const dragStartRef = useRef<{ startX: number; startY: number; mouseStartX: number; mouseStartY: number } | null>(null);
  const panStartRef = useRef<{ startPanX: number; startPanY: number; mouseStartX: number; mouseStartY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<ASTNode[]>([
    { id: "node-api-gateway", title: "ApiGatewayController", type: "controller", x: 80, y: 100, complexity: 12, inEdges: [] },
    { id: "node-auth-service", title: "AuthenticationService", type: "service", x: 400, y: 180, complexity: 28, inEdges: ["node-api-gateway"] },
    { id: "node-user-model", title: "UserModelEntity", type: "model", x: 750, y: 120, complexity: 8, inEdges: ["node-auth-service"] },
    { id: "node-payment-service", title: "BillingEngineService", type: "service", x: 420, y: 380, complexity: 42, inEdges: ["node-api-gateway"] },
    { id: "node-ledger-model", title: "TransactionLedger", type: "model", x: 780, y: 400, complexity: 19, inEdges: ["node-payment-service"] },
  ]);

  const edges = [
    { source: "node-api-gateway", target: "node-auth-service" },
    { source: "node-auth-service", target: "node-user-model" },
    { source: "node-api-gateway", target: "node-payment-service" },
    { source: "node-payment-service", target: "node-ledger-model" },
  ];

  // Triggers isolated card grab mechanics
  const handleNodeMouseDown = (node: ASTNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggedNodeId(node.id);
    dragStartRef.current = {
      startX: node.x,
      startY: node.y,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
    };
  };

  // Triggers global background canvas panning mechanics
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Prevent trigger if clicking within card component paths
    if ((e.target as HTMLElement).closest(`.${styles.nodeShell}`)) return;
    setSelectedNodeId(null);
    setIsPanning(true);
    panStartRef.current = {
      startPanX: pan.x,
      startPanY: pan.y,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
    };
  };

  // Flawless baseline offset tracking across React batch cycles
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && dragStartRef.current) {
      const scale = zoomLevel / 100;
      const dx = (e.clientX - dragStartRef.current.mouseStartX) / scale;
      const dy = (e.clientY - dragStartRef.current.mouseStartY) / scale;

      // Capture static scalar baselines locally inside the synchronous scope closure
      // Prevents null-access errors if dragStartRef gets cleared asynchronously before setNodes runs
      const baseStartX = dragStartRef.current.startX;
      const baseStartY = dragStartRef.current.startY;

      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === draggedNodeId
            ? {
              ...n,
              x: baseStartX + dx,
              y: baseStartY + dy,
            }
            : n
        )
      );
    } else if (isPanning && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.mouseStartX;
      const dy = e.clientY - panStartRef.current.mouseStartY;

      const basePanX = panStartRef.current.startPanX;
      const basePanY = panStartRef.current.startPanY;

      setPan({
        x: basePanX + dx,
        y: basePanY + dy,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
    dragStartRef.current = null;
    panStartRef.current = null;
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 40));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setPan({ x: 0, y: 0 });
  };

  const getBezierPath = (sourceId: string, targetId: string) => {
    const sNode = nodes.find((n) => n.id === sourceId);
    const tNode = nodes.find((n) => n.id === targetId);
    if (!sNode || !tNode) return "";

    const sX = sNode.x + 220;
    const sY = sNode.y + 41;
    const tX = tNode.x;
    const tY = tNode.y + 41;

    const dx = Math.abs(tX - sX) * 0.5;
    return `M ${sX} ${sY} C ${sX + dx} ${sY}, ${tX - dx} ${tY}, ${tX} ${tY}`;
  };

  const isPathImpacted = (sourceId: string, targetId: string) => {
    if (!selectedNodeId) return false;
    return sourceId === selectedNodeId || targetId === selectedNodeId;
  };

  const scale = zoomLevel / 100;

  return (
    <div
      ref={canvasRef}
      className={styles.canvasWrapper}
      id="interactive-graph-canvas"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      style={{
        cursor: isPanning ? "grabbing" : "default",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div className={styles.ambientLighting} />
      <div className={styles.ambientLightingSecondary} />

      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          pointerEvents: "none",
        }}
      >
        {/* Explicitly enforce pointerEvents: 'none' inline so the SVG layer never steals target clicks */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4000px",
            height: "3000px",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          {edges.map((edge, idx) => {
            const impacted = isPathImpacted(edge.source, edge.target);
            const sNode = nodes.find((n) => n.id === edge.source);
            const isSourceActive = sNode?.id === selectedNodeId;

            return (
              <path
                key={idx}
                d={getBezierPath(edge.source, edge.target)}
                className={`${styles.edgePath} ${impacted ? styles.blastImpact : isSourceActive ? styles.active : ""}`}
              />
            );
          })}
        </svg>

        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "auto" }}>
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isBeingDragged = draggedNodeId === node.id;
            const isImpacted = selectedNodeId && (node.inEdges.includes(selectedNodeId) || node.id === selectedNodeId);

            let borderClass = styles.primaryService;
            if (node.type === "controller") borderClass = styles.controllerNode;
            if (node.type === "model") borderClass = styles.modelNode;

            return (
              <div
                key={node.id}
                id={node.id}
                className={`${styles.nodeShell} ${borderClass} ${isSelected || isImpacted ? styles.activeBlast : ""}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  cursor: isBeingDragged ? "grabbing" : "grab",
                  zIndex: isSelected ? 10 : isBeingDragged ? 20 : 1,
                  transition: isBeingDragged ? "none" : undefined,
                  transform: isBeingDragged ? "none" : undefined,
                }}
                onMouseDown={(e) => handleNodeMouseDown(node, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                }}
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
      </div>

      <div className={styles.canvasControls}>
        <button className={styles.iconBtn} onClick={handleZoomOut} id="btn-zoom-out" title="Zoom Out">
          -
        </button>
        <button className={styles.iconBtn} onClick={handleResetZoom} id="btn-zoom-reset" style={{ fontSize: "0.75rem" }} title="Reset Zoom / Pan">
          {zoomLevel}%
        </button>
        <button className={styles.iconBtn} onClick={handleZoomIn} id="btn-zoom-in" title="Zoom In">
          +
        </button>
      </div>
    </div>
  );
}
