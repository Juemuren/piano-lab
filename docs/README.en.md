<!-- markdownlint-disable MD033 MD041 -->

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

Piano Lab provides interactive virtual keys, a customizable sound synthesizer, and a playable score editor.

- [Sound Synthesizer](#sound-synthesizer): customize the sound envelope, harmonic spectrum, and effects; record audio and export in WebM/MP4 and other formats
- [Score Editor](#score-editor): write scores in ABC Notation, automatically record played notes, render, play, and export as SVG/PNG/PDF/MIDI files
- [Virtual Keys](#virtual-keys): provides the full 88-key range from A0 to C8; supports playing with mouse, touchscreen, computer keyboard, and MIDI input devices

The app supports multiple languages, mobile layout, dark mode, and can be installed as a [desktop app][link-release].

### Sound Synthesizer

The sound synthesizer consists of the following modules: envelope, spectrum, effects, and analysis.

- Pure physical sound synthesis without sampling
- Uses twelve-tone equal temperament to generate scales, supports free transposition
- Supports sine, triangle, sawtooth, and square waves
- Supports adjusting volume factor and harmonic count
- All configurations can be exported as JSON files for sharing and reuse
- Can record synthesizer output and export as WebM/OGG/MP4 audio depending on browser support

### Envelope

- Supports modifying attack time, decay time, release time, sustain gain, and silence gain
- Provides an amplitude envelope curve preview

### Spectrum

- Allows fully custom harmonic amplitudes
- Provides several presets and can display the corresponding mathematical formulas

### Effects

Includes filter, equalizer, reverb, compression, panning, wave shaping, modulation, and more.

#### Filter & Equalizer

- Provides several presets and can be fully customized
- Allows any number of filters and equalizers, with all parameters adjustable
- Supports four filter types: lowpass, highpass, bandpass, and notch
- Supports three equalizer types: lowshelf, highshelf, and peaking
- Provides adjustable cutoff frequency, quality factor (Q), and gain
- Can plot the combined magnitude-frequency response curve and view per-harmonic sampling results at a given pitch

#### Compression

- Provides dynamic range compression
- Configurable threshold, knee, ratio, attack time, and release time
- Displays a real-time gain reduction curve

#### Panning

- Fully customizable: supports adjusting position, orientation, distance, and angle
- Supports two panning models: equal-power panning and head-related transfer function (HRTF)
- Supports three distance models: inverse, linear, and exponential
- Provides a 3D sound cone diagram and plots the distance gain curve

#### Wave Shaping

- Produces nonlinear distortion effects
- Provides four types: saturation, overdrive, distortion, and fuzz
- Each type has an adjustable intensity parameter, with corresponding formulas and curves plotted

#### Modulation

- Supports four modulation types: amplitude, frequency, phase, and delay; each can be independently enabled or disabled
- Amplitude modulation produces a tremolo effect, with adjustable modulation frequency and depth
- Frequency modulation produces a vibrato effect, with adjustable modulation frequency and depth
- Phase modulation produces a phaser effect, with adjustable modulation frequency and depth
- Delay modulation produces chorus/flanger effects, with adjustable modulation frequency and depth
- Displays formulas and draws curves

#### Reverb

- Uses a separated early reflections and late tail approach
- Provides several presets and fully customizable parameters
- Early reflections support adjusting reflection count, gain, delay, and phase
- Late tail supports adjusting delay time, duration, amplitude coefficient, and decay coefficient
- Can plot impulse response formulas and waveforms
- Supports enabling or disabling reverb on demand

### Analysis

- Displays real-time frequency-domain and time-domain waveforms

### Score Editor

- Write scores as text with real-time rendering
- Auto-play with visual feedback on both the score and keys
- Supports play, pause, and replay; adjust progress by moving the control bar or clicking notes
- Can modify tempo, meter, and key signature; supports chords, repeats, and multiple voices
- Playing keys directly edits the score, matching note values to key-press duration — convenient for recording melodies
- Score generation supports setting default note length, tempo, meter, and key signature, with automatic line breaking
- One-click reset to defaults or clear the score
- Supports importing and exporting ABC files
- Supports exporting MIDI files
- Can export rendered scores as SVG/PNG or print as PDF
- Provides several preset scores of varying complexity, from Twinkle Twinkle Little Star to Haruhikage

### Virtual Keys

- Connected to the custom sound synthesizer and synchronized with automatic score playback
- Covers 88 keys from A0 to C8, with horizontal scrolling on narrow screens
- Keys sound when pressed and release when lifted, allowing notes of arbitrary duration
- Supports playing with mouse, touchscreen, computer keyboard, and MIDI input devices; each can be enabled or disabled individually
- The computer keyboard uses a single-row chromatic layout and supports custom key mapping
- Displays MIDI input device connection status and allows selecting one device from the list to listen to

## Usage

Visit <https://piano.raind.me/> to use the web version.

Download the desktop app from <https://github.com/juemuren/piano-lab/releases>.

### Local Development

```bash
pnpm install
pnpm run dev
```

### Build

Build the web app with Vite

```bash
pnpm run build
```

Build the desktop app with Tauri

```bash
pnpm run build:tauri
```

### Code Quality

Use Biome for linting and formatting.

```sh
pnpm run lint
pnpm run format
# lint + format
pnpm run check
```

Use TypeScript for type checking.

```sh
pnpm run typecheck
```

## Principles

### Sound Synthesis

The sound produced by a vibrating string is ideally composed of a series of sine harmonics, where the fundamental frequency is $f_1$ and the remaining harmonics are integer multiples of the fundamental. The ideal sound pressure can therefore be expressed as:

$$
p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)
$$

Based on this principle, sound is synthesized with the [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) and [GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode) from the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

> For a more detailed explanation of the physics behind sound synthesis, see my article [The Mathematical Principles of Music](https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/). Its **Vibrating Strings** section starts from the wave equation, solves the partial differential equation step by step, and finally derives the Fourier series of the vibration.

### Harmonic Amplitude Spectrum

Timbre is primarily determined by the amplitudes $A_n$ of the harmonic components.

The specific relationships for each timbre preset are:

| Timbre    | Harmonic amplitude relationship                  |
| --------- | ------------------------------------------------ |
| Metallic  | $A_n \propto \frac1n$                            |
| Pure      | $A_n \propto \frac1{n^2}$                        |
| Bright    | $A_n \propto \frac1n \|\sin\frac{n\pi}2\|$       |
| Ethereal  | $A_n \propto \frac{1}{n^2} \|\sin\frac{n\pi}2\|$ |
| Normal    | $A_n \propto \frac1{n^2} \|\sin(n\pi\lambda)\|$  |
| Soft      | $A_n \propto e^{-\sigma n}$                      |
| Realistic | $A_n \propto \frac1{n^p} e^{-\sigma n}$          |

The adjustable parameters are:

- $\sigma$ — decay rate
- $\lambda$ — strike point
- $p$ — power exponent

KaTeX is used in the app to render spectrum preset formulas.

### Amplitude Envelope

A series of exponential functions simulate how amplitude changes over time:

- The amplitude is first set to the **silence gain**
- Then, during the **attack time**, the amplitude rises to the target gain
- Next, during the **decay time**, the amplitude decays to the **sustain gain**
- Throughout the note's duration, the amplitude stays at the sustain gain
- Finally, during the **release time**, the amplitude returns to the silence gain

The complete formula is:

$$
\begin{cases}
  A(t) = \varepsilon (\frac{1}{\varepsilon})^{\frac{t}{\tau_a}}
  & 0\le t < \tau_a \\
  A(t) = S^{\frac{t-\tau_a}{\tau_d}}
  & \tau_a\le t < \tau_a + \tau_d \\
  A(t) = S
  & \tau_a + \tau_d \le t < \tau_a + \tau_d + T \\
  A(t) = S (\frac{\varepsilon}{S})^{\frac{t-\tau_a-\tau_d-T}{\tau_r}}
  & \tau_a + \tau_d + T \le t < \tau_a + \tau_d + T + \tau_r
\end{cases}
$$

where $\varepsilon, S, \tau_a, \tau_d, \tau_r, T$ denote the silence gain, sustain gain, attack time, decay time, release time, and note duration, respectively.

To better match physical reality, higher harmonics decay and release faster, and their sustain gain is also smaller. The code uses $t_n = \frac{t_1}{\sqrt n}$ and $g_n = \frac{g_1}{\sqrt{n+1}}$ to model this relationship.

Plotly.js is used in the app to draw the amplitude envelope curve.

### Impulse Response and Transfer Function

After harmonic synthesis, effects further process the audio signal. This processing can be understood in both the frequency domain and the time domain. For linear time-invariant systems, the frequency-domain description is the transfer function, and the time-domain description is the impulse response.

#### Filter Principles

Both filter and equalizer effects are implemented using the Web Audio API's [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode).

BiquadFilterNode is a biquad filter whose standard transfer function is:

$$
H(z) = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}
$$

where $b_0, b_1, b_2, a_1, a_2$ are coefficients, and by modifying just these 5 coefficients, all common filter types can be realized — lowpass, highpass, bandpass, notch, lowshelf, highshelf, and peaking.

BiquadFilterNode further encapsulates more practical interfaces:

- **Lowpass/Highpass**: adjustable cutoff frequency and resonance (Q). Q determines the height of the bump at the cutoff frequency.
- **Bandpass/Notch**: adjustable center frequency and bandwidth factor. A larger bandwidth factor gives a narrower bandwidth and a more prominent bump at the center frequency.
- **Lowshelf/Highshelf**: adjustable cutoff frequency and gain ratio.
- **Peaking**: adjustable center frequency, bandwidth factor, and gain ratio.

Filters can be cascaded to form a chained effects chain.

Plotly.js is used in the app to draw the final magnitude-frequency response curve.

#### Reverb Principles

Reverb is convolution reverb — the computed impulse response is fed into a [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode) to convolve with the dry signal.

ConvolverNode performs discrete convolution, given by:

$$
(f * g)[n] = \sum_{k=-\infty}^{\infty} f[k] g[n - k]
$$

Reverb uses a separated early reflections and late tail approach. The total impulse response is:

$$h[n]=\delta[n]+h_e[n]+h_l[n]$$

where $\delta[n]$ is the unit impulse, representing the impulse response of the dry signal.

**Early reflections** simulate the short-delay echoes that reach the listener after a small number of reflections in the space, represented as a set of discrete impulses with varying delays and gains. This can be written as:

$$
h_e[n]=\sum_i a_i\cos(\phi_i)\delta[n-d_if_s]
$$

where $a_i$, $d_i$, and $\phi_i$ are the reflection amplitude, delay, and phase, respectively.

$f_s$ is the sample rate, automatically chosen by the [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) based on the current audio output device — typically 44100 Hz or 48000 Hz.

**Late tail** simulates the dense echoes formed by many overlapping reflections in the space, using an exponential decay curve as the envelope and normal random numbers to model phase. Its expression is:

$$
h_l[n]=A\mathcal{N}(0,1)e^{-\alpha(n-Df_s)}
$$

where $A$, $\alpha$, $D$, and $T$ are the initial amplitude, decay coefficient, delay time, and duration, respectively.

$\mathcal{N}(0,1)$ is a normal random variable with mean $0$ and standard deviation $1$, used to distribute the impulse response evenly between positive and negative values, preventing excessive DC gain during convolution. The DC gain is calculated as:

$$
H(0)=\int_{-\infty}^{\infty}h(t)\mathrm{d}t
$$

> Gaussian random numbers are obtained from uniform random numbers with the Box-Muller transform. For a more detailed explanation, see my article [Gaussian Random Number Generator](https://juemuren.github.io/blog/posts/math/%E9%AB%98%E6%96%AF%E9%9A%8F%E6%9C%BA%E6%95%B0%E7%94%9F%E6%88%90%E5%99%A8/). The article provides a complete mathematical derivation and ends with a seedable JavaScript implementation.

The reverb effect provides bathroom, garage, hall, and cathedral presets, simulating spaces from small to large.

KaTeX and Plotly.js are used in the app to draw the impulse response formulas and waveforms.

#### Compression Principles

Compression is implemented using the Web Audio API's [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode).

DynamicsCompressorNode reduces the dynamic range by attenuating portions of the signal that exceed the threshold. Its key parameters are:

- **Threshold**: sets the level at which compression begins to take effect
- **Knee**: controls the smoothness of the compression transition around the threshold
- **Ratio**: controls how much the signal above the threshold is compressed
- **Attack time**: controls how quickly the compressor responds when the signal exceeds the threshold
- **Release time**: controls how quickly the compressor recovers after the signal falls below the threshold

Plotly.js is used in the app to draw a real-time gain curve.

#### Panning Principles

Panning is implemented using the Web Audio API's [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode), used to position audio sources in the stereo field.

PannerNode supports two panning models — equal-power panning and head-related transfer function (HRTF) — simulating sound from different positions and orientations to provide a more realistic spatial sensation. Its key parameters are:

- **Position** and **Azimuth**: control the location and facing direction of the audio source in space
- **Distance**: controls the distance between the audio source and the listener, with linear, inverse, and exponential distance models available
- **Sound Cone**: defines the cone angle of the audio source. Within the inner cone angle, the sound maintains its original volume; beyond the outer cone angle, the sound attenuates to the outer cone gain; a smooth transition occurs between the inner and outer cones

Plotly.js is used in the app to draw a 3D sound cone diagram and the distance gain curve.

#### Wave Shaping Principles

Wave shaping is implemented using the Web Audio API's [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode), which produces distortion by applying a nonlinear mapping curve to the signal.

Several distortion types are provided, with the following nonlinear mapping formulas:

| Effect     | Formula                              | Intensity parameter |
| ---------- | ------------------------------------ | ------------------- |
| Saturation | $y = \frac{x}{1+c\|x\|}$             | $c=0\sim1$          |
| Overdrive  | $y = \frac{\arctan(kx)}{\arctan(k)}$ | $k=1\sim20$         |
| Distortion | $y = \tanh(gx)$                      | $g=2\sim10$         |
| Fuzz       | $y = \frac{2}{\pi}\arctan(sx)$       | $s=10\sim100$       |

Plotly.js is used in the app to draw the mapping curve for each effect.

#### Modulation Principles

Modulation works by periodically varying a target parameter with a low-frequency oscillator. Depending on what is being modulated, it can produce various effects such as tremolo, vibrato, phaser, and chorus/flanger.

**Amplitude modulation** is implemented by periodically varying [GainNode.gain](https://developer.mozilla.org/en-US/docs/Web/API/GainNode/gain). The formula is:

$$
A_y(t)=[1-\Delta G+\Delta G\sin(2\pi f_m t)]A_x(t)
$$

where $\Delta G$ and $f_m$ are the modulation depth and modulation frequency, respectively.

**Frequency modulation** is implemented by periodically varying [OscillatorNode.frequency](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency). The formula is:

$$
f_y(t)=[1 + (2^{\Delta c/1200}-1)\sin(2\pi f_m t)]f_x(t)
$$

where $\Delta c$ is in cents, and an octave spans 1200 cents.

**Phase modulation** is implemented via all-pass filters, periodically shifting the phase of the signal.

An all-pass filter is also a type of BiquadFilterNode, and the phase shift it introduces can be approximated as:

$$
\phi(t)=\phi_{\max}\sin(2\pi f_m t)
$$

**Delay modulation** is implemented by periodically varying [DelayNode.delayTime](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode/delayTime). The formula is:

$$
\tau(t)=\frac{\tau_{\max}}{2}+\frac{\tau_{\max}}{2}\sin(2\pi f_m t)
$$

Plotly.js and KaTeX are used in the app to draw modulation curves and their corresponding formulas.

### Scores

- Scores are written in [ABC Notation](https://abcnotation.com/)
- [abcjs](https://www.abcjs.net/) is used to parse the text and render the scores
- Animation and playback are implemented using callbacks obtained after rendering the score
- SVG is provided directly by abcjs
- PNG is generated by converting SVG with the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- PDF is generated from SVG through the browser's print feature
- MIDI is provided directly by abcjs

### Input Devices

- MIDI device connections are implemented via the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)

### Time-Domain and Frequency-Domain Analysis

- The Web Audio API's [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) is used to obtain frequency-domain and time-domain data
- Rendering is implemented with the Canvas API
- Animation is achieved by continuously refreshing each frame via [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

## Tech Stack

Built on the following open-source projects:

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
