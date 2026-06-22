# Changelog

All notable changes to this project are documented in this file.

## [1.3.0]

### Added

- Added configurable keyboard mappings for piano note keys.
- Added configurable permanent and temporary octave up/down keyboard shortcuts.
- Added an option to hide keyboard mapping hints on piano keys.
- Added octave keyboard hints below piano keys, including updates when temporary octave shortcuts are held.

### Changed

- Improved keyboard mapping settings layout on narrow screens.
- Shortened special key labels shown on piano keys.
- Moved keyboard control settings logic into a dedicated hook.
- Simplified keyboard mapping types and constants.

### Fixed

- Fixed note keyboard mappings being unable to select `Shift` or `Ctrl`.
- Fixed permanent octave shortcuts being unable to replace existing bindings directly.

### Style

- Corrected the built-in Yosuga no Sora score key to B minor.
- Extended lint rules.

### Docs

- Updated editor configuration examples.
- Synced translations.

## [1.2.0]

### Added

- Added a built-in ABC score preset.
- Added Baidu Analytics configuration for the deployed site.

### Changed

- Switched TypeScript project checking from `tsc --build` to `tsgo --build`.
- Extended Biome rules and assists for TypeScript, TSX, JSON, and HTML files.
- Extracted repeated section icons into a shared component.
- Moved `HarmonicLabel` into the sound synthesizer component directory.

### Fixed

- Fixed the wide-screen layout breaking when the harmonic count is increased.

### Style

- Reordered the sound synthesizer spectrum and envelope sections.
- Updated sound synthesizer section icons to reflect volume and harmonic controls.
- Added icons to footer links.
- Reduced the border radius of select controls.
- Standardized component props declarations to use interfaces.

## [1.1.0]

### Changed

- Renamed tremolo and vibrato internals and UI text to amplitude modulation and frequency modulation for clearer terminology.
- Updated modulation formulas to use physically meaningful variable symbols.
- Updated the envelope formula description and preview labels.
- Improved the Gaussian random number generator used by the reverb late tail.
- Moved Plotly type declarations into project types to reduce patch-package usage.
- Migrated code formatting and linting from ESLint/Prettier to Biome.
- Reduced pre-commit hook work to type checking and adjusted related npm scripts.

### Fixed

- Fixed the effect chain causing audio to disappear when multiple effects were enabled and reverb settings were changed.
- Fixed Vite/Rolldown resolution errors caused by Biome's inline type imports by using separated type imports.
- Fixed the `typecheck` npm script.

### Style

- Improved page and shared control styling.
- Improved range input styling across browsers, including disabled states.
- Improved checkbox styling.
- Cleared previous spectrum and reverb preset parameters when switching to custom settings.
- Added missing titles to remove browser warnings.

### Docs

- Updated README documentation and translations.
- Fixed GitHub README formula rendering issues.
- Added VSCode recommended extensions and settings examples.

## [1.0.0]

### Added

- Added modulation effects with four types: amplitude modulation (tremolo), frequency modulation (vibrato), phase modulation (phaser), and delay modulation (chorus/flanger), each providing adjustable frequency and depth parameters, formula display, and modulation curve preview.
- Added adjustable phase parameter for each early reflection in the reverb effect, allowing gain sign inversion.
- Added Gaussian noise (Box-Muller transform) for the late tail random phase in reverb, producing a more uniform positive/negative impulse distribution.
- Added key signature and time signature handling to score auto-generation.
- Added automatic line breaking to score auto-generation.
- Added reset-to-default and clear-score buttons in the score auto-generation panel.
- Added custom keyboard mapping for piano control, allowing each note offset to be bound to any single key.
- Added persistent global settings via `localStorage`, so keyboard mappings and control preferences are preserved across sessions.

### Changed

- Split the Modulation component into focused sub-components for each modulation type.
- Extracted a shared DEG-to-RAD conversion utility.
- Removed hardcoded colors in the audio analysis module.
- Reorganized i18n keys for modulation and reverb, and completed all translations.
- Made default note length and tempo respect `abcContent` header values first.

### Fixed

- Fixed broadband transient popping when rapidly pressing different piano keys, caused by unreliable `GainNode.gain.value` jumps during fast attack/decay transitions.
- Fixed frequency-domain analysis plot overflowing the canvas.
- Fixed the pitch bend formula description in documentation.

### Style

- Adjusted key mapping settings layout for better usability.
- Added and updated icons throughout the interface, including modulation and reverb sections.
- Made keyboard control settings disabled by default.
- Updated footer background color.
- Reduced `ControlSelect` padding.
- Adjusted analysis module layout for a cleaner frequency/time-domain display.
- Arranged reverb early reflection parameters horizontally on wide screens.
- Wrapped modulation effects in a collapsible details section.

### Docs

- Added app description to the page footer footnote.
- Completed missing i18n entries across all locales.
- Updated README and TODO documents.

## [0.10.0]

### Added

- Added compressor effect with adjustable threshold, knee, ratio, attack, and release, plus a real-time gain reduction plot.
- Added stereo panner effect with 3D sound cone visualization, distance gain curve, configurable inner/outer cone angles, and distance model.
- Added wave shaper effect with saturation, overdrive, distortion, and fuzz types, each providing an adjustable intensity parameter and transfer curve preview.
- Added audio analysis module with real-time frequency-domain (FFT) and time-domain waveform displays using `AnalyserNode`.
- Added reverb enable/disable toggle.
- Added KaTeX formula rendering for the envelope curve and spectrum presets.

### Changed

- Refactored the color scheme using the Catppuccin palette — Latte for light theme and Mocha for dark theme.
- Renamed synth service files for clarity: `BaseVoice` → `BasicVoice`, `EffectResponse` → `Filter`, `ReverbImpulse` → `Reverb`, `SynthDefinitions` → `Spectrum`, `SynthCalculations` → `VoicePlanner`.
- Split `SynthConfig` into focused `Defaults`, `Options`, and `Normalize` modules.
- Split `useEffectControl` into dedicated per-effect hooks.
- Extracted a shared `Plot2D` component (renamed from `Scatter`) and moved type declarations into the `patches` directory.
- Moved `Filter` and `Reverb` into a `services/synth/effect` subdirectory.
- Extracted `Compressor` into its own subdirectory with the reduction preview.
- Extracted `EarlyReflections` and `LateTail` as focused sub-components from the `Reverb` component.
- Shortened component names by removing the `Effect` prefix in `FilterAndEqualizer`.
- Made sub-hooks receive explicit initial values instead of resolving defaults internally.
- Moved ABC-related calculation functions into `services/abc` and renamed `AbcPlaybackCalculations` to `AbcCalculations`.

### Fixed

- Fixed reverb volume becoming too low at high mix ratios by adding a direct signal path and disabling `ConvolverNode` normalization.
- Fixed reverb amplitude gain in presets to avoid overly prominent early reflections.
- Fixed `Select` element colors after the Catppuccin style refactoring.
- Fixed sound cone sphere size discontinuity in the panner spatial preview.
- Fixed panner spatial preview failing to render sphere geometry above 180 degrees.
- Fixed sound cone aspect ratio distortion by matching X and Y axis ranges.
- Fixed compressor enable/disable button text.
- Fixed the envelope curve to correctly match the ADSR formula, and added variable symbols.
- Fixed `BlockMath` formula overflow on mobile by wrapping content in a scrollable container.

### Style

- Adopted the Catppuccin color scheme (Latte for light theme, Mocha for dark theme) across all components.
- Adjusted Plotly marker sizes for a better mobile experience.
- Adjusted wave shaper preset order and formula position.
- Added labels to `Select` components for ABC presets, reverb presets, spectrum presets, and the synth oscillator type.
- Made panner settings collapsible.
- Removed display normalization for reverb and adjusted late-tail amplitude and decay for each preset.

### Chore

- Changed the project domain to `piano.raind.me`.
- Removed stale and out-of-scope TODO items.

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
