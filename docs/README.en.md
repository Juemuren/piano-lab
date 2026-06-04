<div align="center">

# Piano Lab

[中文](../README.md) | [English](README.en.md) | [日本語](README.jp.md)

[![action-deploy][badge-action-deploy]][link-action-deploy]
[![action-release][badge-action-release]][link-action-release]

[![website][badge-website]][link-website]
[![release][badge-release]][link-release]
[![license][badge-license]](../LICENSE)

[badge-action-deploy]: https://github.com/Juemuren/piano-lab/actions/workflows/deploy.yml/badge.svg
[badge-action-release]: https://github.com/Juemuren/piano-lab/actions/workflows/release.yml/badge.svg
[badge-website]: https://img.shields.io/badge/website-github.io-green
[badge-release]: https://img.shields.io/github/release/Juemuren/piano-lab
[badge-license]: https://img.shields.io/github/license/Juemuren/piano-lab
[link-action-deploy]: https://github.com/Juemuren/piano-lab/actions/workflows/deploy.yml
[link-action-release]: https://github.com/Juemuren/piano-lab/actions/workflows/release.yml
[link-website]: https://Juemuren.github.io/piano-lab/
[link-release]: https://github.com/Juemuren/piano-lab/releases

</div>

## Features

Piano Lab provides interactive virtual keys, a sound synthesizer, and a score editor:

- [Sound Synthesizer](#sound-synthesizer): customize the sound envelope, harmonic spectrum, and transfer function, record audio, and export in formats such as WebM and MP4
- [Score Editor](#score-editor): write scores in ABC Notation, render them in real time, play them automatically, and export them as SVG/PNG/PDF/MIDI files
- [Virtual Keys](#virtual-keys): provides the full 88-key range from A0 to C8 and supports performance with a mouse, touchscreen, computer keyboard, and MIDI input devices

The app supports multiple languages, mobile layouts, dark mode, and can be installed as a [desktop app][link-release].

### Sound Synthesizer

The sound synthesizer consists of three modules: envelope, spectrum, and transfer function.

- Synthesizes sound physically without sampling
- Uses twelve-tone equal temperament to generate pitches and supports free transposition
- Supports sine, triangle, sawtooth, and square waves
- Supports adjusting the volume factor and harmonic count
- All configurations can be exported as JSON files for sharing and reuse
- Can record synthesizer output and export it as WebM/Ogg/MP4 audio depending on browser support

### Envelope

- Supports editing attack time, decay time, release time, sustain gain, and silence gain
- Provides an amplitude envelope curve preview

### Spectrum

- Allows fully custom harmonic amplitudes
- Provides several presets and can display the corresponding mathematical formulas

### Transfer Function

- Provides presets with adjustable parameters
- Can preview amplitude and phase changes for different harmonics
- Supports choosing a specific fundamental frequency or pitch when previewing

### Score Editor

- Write scores as text and render them in real time
- Play scores automatically with visual feedback on both the score and keyboard
- Supports play, pause, replay, and progress adjustment by moving the control bar or clicking notes
- Adjust tempo, meter, and key signature; chords, repeats, and multiple voices are supported
- Pressing piano keys can directly edit the score and match note lengths from how long keys are held, making it easier to record melodies
- Supports importing and exporting ABC files
- Supports exporting MIDI files
- Can export rendered scores as SVG/PNG or print them as PDF
- Includes several preset scores of different complexity, from Twinkle Twinkle Little Star to Haruhikage

### Virtual Keys

- Uses the custom sound synthesizer and synchronizes with automatic score playback
- Covers 88 keys from A0 to C8, with horizontal scrolling on narrow screens
- Keys start sounding when pressed and release when lifted, allowing notes of arbitrary duration
- Supports performance with a mouse, touchscreen, computer keyboard, and MIDI input devices, and each input method can be enabled or disabled separately
- The computer keyboard uses the following key mapping, with `Z` / `X` for octave switching and `Ctrl` / `Shift` combinations for temporary octave changes

| Note | C   | C#  | D   | D#  | E   | F   | F#  | G   | G#  | A   | A#  | B   | C   |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Key  | A   | W   | S   | E   | D   | F   | T   | G   | Y   | H   | U   | J   | K   |

- Displays the connection status of MIDI input devices and lets you choose one device from the list to listen to

## Usage

Visit <https://juemuren.github.io/piano-lab/> to use the web version.

Download the desktop app from <https://github.com/juemuren/piano-lab/releases>.

### Local Development

```bash
npm install
npm run dev
```

### Build

Build the web app

```bash
npm run build
```

Build the desktop app

```bash
npm run build:tauri
```

### Code Style

The project uses ESLint and Prettier.

```sh
# eslint
npm run lint
# prettier
npm run format
```

## Principles

> For a more detailed explanation, read my article [The Mathematical Principles of Music: From Vibrating Strings to Modern Music Theory](https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/).

### Harmonic Synthesis

The sound produced by a vibrating string is ideally composed of a series of harmonics. The fundamental frequency is $f_1$, and the remaining harmonics are integer multiples of that frequency. For a sine wave, the sound pressure can be written as:

$$p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)$$

Based on this principle, the project synthesizes sound with the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). To further improve the listening experience, it uses a series of exponential functions to model how amplitude changes over time:

- The amplitude is first set to the **silence gain**
- It then reaches the target gain during the **attack time**
- During the **decay time**, it decays to the **sustain gain**
- For the duration of the note, the amplitude stays at the sustain gain
- During the **release time**, it returns to the silence gain

To better match physical behavior, higher harmonics decay and release faster, and their sustain gain is lower. The implementation uses $t_n = \frac{t_1}{\sqrt n}$ and $g_n = \frac{g_1}{\sqrt{n+1}}$ to model this relationship.

The app uses Plotly.js to draw the amplitude envelope curve.

### Timbre

Timbre is mainly determined by the amplitudes $A_n$ of the harmonic components.

The preset timbres use the following relationships:

| Timbre    | Harmonic amplitude relationship                  |
| --------- | ------------------------------------------------ |
| Metallic  | $A_n \propto \frac1n$                            |
| Pure      | $A_n \propto \frac1{n^2}$                        |
| Bright    | $A_n \propto \frac1n \|\sin\frac{n\pi}2\|$       |
| Ethereal  | $A_n \propto \frac{1}{n^2} \|\sin\frac{n\pi}2\|$ |
| Normal    | $A_n \propto \frac1{n^2} \|\sin(n\pi\lambda)\|$  |
| Soft      | $A_n \propto e^{-\sigma n}$                      |
| Realistic | $A_n \propto \frac1{n^p} e^{-\sigma n}$          |

Adjustable parameters:

- $\sigma$: decay rate
- $\lambda$: strike point
- $p$: power exponent

The app uses KaTeX to render spectrum preset formulas.

### Frequency-Domain Distortion

During propagation from source to listener, sound may be distorted in the frequency domain. Harmonic components at different frequencies can be affected differently in amplitude and phase.

The transfer functions use the following relationships:

| Effect      | Magnitude response                                      | Phase response                                                                    |
| ----------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Delay       | $1$                                                     | $-2\pi\tau f$                                                                     |
| Single echo | $\sqrt{1 + \alpha^2 + 2\alpha\cos(2\pi\tau f)}$         | $-\arctan\frac{\alpha\sin(2\pi\tau f)}{1 + \alpha\cos(2\pi\tau f)}$               |
| Multi echo  | $\frac1{\sqrt{1 + \alpha^2 - 2\alpha\cos(2\pi\tau f)}}$ | $-\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}$               |
| All-pass    | $1$                                                     | $-2\pi\tau f - 2\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}$ |
| Low-pass    | $`\mathbf{1}_{f \le f_{\max}}`$                         | $0$                                                                               |
| High-pass   | $`\mathbf{1}_{f \ge f_{\min}}`$                         | $0$                                                                               |
| Band-pass   | $`\mathbf{1}_{f \le f_{\max} \land f \ge f_{\min}}`$    | $0$                                                                               |

Adjustable parameters:

- $\tau$: delay time
- $\alpha$: attenuation coefficient
- $f_{\min}$: minimum frequency
- $f_{\max}$: maximum frequency

### Scores

- Scores are written in [ABC Notation](https://abcnotation.com/)
- [abcjs](https://www.abcjs.net/) parses the text and renders the score
- Animation and playback use callbacks generated after rendering the score
- SVG is provided directly by abcjs
- PNG is generated by converting SVG with the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- PDF is generated from SVG through the browser's print feature
- MIDI is provided directly by abcjs

### Input Devices

- MIDI device connections are implemented with the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)

## Tech Stack

Built with these open-source projects:

- React
- TypeScript
- Tailwind CSS
- Vite
- abcjs
- i18next
- Lucide
- KaTeX
- Plotly.js
- Tauri
