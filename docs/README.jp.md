<div align="center">

# ピアノシミュレーター

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

## 機能

ピアノシミュレーターは、インタラクティブな仮想鍵盤、音声シンセサイザー、楽譜エディターを提供します。

- [音声シンセサイザー](#音声シンセサイザー): 音のエンベロープ、倍音スペクトル、伝達関数をカスタマイズ
- [楽譜エディター](#楽譜エディター): ABC Notation で楽譜を書き、リアルタイムレンダリング、自動演奏、SVG/PNG/PDF/MIDI ファイルへのエクスポートに対応
- [仮想鍵盤](#仮想鍵盤): A0 から C8 までの完全な 88 鍵を備え、マウスまたはタッチ操作で演奏可能

多言語、モバイル表示、ダークモードに対応し、[デスクトップアプリ][link-release]としてもインストールできます。

### 音声シンセサイザー

> [!Tip]
> シンセサイザー設定は JSON ファイルとしてエクスポートでき、共有や再利用ができます。

音声シンセサイザーは、エンベロープ、スペクトル、伝達関数の 3 つのモジュールで構成されています。

- サンプリングではなく、物理モデルに基づいて音を合成
- 十二平均律で音階を生成し、自由な移調に対応
- サイン波、三角波、のこぎり波、矩形波に対応
- 音量係数と倍音数を調整可能

### エンベロープ

- アタック時間、ディケイ時間、リリース時間、サステインゲイン、無音ゲインを変更可能
- 振幅エンベロープ曲線のプレビューを提供

### スペクトル

- 倍音振幅を完全にカスタマイズ可能
- 複数のプリセットを提供し、対応する数式を表示可能

### 伝達関数

- プリセットと調整可能なパラメーターを提供
- 各倍音の振幅と位相の変化をプレビュー可能
- プレビュー時に指定した基音周波数または音高を選択可能

### 楽譜エディター

- テキストで楽譜を書き、リアルタイムにレンダリング可能
- 自動演奏に対応し、楽譜と鍵盤に視覚的なフィードバックを表示
- 再生、一時停止、リプレイに対応し、コントロールバーの移動または音符のクリックで進行位置を調整可能
- テンポ、拍子、調号を変更でき、和音、反復、複数声部にも対応
- ABC ファイルのインポートとエクスポートに対応
- MIDI ファイルのエクスポートに対応
- レンダリングした楽譜を SVG/PNG としてエクスポート、または PDF として印刷可能
- 「きらきら星」から「春日影」まで、複雑さの異なる複数のプリセット楽譜を収録

### 仮想鍵盤

- カスタム音声シンセサイザーに接続し、楽譜の自動演奏状態と同期
- A0 から C8 までの 88 鍵をカバーし、狭い画面では横スクロール可能

## 使い方

<https://Juemuren.github.io/web-piano-simulator/> にアクセスすると、Web 版を使用できます。

<https://github.com/Juemuren/web-piano-simulator/releases> からデスクトップアプリをダウンロードできます。

### ローカル開発

```bash
npm install
npm run dev
```

### ビルド

Web アプリをビルド

```bash
npm run build
```

デスクトップアプリをビルド

```bash
npm run build:tauri
```

### コードスタイル

このプロジェクトでは ESLint と Prettier を使用しています。

```sh
# eslint
npm run lint
# prettier
npm run format
```

## 原理

> 詳しい説明は、記事 [音楽の数学原理：振動する弦から現代音楽理論まで](https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/) を参照してください。

### 倍音合成

弦の振動によって生じる音は、理想的には一連の倍音で構成されます。基音の周波数を $f_1$ とすると、その他の倍音の周波数は基音周波数の整数倍になります。サイン波を例にすると、音圧は次のように表せます。

$$p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)$$

この原理に基づき、[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) で音を合成しています。さらに聴感を改善するため、複数の指数関数を使って時間に伴う振幅変化をモデル化しています。

- 最初に振幅を **無音ゲイン** に設定
- **アタック時間** の間に目標ゲインまで変化
- **ディケイ時間** の間に **サステインゲイン** まで減衰
- 音符の持続時間中はサステインゲインを維持
- 最後に **リリース時間** の間に無音ゲインへ戻る

物理的な挙動に近づけるため、高次倍音ほど減衰とリリースを速くし、サステインゲインも小さくしています。実装では $t_n = \frac{t_1}{\sqrt n}$ と $g_n = \frac{g_1}{\sqrt{n+1}}$ を使ってこの関係をモデル化しています。

### 音色

音色は主に、各倍音成分の振幅 $A_n$ によって決まります。

各音色プリセットの関係は次のとおりです。

| 音色     | 倍音振幅の関係                                   |
| -------- | ------------------------------------------------ |
| 金属     | $A_n \propto \frac1n$                            |
| ピュア   | $A_n \propto \frac1{n^2}$                        |
| 明るい   | $A_n \propto \frac1n \|\sin\frac{n\pi}2\|$       |
| 幻想     | $A_n \propto \frac{1}{n^2} \|\sin\frac{n\pi}2\|$ |
| 標準     | $A_n \propto \frac1{n^2} \|\sin(n\pi\lambda)\|$  |
| 柔らかい | $A_n \propto e^{-\sigma n}$                      |
| リアル   | $A_n \propto \frac1{n^p} e^{-\sigma n}$          |

調整可能なパラメーター:

- $\sigma$: 減衰率
- $\lambda$: 打弦位置
- $p$: べき指数

アプリ内では KaTeX を使ってスペクトルプリセットの数式をレンダリングしています。

### 周波数領域の歪み

音が発生してから受け取られるまでの過程で、周波数領域の歪みが起こることがあります。つまり、周波数の異なる倍音成分は、振幅と位相に異なる影響を受けます。

各伝達関数の関係は次のとおりです。

| 効果       | 振幅特性                                                | 位相特性                                                                          |
| ---------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ディレイ   | $1$                                                     | $-2\pi\tau f$                                                                     |
| 単一エコー | $\sqrt{1 + \alpha^2 + 2\alpha\cos(2\pi\tau f)}$         | $-\arctan\frac{\alpha\sin(2\pi\tau f)}{1 + \alpha\cos(2\pi\tau f)}$               |
| 複数エコー | $\frac1{\sqrt{1 + \alpha^2 - 2\alpha\cos(2\pi\tau f)}}$ | $-\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}$               |
| オールパス | $1$                                                     | $-2\pi\tau f - 2\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}$ |
| ローパス   | $`\mathbf{1}_{f \le f_{\max}}`$                         | $0$                                                                               |
| ハイパス   | $`\mathbf{1}_{f \ge f_{\min}}`$                         | $0$                                                                               |
| バンドパス | $`\mathbf{1}_{f \le f_{\max} \land f \ge f_{\min}}`$    | $0$                                                                               |

調整可能なパラメーター:

- $\tau$: 遅延時間
- $\alpha$: 減衰係数
- $f_{\min}$: 最小周波数
- $f_{\max}$: 最大周波数

### 楽譜

- 楽譜は [ABC Notation](https://abcnotation.com/) で記述
- [abcjs](https://www.abcjs.net/) でテキストを解析し、楽譜をレンダリング
- アニメーションと演奏機能は、楽譜レンダリング後に得られるコールバックを利用して実装
- SVG は abcjs から直接提供
- PNG は [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) で SVG を変換して生成
- PDF はブラウザーの印刷機能を使って SVG から生成
- MIDI は abcjs から直接提供

## 技術スタック

以下のオープンソースプロジェクトを使って構築されています。

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
