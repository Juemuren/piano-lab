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

The simulator provides several tools:

- [Harmonic Synthesizer](#harmonic-synthesizer) for shaping sound synthesis
- [Timbre Adjuster](#timbre-adjuster) for fully custom timbres
- [Transfer Function Modifier](#transfer-function-modifier) for changing transfer functions
- [Score Editor](#score-editor) for writing scores as text and playing them automatically

It also supports mobile layouts and dark mode.

### Harmonic Synthesizer

- Synthesizes sound physically without sampling
- Uses twelve-tone equal temperament to generate pitches and supports free transposition
- Uses 10 harmonics for a rich and realistic timbre
- Uses an ADSR envelope with multiple adjustable parameters

### Timbre Adjuster

The timbre adjuster allows fully custom timbres and also provides several presets:

- Metallic
- Pure
- Bright
- Ethereal
- Soft
- Normal
- Realistic

### Transfer Function Modifier

The transfer function modifier simulates the magnitude and phase responses of sound propagation. Because the transfer function is continuous over frequency and is not convenient to customize completely, it provides presets with adjustable parameters.

- Delay
- Single echo
- Multi echo
- All-pass
- Low-pass
- High-pass
- Band-pass

### Score Editor

- Write scores as text with live rendering
- Play scores automatically with visual feedback on both the score and keyboard
- Click a note in the score to play it, or start playback from the selected note
- Adjust tempo, meter, and key signature; chords, repeats, and multiple voices are supported
- Includes several preset scores of different complexity

## Principles

> For a more detailed explanation, read my article [The Mathematical Principles of Music: From Vibrating Strings to Modern Music Theory](https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/).

### Synthesis

The sound produced by a vibrating string is ideally composed of a series of harmonics. The fundamental frequency is $f_1$, and the remaining harmonics are integer multiples of that frequency. For a sine wave, the sound pressure can be written as:

$$p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)$$

With $N=10$, the sound is already realistic enough.

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

### Transfer Function

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

## Tech Stack

Built with these open-source projects:

- React
- TypeScript
- Vite
- Tailwind CSS
- abcjs
