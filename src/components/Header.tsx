"use client";

import React from "react";
import styles from "./Header.module.css";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function Header() {
  const { nodes, edges, syncCodebaseAST, isScanning } = useWorkspace();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoIcon}>AL</div>
        <span className={styles.title}>ArchLens</span>
        <span className="badge emerald" id="status-live-sync">
          {isScanning ? "Scanning..." : "Live Engine"}
        </span>
      </div>

      <div className={styles.controls}>
        <div className={styles.stats}>
          <span className="badge cyan" id="stat-nodes-count">Nodes: {nodes.length}</span>
          <span className="badge amber" id="stat-edges-count">Edges: {edges.length}</span>
        </div>
        <button
          className="btn-premium secondary"
          onClick={syncCodebaseAST}
          disabled={isScanning}
          id="btn-refresh-ast"
        >
          {isScanning ? "Syncing..." : "Sync AST"}
        </button>
        <button className="btn-premium primary" id="btn-export-graph">
          Blast Radius
        </button>
      </div>
    </header>
  );
}
