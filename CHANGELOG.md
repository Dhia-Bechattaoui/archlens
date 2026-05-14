# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-05-14

### Fixed
- Fixed SVG overlay bounding box layer intercepting DOM background click gestures by setting explicit inline `pointerEvents: "none"`.
- Resolved `handleNodeMouseDown` signature mismatch type error by supplying full React component target representations.
- Eliminated runtime null-access reference exceptions during quick overlapping card dragging cycles by capturing original position baselines locally inside synchronous event scope closures.

## [0.1.0] - 2026-05-14

### Added
- Fully reactive state-driven client Graph Engine supporting persistent node positions.
- Live mouse move listeners mapping absolute offsets to custom scaled coordinate arrays.
- Interactive background canvas click-to-pan dragging matrix (`translate/scale`).
- Automatic real-time recalculation of SVG cubic bezier curved dependency routing lines.
- Dynamic localized trace validation targeting explicit blast-radius focus paths.

## [0.0.1] - 2026-05-14

### Added
- Initial foundation scaffolding using Next.js App Router with pinned framework dependencies.
- Sleek dark mode styling system (`globals.css`) integrating custom gradient tokens, glassmorphism panel containers, and ambient matrix canvas lighting.
- Integrated premium typography scaling options via Google Fonts (`Inter` and `Outfit`).
- Structural navigation `Header` component housing real-time dynamic AST metrics and trigger options.
- Decoupled `Sidebar` controls container accommodating custom AST depth traversal level sliders and component type pickers.
- Central interactive `GraphCanvas` interface previewing mock workspace AST node components and hardware-accelerated SVG dependency flow links.
- Interactive click-state blast radius logic highlighting upstream paths and downstream propagation paths.

[0.1.1]: https://github.com/dhia/archlens/releases/tag/v0.1.1
[0.1.0]: https://github.com/dhia/archlens/releases/tag/v0.1.0
[0.0.1]: https://github.com/dhia/archlens/releases/tag/v0.0.1
