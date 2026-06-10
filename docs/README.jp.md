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

- [音声シンセサイザー](#音声シンセサイザー): 音のエンベロープ、倍音スペクトル、エフェクトをカスタマイズでき、音声を録音して WebM/MP4 などの形式でエクスポート可能
- [楽譜エディター](#楽譜エディター): ABC Notation で楽譜を作成し、リアルタイムレンダリング、自動演奏、SVG/PNG/PDF/MIDI ファイルへのエクスポートが可能
- [仮想鍵盤](#仮想鍵盤): A0 から C8 までの完全な 88 鍵を提供し、マウス、タッチ画面、コンピューターキーボード、MIDI 入力デバイスでの演奏に対応

アプリは多言語、モバイル表示、ダークモードに対応し、[デスクトップアプリ][link-release]としてインストールすることもできます。

### 音声シンセサイザー

音声シンセサイザーは、エンベロープ、スペクトル、エフェクト、分析の各モジュールで構成されています。

- サンプリングを用いない純粋な物理音声合成
- 十二平均律で音階を生成し、自由な移調が可能
- サイン波、三角波、のこぎり波、矩形波に対応
- 音量係数と倍音数の調整が可能
- すべての設定を JSON ファイルとしてエクスポートでき、共有や再利用が可能
- シンセサイザーの出力を録音し、ブラウザーのサポート状況に応じて WebM/Ogg/MP4 音声としてエクスポート可能

### エンベロープ

- アタック時間、ディケイ時間、リリース時間、サステインゲイン、無音ゲインの変更が可能
- 振幅エンベロープ曲線のプレビューを提供

### スペクトル

- 倍音振幅の完全なカスタマイズが可能
- 複数のプリセットを提供し、対応する数式を表示可能

### エフェクト

フィルター、イコライザー、リバーブ、コンプレッション、パンニング、ウェーブシェーピング、モジュレーションなど多彩なエフェクトを含みます。

#### フィルターとイコライザー

- ローパス、ハイパス、バンドパス、ノッチの 4 種類のフィルターに対応
- ローシェルフ、ハイシェルフ、ピーキングの 3 種類のイコライザーに対応
- カットオフ周波数、Q 値（品質係数）、ゲインの調整が可能
- フィルターとイコライザーを組み合わせた振幅周波数特性曲線を描画し、特定の音高の倍音におけるサンプリング結果を確認可能

#### コンプレッション

- ダイナミックレンジ圧縮を実現
- スレッショルド、ニー、レシオ、アタック時間、リリース時間を設定可能
- ゲインリダクション曲線をリアルタイムに描画

#### パンニング

- 位置、方向、距離、角度を完全にカスタマイズ可能
- 等パワーパンニングと頭部伝達関数（HRTF）の 2 つのパンニングモデルから選択可能
- 反比例、線形、指数の 3 つの距離モデルから選択可能
- 3D サウンドコーン図を表示し、距離ゲイン曲線を描画

#### ウェーブシェーピング

- 非線形ディストーション効果を実現
- サチュレーション、オーバードライブ、ディストーション、ファズの 4 種類を提供
- 各種類に調整可能な強度パラメーターがあり、対応する数式と曲線を描画

#### モジュレーション

- 振幅/周波数/位相/ディレイの 4 種類のモジュレーションに対応し、それぞれ個別に有効/無効を切り替え可能
- 振幅モジュレーションはトレモロ効果を実現し、モジュレーション周波数と深さを調整可能
- 周波数モジュレーションはビブラート効果を実現し、モジュレーション周波数と深さを調整可能
- 位相モジュレーションはフェイザー効果を実現し、モジュレーション周波数と深さを調整可能
- ディレイモジュレーションはコーラス/フランジャー効果を実現し、モジュレーション周波数と深さを調整可能
- 数式の表示と曲線の描画が可能

#### リバーブ

- 初期反射と後期残響を分離する方式を採用
- 複数のプリセットを提供し、パラメーターの完全なカスタマイズも可能
- 初期反射は反射回数、ゲイン、ディレイ、位相の調整が可能
- 後期残響はディレイ時間、持続時間、振幅係数、減衰係数の調整が可能
- インパルス応答の数式と波形を描画可能
- 必要に応じてリバーブ効果の有効/無効を切り替え可能

### 分析

- 周波数領域と時間領域の波形をリアルタイムに描画

### 楽譜エディター

- テキストで楽譜を作成し、リアルタイムにレンダリング可能
- 自動演奏に対応し、楽譜と鍵盤の両方に視覚的なフィードバックを表示
- 再生、一時停止、リプレイに対応し、コントロールバーの移動や音符のクリックで進行位置を調整可能
- テンポ、拍子、調号を変更でき、和音、リピート、複数声部に対応
- 鍵盤の演奏で楽譜を直接編集でき、キーを押した長さに応じて音符の長さが決まるため、メロディーの記録に便利
- 楽譜生成時にデフォルトの音符長、テンポ、拍子、調号を設定でき、自動改行も可能
- ワンクリックでデフォルト設定に戻す、または楽譜をクリア可能
- ABC ファイルのインポートとエクスポートに対応
- MIDI ファイルのエクスポートに対応
- レンダリングした楽譜を SVG/PNG としてエクスポート、または PDF として印刷可能
- 「きらきら星」から「春日影」まで、複雑さの異なる複数のプリセット楽譜を提供

### 仮想鍵盤

- カスタム音声シンセサイザーに接続し、楽譜の自動演奏状態と同期
- A0 から C8 までの 88 鍵をカバーし、画面幅が狭い場合は横スクロールが可能
- 鍵盤を押すと発音し、離すとリリースされるため、任意の長さの音符を演奏可能
- マウス、タッチ画面、コンピューターキーボード、MIDI 入力デバイスでの演奏に対応し、それぞれ個別に有効/無効を切り替え可能
- コンピューターキーボードは単列半音階のレイアウトを採用し、キーマッピングのカスタマイズも可能
- MIDI 入力デバイスの接続状態を表示し、デバイス一覧から監視する 1 台を選択可能

## 使い方

<https://piano.raind.me/> にアクセスして Web 版を使用できます。

<https://github.com/juemuren/piano-lab/releases> からデスクトップアプリをダウンロードできます。

### ローカル開発

```bash
npm install
npm run dev
```

### ビルド

Web アプリのビルド

```bash
npm run build
```

デスクトップアプリのビルド

```bash
npm run build:tauri
```

### コードスタイル

プロジェクトは Biome を使用しています。

```sh
npm run lint
npm run format
# lint + format
npm run check
```

## 原理

### 音声合成

弦の振動によって生じる音は、理想的には一連の正弦波倍音で構成されます。基音の周波数を $f_1$ とすると、その他の倍音の周波数はすべて基音の整数倍になります。したがって、理想的な音圧は次のように表せます。

$$
p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)
$$

この原理に基づき、[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) の [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) と [GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode) を使用して音声を合成しています。

> 音声合成のより詳しい物理原理については、私の解説記事 [音楽の数学原理](https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/) をご覧ください。この記事の **振動する弦** の章では、波動方程式から始めて偏微分方程式を段階的に解き、最終的に振動のフーリエ級数を導出しています。

### 倍音振幅スペクトル

音色は主に、各倍音成分の振幅 $A_n$ によって決まります。

各音色プリセットの具体的な関係は次のとおりです。

| 音色     | 倍音振幅の関係                                   |
| -------- | ------------------------------------------------ |
| 金属     | $A_n \propto \frac1n$                            |
| ピュア   | $A_n \propto \frac1{n^2}$                        |
| 明るい   | $A_n \propto \frac1n \|\sin\frac{n\pi}2\|$       |
| 幻想的   | $A_n \propto \frac{1}{n^2} \|\sin\frac{n\pi}2\|$ |
| 標準     | $A_n \propto \frac1{n^2} \|\sin(n\pi\lambda)\|$  |
| 柔らかい | $A_n \propto e^{-\sigma n}$                      |
| リアル   | $A_n \propto \frac1{n^p} e^{-\sigma n}$          |

調整可能なパラメーターは次のとおりです。

- $\sigma$ — 減衰率
- $\lambda$ — 打弦位置
- $p$ — べき指数

アプリ内では KaTeX を使用してスペクトルプリセットの数式をレンダリングしています。

### 振幅エンベロープ

一連の指数関数によって、時間経過に伴う振幅の変化をシミュレートします。

- 振幅はまず**無音ゲイン**に設定されます
- 次に**アタック時間**の間に、振幅が目標ゲインまで変化します
- 続いて**ディケイ時間**の間に、振幅が**サステインゲイン**まで減衰します
- 音符の持続時間中、振幅はサステインゲインに維持されます
- 最後に**リリース時間**の間に、振幅は再び無音ゲインに戻ります

完全な式は次のとおりです。

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

ここで $\varepsilon, S, \tau_a, \tau_d, \tau_r, T$ はそれぞれ無音ゲイン、サステインゲイン、アタック時間、ディケイ時間、リリース時間、音符の持続時間を表します。

より物理的事実に合致させるため、高次倍音の減衰とリリースはより速く、サステインゲインもより小さくなります。コード内では $t_n = \frac{t_1}{\sqrt n}$ と $g_n = \frac{g_1}{\sqrt{n+1}}$ を用いてこの関係をシミュレートしています。

アプリ内では Plotly.js を使用して振幅エンベロープ曲線を描画しています。

### インパルス応答と伝達関数

倍音合成の後、エフェクトが音声信号をさらに処理します。この処理は周波数領域と時間領域の両方から解釈できます。線形時不変システムにおいて、周波数領域での記述が伝達関数であり、時間領域での記述がインパルス応答です。

#### フィルターの原理

フィルターとイコライザーの効果は、どちらも Web Audio API の [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) を使用して実装されています。

BiquadFilterNode は双二次フィルターであり、その標準伝達関数は次のとおりです。

$$
H(z) = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}
$$

ここで $b_0, b_1, b_2, a_1, a_2$ はすべて係数であり、これら 5 つの係数を変更するだけで、ローパス/ハイパス/バンドパス/ノッチ/ローシェルフ/ハイシェルフ/ピーキングなど、あらゆる一般的なフィルターを実現できます。

BiquadFilterNode はさらに、実用的なインターフェースを提供しています。

- **ローパス/ハイパス**: カットオフ周波数と共振係数（Q 値）を変更可能。Q 値はカットオフ周波数における凸部の高さを決定します。
- **バンドパス/ノッチ**: 中心周波数と帯域幅係数を変更可能。帯域幅係数が大きいほど帯域幅が狭くなり、中心周波数での凸部も顕著になります。
- **ローシェルフ/ハイシェルフ**: カットオフ周波数とゲイン比率を変更可能。
- **ピーキング**: 中心周波数、帯域幅係数、ゲイン比率を変更可能。

フィルターは重ねてカスケード接続のエフェクトチェーンを構成できます。

アプリ内では Plotly.js を使用して最終的な振幅周波数特性曲線を描画しています。

#### リバーブの原理

リバーブは畳み込みリバーブであり、計算したインパルス応答を [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode) に送り、ドライ信号と畳み込みます。

ConvolverNode は離散信号の畳み込みを行い、その式は次のとおりです。

$$
(f * g)[n] = \sum_{k=-\infty}^{\infty} f[k] g[n - k]
$$

リバーブは初期反射と後期残響を分離する方式を採用しています。総インパルス応答は次のとおりです。

$$h[n]=\delta[n]+h_e[n]+h_l[n]$$

ここで $\delta[n]$ は単位パルスであり、ドライ信号のインパルス応答を表します。

**初期反射**は、音が空間内で少数の反射を経て聴取者に届く短遅延エコーをシミュレートし、異なる遅延とゲインを持つ一連の離散パルスで表現します。次のように書けます。

$$
h_e[n]=\sum_i a_i\cos(\phi_i)\delta[n-d_if_s]
$$

ここで $a_i,d_i,\phi_i$ はそれぞれ反射の振幅、遅延、位相です。

$f_s$ はサンプリングレートであり、[AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) が現在の音声出力デバイスに基づいて自動的に選択します（通常 44100 Hz または 48000 Hz）。

**後期残響**は、空間内で多数の反射が重なり合った密集したエコーをシミュレートし、指数減衰曲線をエンベロープとして使用し、正規乱数で位相をシミュレートします。その式は次のとおりです。

$$
h_l[n]=A\mathcal{N}(0,1)e^{-\alpha(n-Df_s)}
$$

ここで $A,\alpha,D,T$ はそれぞれ初期振幅、減衰係数、遅延時間、持続時間です。

$\mathcal{N}(0,1)$ は平均 $0$、標準偏差 $1$ の正規乱数であり、インパルス応答を正負均等に分布させることで、畳み込み時の過大な直流ゲインを防ぎます。直流ゲインの計算式は次のとおりです。

$$
H(0)=\int_{-\infty}^{\infty}h(t)\mathrm{d}t
$$

> ガウス乱数は Box-Muller 法によって一様乱数から変換して得ています。この部分のより詳しい説明については、私の解説記事 [ガウス乱数生成器](https://juemuren.github.io/blog/posts/math/%E9%AB%98%E6%96%AF%E9%9A%8F%E6%9C%BA%E6%95%B0%E7%94%9F%E6%88%90%E5%99%A8/) をご覧ください。この記事では数学的に完全な導出を行い、最後にシードを設定できる JavaScript 実装を示しています。

リバーブ効果は浴室/ガレージ/ホール/大聖堂のプリセットを提供し、小空間から大空間までをシミュレートします。

アプリ内では KaTeX と Plotly.js を使用してインパルス応答の数式と波形を描画しています。

#### コンプレッションの原理

コンプレッション効果は Web Audio API の [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode) を使用して実装されています。

DynamicsCompressorNode は、信号のしきい値を超えた部分を低減することでダイナミックレンジを縮小します。主なパラメーターは次のとおりです。

- **スレッショルド**: コンプレッションが効き始めるレベルを設定
- **ニー**: スレッショルド付近の圧縮の遷移の滑らかさを制御
- **レシオ**: スレッショルドを超えた信号の圧縮の度合いを制御
- **アタック時間**: 信号がスレッショルドを超えたときのコンプレッサーの反応速度を制御
- **リリース時間**: 信号がスレッショルドを下回った後のコンプレッサーの回復速度を制御

アプリ内では Plotly.js を使用してゲイン曲線をリアルタイムに描画しています。

#### パンニングの原理

パンニング効果は Web Audio API の [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode) を使用して実装されており、ステレオ音場での音源定位に用いられます。

PannerNode のパンニングモデルは等パワーパンニングと頭部伝達関数（HRTF）に対応しており、異なる位置や方向から来る音をシミュレートすることで、よりリアルな空間感を提供します。主なパラメーターは次のとおりです。

- **座標**と**方位角**: 空間内での音源の位置と方向を制御
- **距離**: 音源と聴取者の距離を制御し、線形/反比例/指数の距離モデルから選択可能
- **サウンドコーン**: 音源のコーン角を定義。内側コーン角内では音は元の音量を維持し、外側コーン角外ではコーン外ゲインまで減衰し、内外のコーンの間は滑らかに遷移します

アプリ内では Plotly.js を使用して 3D サウンドコーン図と距離ゲイン曲線を描画しています。

#### ウェーブシェーピングの原理

ウェーブシェーピング効果は Web Audio API の [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode) を使用して実装され、信号に非線形マッピング曲線を適用することでディストーション効果を生み出します。

複数のディストーションタイプが提供されており、その非線形マッピング式は次のとおりです。

| 効果             | 数式                                 | 強度パラメーター |
| ---------------- | ------------------------------------ | ---------------- |
| サチュレーション | $y = \frac{x}{1+c\|x\|}$             | $c=0\sim1$       |
| オーバードライブ | $y = \frac{\arctan(kx)}{\arctan(k)}$ | $k=1\sim20$      |
| ディストーション | $y = \tanh(gx)$                      | $g=2\sim10$      |
| ファズ           | $y = \frac{2}{\pi}\arctan(sx)$       | $s=10\sim100$    |

アプリ内では Plotly.js を使用して各効果のマッピング曲線を描画しています。

#### モジュレーションの原理

モジュレーションは、低周波発振器によって被変調量を周期的に変化させることで実現され、変調対象によってトレモロ、ビブラート、フェイザー、コーラス/フランジャーなど様々な効果を生み出します。

**振幅モジュレーション**は [GainNode.gain](https://developer.mozilla.org/en-US/docs/Web/API/GainNode/gain) を周期的に変化させることで実現します。式は次のとおりです。

$$
A_y(t)=[1-\Delta G+\Delta G\sin(2\pi f_m t)]A_x(t)
$$

ここで $\Delta G$ と $f_m$ はそれぞれモジュレーションの深さとモジュレーション周波数です。

**周波数モジュレーション**は [OscillatorNode.frequency](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency) を周期的に変化させることで実現します。式は次のとおりです。

$$
f_y(t)=[1 + (2^{\Delta c/1200}-1)\sin(2\pi f_m t)]f_x(t)
$$

ここで $\Delta c$ の単位はセントで、1 オクターブの周波数幅は 1200 セントです。

**位相モジュレーション**はオールパスフィルターによって実現され、信号の位相を周期的に変化させます。

オールパスフィルターも BiquadFilterNode の一種であり、それが生み出す位相偏移は次のように近似できます。

$$
\phi(t)=\phi_{\max}\sin(2\pi f_m t)
$$

**ディレイモジュレーション**は [DelayNode.delayTime](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode/delayTime) を周期的に変化させることで実現します。式は次のとおりです。

$$
\tau(t)=\frac{\tau_{\max}}{2}+\frac{\tau_{\max}}{2}\sin(2\pi f_m t)
$$

アプリ内では Plotly.js と KaTeX を使用してモジュレーション曲線と対応する数式を描画しています。

### 楽譜

- 楽譜は [ABC Notation](https://abcnotation.com/) で記述
- [abcjs](https://www.abcjs.net/) を使用してテキストの解析と楽譜のレンダリングを実行
- アニメーションと演奏機能は、楽譜レンダリング後に取得されるコールバック関数を利用して実装
- SVG は abcjs から直接提供
- PNG は [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) を使用して SVG から変換
- PDF はブラウザーの印刷機能を使用して SVG から生成
- MIDI は abcjs から直接提供

### 入力デバイス

- MIDI デバイスの接続は [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) によって実現

### 時間領域解析と周波数領域解析

- Web Audio API の [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) を使用して周波数領域と時間領域のデータを取得
- 描画には Canvas API を使用
- アニメーションは [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) によって各フレームを継続的に更新することで実現

## 技術スタック

以下のオープンソースプロジェクトに基づいて構築されています。

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
