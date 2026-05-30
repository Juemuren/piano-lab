# Changelog

All notable changes to this project are documented in this file.

## [0.5.0]

### Added

- Added import and export support for ABC notation files.
- Added export support for rendered scores as downloadable images.
- Added additional built-in score presets.
- Added import and export support for synthesizer configurations.
- Added a plotted preview for the sound envelope curve.

### Changed

- Reworked the sound synthesizer UI around clearer envelope, harmonic spectrum, and transfer-function sections.
- Moved oscillator type and volume controls into the shared sound synthesizer controls.
- Updated envelope and harmonic spectrum descriptions for clearer terminology.
- Standardized ABC-related naming as `Abc` across the codebase.

### Fixed

- Fixed the initial size adjustment for the sound envelope preview.

### Maintenance

- Added build-time generation for ABC preset metadata.
- Added a version-setting script and reorganized release helper scripts.
- Refactored score playback, rendered score export, file import/export, and synthesizer state handling into shared hooks and services.
- Renamed the audio engine service directory to `synth` and provided synthesizer context management.

## [0.4.0]

### Added

- Added KaTeX-powered formula rendering for timbre presets and transfer-function responses.
- Added a harmonic count control that drives timbre and transfer-function previews.
- Added pitch-based base-frequency selection for transfer-function previews.
- Added localized labels and hints for the new harmonic count and base-frequency controls.

### Changed

- Made transfer-function magnitude and phase response previews collapsible.
- Updated timbre and transfer-function controls to use shared default constants.
- Improved responsive layout, footer styling, dark-mode colors, and ABC score editor styling.
- Updated README formula documentation and fixed the article URL.

### Fixed

- Fixed UI overflow when using larger harmonic counts.
- Fixed mathematical notation for the normal timbre preset and transfer-function phase formulas.
- Fixed the blog article link in the app footer.

### Maintenance

- Added `react-katex`, `katex`, and related typings for math rendering.
- Added a `patch-package` workaround for the KaTeX lexer issue triggered by Vite.
- Refactored pitch naming and pitch option generation into shared utilities.
- Standardized component declarations, exports, and i18n constant naming.

## [0.3.0]

### Added

- Added Japanese localization for the app interface.
- Added English and Japanese README documents under `docs/`.
- Added language links to the root README.
- Added this changelog.

### Changed

- Refactored language switcher labels out of duplicated locale JSON entries.
- Centralized language display names in the i18n settings.
- Updated the release workflow to use only the changelog section for the current tag as the release body.

## [0.2.0]

### Added

- Added i18n configuration for `en-US`.

### Changed

- Improved release workflow for building tauri app.

## [0.1.1]

### Added

- Added the web piano simulator with physical sound synthesis based on the Web Audio API.
- Added harmonic synthesis with adjustable ADSR-style envelope parameters.
- Added timbre presets and custom timbre adjustment.
- Added transfer-function presets with magnitude and phase response controls.
- Added an ABC Notation score editor with rendering, playback, presets, and visual feedback.
- Added responsive layout and dark-mode support.
