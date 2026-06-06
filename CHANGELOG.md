# Changelog

All notable changes to this project are documented in this file.

## [0.9.0]

### Added

- Added filter effects with lowpass, highpass, bandpass, and notch types, each providing adjustable cutoff/center frequency, Q, and bandwidth parameters.
- Added equalizer effects with lowshelf, highshelf, and peaking types, each providing adjustable frequency, gain, and bandwidth parameters.
- Added reverb with separated early reflections (configurable reflection count, gain, and delay) and a late tail (exponential-decay impulse response with bathroom, garage, hall, and cathedral presets, plus adjustable delay time), using `ConvolverNode` for convolution.
- Added Plotly.js-powered magnitude response plots for the filter and equalizer combination.
- Added KaTeX and Plotly.js rendering for reverb impulse response formulas and waveforms.

### Changed

- Replaced the old transfer function module with a new effects system composed of filters, equalizers, and reverb.
- Refactored the synthesizer engine, separating `BaseVoice` and `EffectChain` from `SynthEngine`.
- Unified shared button components across the project and extracted a reusable `useElementWidth` hook.
- Extracted `PianoKey` from the `Piano` component and split the `Footer` into focused sub-components.
- Restructured i18n keys and effect component directories for clarity.
- Moved `constants` definitions into a dedicated directory and promoted `NAV_ITEMS` into shared constants.

### Fixed

- Fixed unreliable `harmonicCount` propagation in `SynthEngine`.
- Fixed incorrect navigation item order in the page header.

### Style

- Fixed `ControlCheckbox` size to prevent it from shrinking in some layouts.
- Fixed `SettingsPanel` width so it no longer changes automatically.

## [0.8.0]

### Added

- Added synthesizer audio recording with browser-supported WebM, Ogg, or MP4 export.
- Added held-note playback for piano input, so notes start on press and release naturally when the key is released.
- Added duration-aware ABC note input from piano performances, including dotted-note matching from press length, tempo, and default note length.

### Changed

- Reworked settings panel layout and shared control components for clearer grouped settings.
- Centralized ABC content, playing-note state, MIDI state, and piano input handling through contexts and focused hooks.
- Refactored the synthesizer engine around reusable start and stop note planning.

### Fixed

- Fixed native file-save dialog usage for ABC, JSON, and recorded audio exports.
- Fixed MIDI held-note press and release handling.
- Fixed incorrect first-note duration during piano input and score playback.
- Fixed release clicks at the end of notes.

## [0.7.0]

### Added

- Added computer-keyboard piano controls, including octave switching with `z` / `x` and temporary octave shifts with `ctrl` / `shift`.
- Added global settings for enabling or disabling keyboard, mouse, and touch controls.
- Added an option to append pressed piano keys back into the ABC score editor as notes.
- Added Web MIDI input support, with device status messages and browser or permission failure hints.
- Added single-device selection for MIDI input instead of always listening to every connected input.
- Added keyboard mapping hints when keyboard controls are enabled.

### Changed

- Moved the score-editor hint from the page footnote to the playback control area.
- Split piano control logic into focused hooks for keyboard, mouse/touch, and MIDI input.
- Clarified preset, spectrum, and transfer-function type naming across the synthesizer code.

### Fixed

- Fixed disabled mouse and touch controls still reacting to input.
- Fixed SVG and PNG score export.
- Fixed mobile PDF export behavior.
- Fixed browser warnings by adding IDs to all select and textarea elements.
- Disabled the unmatched-note red highlight while the underlying score-position mismatch is still being investigated.

## [0.6.0]

### Added

- Added MIDI export support for ABC scores.
- Added PDF printing support for rendered scores.
- Added playback progress controls, including pause and replay actions.
- Added a top navigation header for the score editor, sound synthesizer, keyboard, and about sections.
- Added Lucide icons across the interface.
- Added native file-save dialogs for supported browsers, with the existing download behavior kept as a fallback.

### Changed

- Made the piano keyboard consistently display the full 88-key range from A0 to C8, with horizontal scrolling for narrow screens.
- Updated the sound envelope defaults to use more practical starting values.
- Standardized i18n namespaces and adjusted related interface text.
- Unified exported filenames to use uppercase names.
- Reworked the ABC editor, export hooks, header structure, and hook directory layout.

### Fixed

- Fixed occasional keyboard-highlight failures during score playback.
- Fixed playback callback timing by using seconds instead of beats.

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
