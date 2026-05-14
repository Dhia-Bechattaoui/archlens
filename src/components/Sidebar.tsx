import React from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>AST Depth Level</span>
        <div className={styles.sliderContainer}>
          <div className={styles.sliderHeader}>
            <label htmlFor="depth-slider">Traversal Depth</label>
            <span className="badge cyan" id="lbl-depth-val">3 Levels</span>
          </div>
          <input
            type="range"
            id="depth-slider"
            min="1"
            max="5"
            defaultValue="3"
            className={styles.slider}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Component Filters</span>
        <div className={styles.nodeTypes}>
          <button className={`${styles.typeBadge} ${styles.active}`} id="filter-services">
            Services
          </button>
          <button className={`${styles.typeBadge} ${styles.active}`} id="filter-controllers">
            Controllers
          </button>
          <button className={`${styles.typeBadge} ${styles.active}`} id="filter-models">
            Models
          </button>
          <button className={styles.typeBadge} id="filter-utils">
            Utilities
          </button>
          <button className={styles.typeBadge} id="filter-config">
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
