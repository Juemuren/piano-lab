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

Piano Lab provides interactive virtual keys, a customizable sound synthesizer, and a playable score editor:

- [Sound Synthesizer](#sound-synthesizer): customize the sound envelope, harmonic spectrum, and effects, record audio, and export in formats such as WebM and MP4
- [Score Editor](#score-editor): write scores in ABC Notation, render them in real time, play them automatically, and export them as SVG/PNG/PDF/MIDI files
- [Virtual Keys](#virtual-keys): provides the full 88-key range from A0 to C8 and supports performance with a mouse, touchscreen, computer keyboard, and MIDI input devices

The app supports multiple languages, mobile layouts, dark mode, and can be installed as a [desktop app][link-release].

### Sound Synthesizer

The sound synthesizer consists of three modules: envelope, spectrum, and effects.

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

### Effects

Contains filter, equalizer, and reverb components.

#### Filter & Equalizer

- Supports lowpass, highpass, bandpass, and notch filter types
- Supports lowshelf, highshelf, and peaking equalizer types
- Provides adjustable cutoff frequency, Q (quality factor), and gain
- Can plot the combined magnitude response curve of filters and equalizers, with per-harmonic sampling at a selected pitch

#### Reverb

- Uses a separated early reflections and late tail approach
- Provides several presets and fully customizable parameters
- Early reflections support adjusting reflection count, gain, and delay
- The late tail uses an exponential-decay impulse response, with adjustable delay time, duration, amplitude coefficient, and decay coefficient
- Can plot impulse response formulas and waveforms

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

Visit <https://piano.raind.me/> to use the web version.

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

### Sound Synthesis

The sound produced by a vibrating string is ideally composed of a series of sine harmonics. The fundamental frequency is $f_1$, and the remaining harmonics are integer multiples of that frequency. The ideal sound pressure can therefore be written as:

$$
p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)
$$

Based on this principle, the project synthesizes sound with the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). To further improve the listening experience, it uses a series of exponential functions to model how amplitude changes over time:

- The amplitude is first set to the **silence gain**
- It then reaches the target gain during the **attack time**
- During the **decay time**, it decays to the **sustain gain**
- For the duration of the note, the amplitude stays at the sustain gain
- During the **release time**, it returns to the silence gain

To better match physical behavior, higher harmonics decay and release faster, and their sustain gain is lower. The implementation uses $t_n = \frac{t_1}{\sqrt n}$ and $g_n = \frac{g_1}{\sqrt{n+1}}$ to model this relationship.

The app uses Plotly.js to draw the amplitude envelope curve.

### Harmonic Amplitude Spectrum

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

### Effects and Transfer Functions

After harmonic synthesis, effects further process the audio signal. This processing can be understood in both the frequency and time domains.

Currently implemented effects include filters, equalizers, and reverb.

#### Filters

Both filter and equalizer effects are implemented using the Web Audio API's [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode).

BiquadFilterNode is a biquad filter whose standard transfer function is:

$$
H(z) = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}
$$

where $b_0, b_1, b_2, a_1, a_2$ are coefficients. By modifying these 5 coefficients alone, all common filter types can be realized: lowpass/highpass/bandpass/notch/lowshelf/highshelf/peaking.

BiquadFilterNode further encapsulates more practical interfaces:

- **Lowpass/Highpass**: adjustable cutoff frequency and Q. Q controls the height of the bump at the cutoff frequency.
- **Bandpass/Notch**: adjustable center frequency and bandwidth factor. A larger bandwidth factor gives a narrower bandwidth and a more prominent bump at the center frequency.
- **Lowshelf/Highshelf**: adjustable cutoff frequency and gain.
- **Peaking**: adjustable center frequency, bandwidth factor, and gain.

Filters can be chained together in a cascaded effects chain.

The app uses Plotly.js to draw the final magnitude response curve.

#### Convolution

Reverb is convolution-based, feeding a computed impulse response into a [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode) to convolve with the dry signal.

ConvolverNode performs discrete convolution, given by:

$$
(f * g)[n] = \sum_{k=-\infty}^{\infty} f[k] g[n - k]
$$

The impulse response uses a separated early reflections and late tail approach, which are summed to produce the total impulse response.

**Early reflections** simulate the short-delay echoes that arrive at the listener after a small number of wall reflections, represented as a set of discrete impulses with varying delays and gains:

$$
h_e[n]=\sum_i a_i\delta[n-d_if_s]
$$

where $a_i$ is the reflection amplitude and $d_i$ is the reflection delay. $f_s$ is the sample rate, automatically chosen by the [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) based on the current audio output device — typically 44100 Hz or 48000 Hz.

**Late tail** simulates the dense collection of echoes after many reflections, using an exponential-decay envelope as the impulse response:

$$
h_l[n]=Ae^{-\alpha(n-Df_s)} \quad Df_s \le n \le (D+T)f_s
$$

where $A$ is the initial amplitude, $\alpha$ is the decay coefficient, $D$ and $T$ are the delay time and duration respectively.

The reverb effect provides four presets — bathroom, garage, hall, and cathedral — to simulate spaces from small to large.

The app uses KaTeX and Plotly.js to draw impulse response formulas and waveforms.

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
