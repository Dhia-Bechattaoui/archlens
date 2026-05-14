# ArchLens

ArchLens is a visual architecture dashboard designed to help developers map complex software systems into interactive node graphs, reducing context switching and cognitive load during system refactoring.

## Overview

Large codebases often suffer from hidden dependencies and complex blast radiuses. ArchLens addresses this by parsing localized abstract syntax trees (ASTs) to construct deterministic, interactive dependency graphs. This allows engineering teams to visualize services, controllers, and database interactions, previewing the exact scope of proposed changes before committing code.

## Features

- **Interactive System Mapping:** Render dynamic dependency layouts of workspace controllers, models, and service classes.
- **Blast Radius Simulation:** Select specific target nodes to instantly highlight upstream callers and downstream dependencies via animated connection vectors.
- **Custom Traversal Depth:** Fine-tune AST extraction limits and filter out specific module layers (e.g., config, utilities) directly from the sidebar interface.
- **Polished Dark UI:** Optimized low-contrast canvas with high-performance CSS hardware acceleration and clear layout boundaries.

## Getting Started

### Requirements
- Node.js v18 or later
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Navigate to [http://localhost:3000](http://localhost:3000) to inspect the workspace canvas.

## Documentation

- **Implementation Roadmap:** Detailed design boundaries and upcoming execution milestones are tracked in [plan.md](./plan.md).
- **Release History:** Version progression and component updates are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
