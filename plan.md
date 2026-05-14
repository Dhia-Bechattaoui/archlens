# ArchLens: Visual System Architecture Platform

## 1. Project Overview
**ArchLens** is a premium, interactive web application designed to eliminate developer cognitive load by visually mapping complex software systems. It connects to a codebase and renders a beautiful, interactive node graph of components, services, and API interactions, enabling real-time simulation of code change "blast radius".

## 2. Core Architecture & Philosophy
- **Framework:** Premium Web Application (React/Next.js or Angular).
- **Styling:** Highly polished aesthetics featuring dark mode, glassmorphism, smooth animations, and curated color palettes.
- **Design Pattern:** Local parser daemon backend feeding a hardware-accelerated frontend graph visualization canvas.

## 3. Directory Structure
```text
archlens/
├── .agents/
│   ├── rules/          # Architectural guidelines and aesthetic standards
│   └── workflows/      # Automated deployment and verification pipelines
├── src/
│   ├── app/            # Next.js App Router root layout and primary styles
│   └── components/     # High-polish decoupled UI shell elements (Header, Sidebar, GraphCanvas)
└── plan.md             # Living architecture document
```

## 4. Implementation Phases

### Phase 1: Foundation & Scaffolding [COMPLETED]
- [x] Initialize base application and UI framework system using Next.js 16 pinned dependencies.
- [x] Establish core design tokens (sleek dark mode, curated vibrant contrast accents, custom typography).
- [x] Scaffold glassmorphic UI panels and structural interface shells (Header, Sidebar, GraphCanvas).
- [x] Verify production build runs warning-free and optimized.

### Phase 2: Graph Engine Integration [COMPLETED]
- [x] Integrate interactive node visualization canvas supporting direct dynamic references.
- [x] Implement real-time drag math, viewport matrix panning, and animated bezier blast-radius vectors.

### Phase 3: Parsing & Backend Synchronization
- [ ] Build local AST/dependency mapping server to feed dynamic live repository models.

## 5. Implementation Log
- **2026-05-14**: Verified working directory path (`archlens`), non-interactively generated foundation with Next.js App Router, configured rich visual aesthetics via `globals.css` base design tokens, assembled decoupled interactive canvas shell elements, pinned standard dependencies cleanly, and validated error-free compilation.
- **2026-05-14 (Phase 2)**: Integrated fully reactive client-side Graph Engine inside `GraphCanvas.tsx`. Implemented live absolute coordinate mouse dragging updates, viewport matrix panning (`translate/scale`), automatic SVG cubic bezier path routing vectors, and direct localized blast-radius trace validation.
