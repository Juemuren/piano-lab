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

## 機能

Piano Lab は、インタラクティブな仮想鍵盤、カスタマイズ可能な音声シンセサイザー、演奏可能な楽譜エディターを提供します。

- [音声シンセサイザー](#音声シンセサイザー): 音のエンベロープ、倍音スペクトル、エフェクトをカスタマイズでき、音声録音と WebM/MP4 など複数形式でのエクスポートに対応
- [楽譜エディター](#楽譜エディター): ABC Notation で楽譜を書き、リアルタイムレンダリング、自動演奏、SVG/PNG/PDF/MIDI ファイルへのエクスポートに対応
- [仮想鍵盤](#仮想鍵盤): A0 から C8 までの完全な 88 鍵を備え、マウス、タッチ画面、コンピューターキーボード、MIDI 入力デバイスで演奏可能

多言語、モバイル表示、ダークモードに対応し、[デスクトップアプリ][link-release]としてもインストールできます。

### 音声シンセサイザー

音声シンセサイザーは、エンベロープ、スペクトル、エフェクトの 3 つのモジュールで構成されています。

- サンプリングではなく、物理モデルに基づいて音を合成
- 十二平均律で音階を生成し、自由な移調に対応
- サイン波、三角波、のこぎり波、矩形波に対応
- 音量係数と倍音数を調整可能
- すべての設定を JSON ファイルとしてエクスポートでき、共有や再利用が可能
- シンセサイザー出力を録音し、ブラウザーの対応状況に応じて WebM/Ogg/MP4 音声としてエクスポート可能

### エンベロープ

- アタック時間、ディケイ時間、リリース時間、サステインゲイン、無音ゲインを変更可能
- 振幅エンベロープ曲線のプレビューを提供

### スペクトル

- 倍音振幅を完全にカスタマイズ可能
- 複数のプリセットを提供し、対応する数式を表示可能

### エフェクト

フィルター、イコライザー、リバーブなどのコンポーネントを含みます。

#### フィルターとイコライザー

- ローパス、ハイパス、バンドパス、ノッチの 4 種類のフィルターに対応
- ローシェルフ、ハイシェルフ、ピーキングの 3 種類のイコライザーに対応
- カットオフ周波数、Q 値、ゲインを調整可能
- フィルターとイコライザーを組み合わせた振幅周波数特性曲線を描画し、指定した音高の倍音でのサンプリング結果を確認可能

#### リバーブ

- 初期反射と後期残響を分離する方式を採用
- 複数のプリセットを提供し、パラメーターの完全なカスタマイズも可能
- 初期反射は反射回数、ゲイン、遅延を調整可能
- 後期残響は指数減衰のインパルス応答を使用し、遅延時間、持続時間、振幅係数、減衰係数を調整可能
- インパルス応答の数式と画像を描画可能

### 楽譜エディター

- テキストで楽譜を書き、リアルタイムにレンダリング可能
- 自動演奏に対応し、楽譜と鍵盤に視覚的なフィードバックを表示
- 再生、一時停止、リプレイに対応し、コントロールバーの移動または音符のクリックで進行位置を調整可能
- テンポ、拍子、調号を変更でき、和音、反復、複数声部にも対応
- 鍵盤を押すと楽譜を直接編集でき、キーを押していた長さから音符の長さを判定するため、メロディーの記録に役立つ
- ABC ファイルのインポートとエクスポートに対応
- MIDI ファイルのエクスポートに対応
- レンダリングした楽譜を SVG/PNG としてエクスポート、または PDF として印刷可能
- 「きらきら星」から「春日影」まで、複雑さの異なる複数のプリセット楽譜を収録

### 仮想鍵盤

- カスタム音声シンセサイザーに接続し、楽譜の自動演奏状態と同期
- A0 から C8 までの 88 鍵をカバーし、狭い画面では横スクロール可能
- キーを押すと発音し、離すとリリースされるため、任意の長さの音符を演奏可能
- マウス、タッチ画面、コンピューターキーボード、MIDI 入力デバイスで演奏でき、それぞれ個別に有効化または無効化可能
- コンピューターキーボードは次のキー割り当てを使用し、`Z` / `X` でオクターブを切り替え、`Ctrl` / `Shift` の組み合わせで一時的にオクターブを変更可能

| 音   | C   | C#  | D   | D#  | E   | F   | F#  | G   | G#  | A   | A#  | B   | C   |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| キー | A   | W   | S   | E   | D   | F   | T   | G   | Y   | H   | U   | J   | K   |

- MIDI 入力デバイスの接続状態を表示し、デバイス一覧から監視する 1 台を選択可能

## 使い方

<https://piano.raind.me/> にアクセスすると、Web 版を使用できます。

<https://github.com/juemuren/piano-lab/releases> からデスクトップアプリをダウンロードできます。

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

### 音声合成

弦の振動によって生じる音は、理想的には一連の正弦波倍音で構成されます。基音の周波数を $f_1$ とすると、その他の倍音の周波数は基音周波数の整数倍になります。したがって、理想的な音圧は次のように表せます。

$$
p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)
$$

この原理に基づき、[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) で音を合成しています。さらに聴感を改善するため、複数の指数関数を使って時間に伴う振幅変化をモデル化しています。

- 最初に振幅を **無音ゲイン** に設定
- **アタック時間** の間に目標ゲインまで変化
- **ディケイ時間** の間に **サステインゲイン** まで減衰
- 音符の持続時間中はサステインゲインを維持
- 最後に **リリース時間** の間に無音ゲインへ戻る

物理的な挙動に近づけるため、高次倍音ほど減衰とリリースを速くし、サステインゲインも小さくしています。実装では $t_n = \frac{t_1}{\sqrt n}$ と $g_n = \frac{g_1}{\sqrt{n+1}}$ を使ってこの関係をモデル化しています。

アプリ内では Plotly.js を使って振幅エンベロープ曲線を描画しています。

### 倍音振幅スペクトル

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

### エフェクトと伝達関数

倍音合成の後、エフェクトが音声信号をさらに処理します。この処理は周波数領域と時間領域の両方から説明できます。

現在実装されているエフェクトには、フィルター、イコライザー、リバーブがあります。

#### フィルター

フィルターとイコライザー効果は、どちらも Web Audio API の [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) を使用して実装されています。

BiquadFilterNode は双二次フィルターであり、その標準的な伝達関数は次のとおりです。

$$
H(z) = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}
$$

ここで $b_0, b_1, b_2, a_1, a_2$ は係数であり、これら 5 つの係数を変更するだけでローパス/ハイパス/バンドパス/ノッチ/ローシェルフ/ハイシェルフ/ピーキングなど、すべての一般的なフィルターを実現できます。

BiquadFilterNode はさらに、より実用的なインターフェースを提供しています。

- **ローパス/ハイパス**: カットオフ周波数と Q 値を変更できます。Q 値はカットオフ周波数での凸部の高さを決定します。
- **バンドパス/ノッチ**: 中心周波数と帯域幅係数を変更できます。帯域幅係数が大きいほど帯域幅が狭くなり、中心周波数での凸部も顕著になります。
- **ローシェルフ/ハイシェルフ**: カットオフ周波数とゲインを変更できます。
- **ピーキング**: 中心周波数、帯域幅係数、ゲインを変更できます。

フィルターは重ねてカスケード接続のエフェクトチェーンを構成できます。

アプリ内では Plotly.js を使って最終的な振幅周波数特性曲線を描画しています。

#### 畳み込み

リバーブは畳み込みリバーブであり、計算されたインパルス応答を [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode) に送り、ドライ信号と畳み込みます。

ConvolverNode は離散信号の畳み込みを行い、その式は次のとおりです。

$$
(f * g)[n] = \sum_{k=-\infty}^{\infty} f[k] g[n - k]
$$

インパルス応答は初期反射と後期残響を分離する方式を採用し、両者を重ね合わせて総インパルス応答を生成します。

**初期反射**は、音が空間内で少数の壁面反射を経て聴取者に届く短遅延エコーをシミュレートし、異なる遅延とゲインを持つ一連の離散パルスで表現します。

$$
h_e[n]=\sum_i a_i\delta[n-d_if_s]
$$

ここで $a_i$ は反射の振幅、$d_i$ は反射の遅延です。$f_s$ はサンプリングレートで、[AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) が現在の音声出力デバイスに基づいて自動的に選択します（通常 44100 Hz または 48000 Hz）。

**後期残響**は、多数の反射が重なり合った密集したエコーをシミュレートし、指数減衰の包絡線をインパルス応答として使用します。

$$
h_l[n]=Ae^{-\alpha(n-Df_s)} \quad Df_s \le n \le (D+T)f_s
$$

ここで $A$ は初期振幅、$\alpha$ は減衰係数、$D$ と $T$ はそれぞれ遅延時間と持続時間です。

リバーブ効果は浴室/ガレージ/ホール/大聖堂の 4 つのプリセットを提供し、小空間から大空間までをシミュレートします。

アプリ内では KaTeX と Plotly.js を使ってインパルス応答の数式と画像を描画しています。

### 楽譜

- 楽譜は [ABC Notation](https://abcnotation.com/) で記述
- [abcjs](https://www.abcjs.net/) でテキストを解析し、楽譜をレンダリング
- アニメーションと演奏機能は、楽譜レンダリング後に得られるコールバックを利用して実装
- SVG は abcjs から直接提供
- PNG は [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) で SVG を変換して生成
- PDF はブラウザーの印刷機能を使って SVG から生成
- MIDI は abcjs から直接提供

### 入力デバイス

- MIDI デバイスの接続は [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) で実装

## 技術スタック

以下のオープンソースプロジェクトを使って構築されています。

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
