<div align="center">

# Piano Simulator

[中文](../README.md) | [English](README.en.md) | [日本語](README.jp.md)

[![action-deploy][badge-action-deploy]][link-action-deploy]
[![action-release][badge-action-release]][link-action-release]

[![website][badge-website]][link-website]
[![release][badge-release]][link-release]
[![license][badge-license]](../LICENSE)

[badge-action-deploy]: https://github.com/Juemuren/web-piano-simulator/actions/workflows/deploy.yml/badge.svg
[badge-action-release]: https://github.com/Juemuren/web-piano-simulator/actions/workflows/release.yml/badge.svg
[badge-website]: https://img.shields.io/badge/website-github.io-green
[badge-release]: https://img.shields.io/github/release/Juemuren/web-piano-simulator
[badge-license]: https://img.shields.io/github/license/Juemuren/web-piano-simulator
[link-action-deploy]: https://github.com/Juemuren/web-piano-simulator/actions/workflows/deploy.yml
[link-action-release]: https://github.com/Juemuren/web-piano-simulator/actions/workflows/release.yml
[link-website]: https://Juemuren.github.io/web-piano-simulator/
[link-release]: https://github.com/Juemuren/web-piano-simulator/releases

</div>

## Features

Piano Simulator provides interactive virtual keys, a sound synthesizer, and a score editor:

- [Sound Synthesizer](#sound-synthesizer): adjust the oscillator, volume, harmonic count, envelope, spectrum, and transfer function in one place
- [Score Editor](#score-editor): write scores in ABC Notation, render them in real time, play them automatically, and export them as SVG/PNG/PDF/MIDI files
- [Virtual Keys](#virtual-keys): provides the full 88-key range from A0 to C8 and supports mouse or touchscreen performance

The app supports a multilingual interface, mobile layouts, dark mode, and can be installed as a [desktop app][link-release].

### Sound Synthesizer

> [!Tip]
> Synthesizer configurations can be exported as JSON files for sharing and reuse.

The sound synthesizer consists of three collapsible modules: envelope, spectrum, and transfer function.

- Synthesizes sound physically without sampling
- Uses twelve-tone equal temperament to generate pitches and supports free transposition
- Supports sine, triangle, sawtooth, and square waves
- Supports adjusting the volume factor and harmonic count

### Envelope

The envelope uses ADSR and is fully customizable.

- Supports editing attack time, decay time, release time, sustain gain, and silence gain
- Provides an amplitude envelope preview to show how parameter changes affect sound dynamics

### Spectrum

The spectrum module allows fully custom harmonic amplitudes. It also provides several presets and directly renders the corresponding mathematical formulas.

- Metallic
- Pure
- Bright
- Ethereal
- Soft
- Normal
- Realistic
- Custom

### Transfer Function

The transfer function module simulates the magnitude and phase responses of sound propagation. Because the transfer function is continuous over frequency and is not convenient to customize completely, it provides presets with adjustable parameters and previews how different harmonics are affected.

- Delay
- Single echo
- Multi echo
- All-pass
- Low-pass
- High-pass
- Band-pass

When previewing magnitude and phase responses, you can choose a specific fundamental frequency or pitch.

### Score Editor

- Write scores as text with live rendering
- Play scores automatically with visual feedback on both the score and keyboard
- Supports play, pause, replay, and playback-position adjustment through the progress bar or by clicking notes
- Adjust tempo, meter, and key signature; chords, repeats, and multiple voices are supported
- Supports importing and exporting ABC files
- Supports exporting MIDI files
- Supports exporting rendered scores as SVG or PNG images
- Supports printing rendered scores as PDF
- Includes several preset scores of different complexity, from Twinkle Twinkle Little Star to Haruhikage

### Virtual Keys

- Uses the custom sound synthesizer and synchronizes with automatic score playback
- Covers 88 keys from A0 to C8, with horizontal scrolling on narrow screens
- During automatic score playback, the current note is reflected in the highlighted keyboard state

## Usage

### Online

Visit <https://Juemuren.github.io/web-piano-simulator/> to use the web version.

### Local Development

```bash
npm install
npm run dev
```

### Build

Build the web app:

```bash
npm run build
```

Build the desktop app:

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
- PDF is generated from the rendered SVG through the browser's print feature
- MIDI is provided directly by abcjs

## Tech Stack

Built with these open-source projects:

- React
- TypeScript
- Vite
- Tailwind CSS
- abcjs
- i18next
- Lucide
- KaTeX
- Plotly.js
- Tauri
