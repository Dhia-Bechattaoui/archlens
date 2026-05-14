import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoIcon}>AL</div>
        <span className={styles.title}>ArchLens</span>
        <span className="badge emerald" id="status-live-sync">Live Engine</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.stats}>
          <span className="badge cyan" id="stat-nodes-count">Nodes: 142</span>
          <span className="badge amber" id="stat-edges-count">Edges: 328</span>
        </div>
        <button className="btn-premium secondary" id="btn-refresh-ast">
          Sync AST
        </button>
        <button className="btn-premium primary" id="btn-export-graph">
          Blast Radius
        </button>
      </div>
    </header>
  );
}
