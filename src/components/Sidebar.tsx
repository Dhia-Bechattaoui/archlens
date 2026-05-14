"use client";

import React from "react";
import styles from "./Sidebar.module.css";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function Sidebar() {
  const { traversalDepth, setTraversalDepth, activeFilters, toggleFilter } = useWorkspace();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>AST Depth Level</span>
        <div className={styles.sliderContainer}>
          <div className={styles.sliderHeader}>
            <label htmlFor="depth-slider">Traversal Depth</label>
            <span className="badge cyan" id="lbl-depth-val">{traversalDepth} {traversalDepth === 1 ? "Level" : "Levels"}</span>
          </div>
          <input
            type="range"
            id="depth-slider"
            min="1"
            max="5"
            value={traversalDepth}
            onChange={(e) => setTraversalDepth(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Component Filters</span>
        <div className={styles.nodeTypes}>
          <button
            className={`${styles.typeBadge} ${activeFilters.includes("services") ? styles.active : ""}`}
            onClick={() => toggleFilter("services")}
            id="filter-services"
          >
            Services
          </button>
          <button
            className={`${styles.typeBadge} ${activeFilters.includes("controllers") ? styles.active : ""}`}
            onClick={() => toggleFilter("controllers")}
            id="filter-controllers"
          >
            Controllers
          </button>
          <button
            className={`${styles.typeBadge} ${activeFilters.includes("models") ? styles.active : ""}`}
            onClick={() => toggleFilter("models")}
            id="filter-models"
          >
            Models
          </button>
          <button
            className={`${styles.typeBadge} ${activeFilters.includes("utilities") ? styles.active : ""}`}
            onClick={() => toggleFilter("utilities")}
            id="filter-utils"
          >
            Utilities
          </button>
          <button
            className={`${styles.typeBadge} ${activeFilters.includes("config") ? styles.active : ""}`}
            onClick={() => toggleFilter("config")}
            id="filter-config"
          >
            Config
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Edge Dependencies</span>
        <div className={styles.filterGroup}>
          <label className={styles.checkboxItem} htmlFor="chk-http">
            <input type="checkbox" id="chk-http" defaultChecked />
            HTTP Calls
          </label>
          <label className={styles.checkboxItem} htmlFor="chk-db">
            <input type="checkbox" id="chk-db" defaultChecked />
            Database Reads/Writes
          </label>
          <label className={styles.checkboxItem} htmlFor="chk-events">
            <input type="checkbox" id="chk-events" defaultChecked />
            Event Triggers
          </label>
        </div>
      </div>

      <div className={styles.blastRadiusBox}>
        <div className={styles.blastTitle}>
          <span className="badge amber" id="badge-sim-status">Simulation</span>
          Blast Radius Filter
        </div>
        <p className={styles.blastDesc}>
          Select a node on the canvas to instantly simulate upstream impacts and downstream trace propagation paths.
        </p>
      </div>
    </aside>
  );
}
