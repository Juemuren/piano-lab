# Changelog

All notable changes to this project are documented in this file.

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
