<div align="center">

# 弦律

[中文](README.md) | [English](docs/README.en.md) | [日本語](docs/README.jp.md)

[![action-deploy][badge-action-deploy]][link-action-deploy]
[![action-release][badge-action-release]][link-action-release]

[![website][badge-website]][link-website]
[![release][badge-release]][link-release]
[![license][badge-license]](LICENSE)

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

## 特性

弦律（Piano Lab）提供可交互的虚拟琴键、声音合成器和乐谱编辑器：

- [声音合成器](#声音合成器)：能够自定义声音包络、谐波频谱和传递函数，可录制音频并支持 WebM/MP4 等多种导出格式
- [乐谱编辑器](#乐谱编辑器)：用 ABC Notation 编写乐谱，可以实时渲染，自动演奏以及导出为 SVG/PNG/PDF/MIDI 文件
- [虚拟琴键](#虚拟琴键)：提供从 A0 到 C8 的完整 88 键，支持使用鼠标、触屏、电脑键盘和 MIDI 输入设备进行演奏

应用支持多语言，适配移动端和黑暗模式，并且可以安装为[桌面应用][link-release]。

### 声音合成器

声音合成器由三个模块组成：包络、频谱和传递函数。

- 声音纯物理合成，不进行采样
- 使用十二平均律产生音阶，允许自由转调
- 支持正弦波、三角波、锯齿波、方波
- 支持调节音量系数和谐波数量
- 所有配置都可以导出为 JSON 文件，从而实现分享和复用
- 能够录制合成器输出，并根据浏览器的支持情况可导出为 WebM/Ogg/MP4 音频

### 包络

- 支持修改起音时间、衰音时间、释音时间、稳音增益和静音增益
- 提供振幅包络曲线的预览

### 频谱

- 允许完全自定义谐波振幅
- 提供多种预设，且能够显示对应的数学公式

### 传递函数

- 提供预设和可修改的参数
- 能够预览不同谐波的幅度和相位变化
- 预览时可选择指定的基频或音高

### 乐谱编辑器

- 用文本编写乐谱，能够实时渲染
- 能够自动演奏，并在乐谱和琴键上产生视觉反馈
- 能够播放、暂停、重放，可通过移动控制条或点击音符来调整进度
- 可以修改速度、节拍和调号，支持和弦、循环、多声部
- 按下琴键可以直接修改乐谱，并根据按键持续时间匹配音符时值，便于记录旋律
- 支持导入和导出 ABC 文件
- 支持导出 MIDI 文件
- 可将渲染后的乐谱导出为 SVG/PNG，或打印为 PDF
- 提供从《小星星》到《春日影》的数个复杂度各异的预设乐谱

### 虚拟琴键

- 接入自定义的声音合成器，并与乐谱自动演奏的状态同步
- 覆盖 A0 到 C8 的 88 个琴键，在窄屏设备上可以横向滚动
- 琴键按下时开始发声，松开后释放声音，可以演奏任意时长的音符
- 支持使用鼠标、触屏、电脑键盘和 MIDI 输入设备进行演奏，并可分别启用或禁用
- 电脑键盘使用如下的按键映射方案，并可以用 `Z` / `X` 切换八度，以及 `Ctrl` / `Shift` 组合键临时改变八度

| 音  | C   | C#  | D   | D#  | E   | F   | F#  | G   | G#  | A   | A#  | B   | C   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 键  | A   | W   | S   | E   | D   | F   | T   | G   | Y   | H   | U   | J   | K   |

- 可以显示 MIDI 输入设备的连接状态，并能够在设备列表中进行选择一个监听

## 使用

访问 <https://juemuren.github.io/piano-lab/> 使用网页版

在 <https://github.com/juemuren/piano-lab/releases> 中下载桌面应用

### 本地开发

```bash
npm install
npm run dev
```

### 构建

构建网页应用

```bash
npm run build
```

构建桌面应用

```bash
npm run build:tauri
```

### 代码风格

项目使用 ESLint 和 Prettier

```sh
# eslint
npm run lint
# prettier
npm run format
```

## 原理

> 详细的原理可阅读我的科普文章[《音乐的数学原理：从振动弦到现代乐理》](https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/)

### 谐波合成

琴弦振动发出的声音，在理想情况下是由一系列谐波组成的，其中基波的频率为 $f_1$，其余谐波的频率都是基频的整数倍。以正弦波为例，声压可表示为

$$p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)$$

基于此原理，使用 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) 合成声音。为了进一步改善听感，通过一系列指数函数来模拟振幅随时间的变化

- 振幅首先被设置为**静音增益**
- 然后在**起音时间**内，振幅变化到目标增益
- 接着在**衰音时间**内，振幅衰减到**稳音增益**
- 在音符的持续时间内，振幅维持在稳音增益
- 最后在**释音时间**内，振幅重新回到静音增益

为了更符合物理事实，高次谐波的衰减和释放会变快，且其稳音增益也会变小。代码中使用 $t_n = \frac{t_1}{\sqrt n}$ 和 $g_n = \frac{g_1}{\sqrt{n+1}}$ 来模拟这种关系。

应用内使用 Plotly.js 绘制振幅包络曲线。

### 音色

音色主要由各谐波分量的振幅 $A_n$ 决定。

各音色预设的具体关系为

| 音色 | 谐波振幅关系                                     |
| ---- | ------------------------------------------------ |
| 金属 | $A_n \propto \frac1n$                            |
| 纯净 | $A_n \propto \frac1{n^2}$                        |
| 明亮 | $A_n \propto \frac1n \|\sin\frac{n\pi}2\|$       |
| 空灵 | $A_n \propto \frac{1}{n^2} \|\sin\frac{n\pi}2\|$ |
| 常规 | $A_n \propto \frac1{n^2} \|\sin(n\pi\lambda)\|$  |
| 柔和 | $A_n \propto e^{-\sigma n}$                      |
| 真实 | $A_n \propto \frac1{n^p} e^{-\sigma n}$          |

其中可调节的参数有

- $\sigma$ 衰减率
- $\lambda$ 击弦点
- $p$ 幂指数

应用内使用 KaTeX 渲染频谱预设公式。

### 频域畸变

从产生到接收的过程中，声音可能发生频域上的畸变，即不同频率的谐波分量，其振幅和相位会受到不同程度的影响。

各传递函数的具体关系为

| 效果   | 幅频特性                                                | 相频特性                                                                          |
| ------ | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 纯延时 | $1$                                                     | $-2\pi\tau f$                                                                     |
| 单回声 | $\sqrt{1 + \alpha^2 + 2\alpha\cos(2\pi\tau f)}$         | $-\arctan\frac{\alpha\sin(2\pi\tau f)}{1 + \alpha\cos(2\pi\tau f)}$               |
| 多回声 | $\frac1{\sqrt{1 + \alpha^2 - 2\alpha\cos(2\pi\tau f)}}$ | $-\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}$               |
| 全通   | $1$                                                     | $-2\pi\tau f - 2\arctan\frac{\alpha\sin(2\pi\tau f)}{1 - \alpha\cos(2\pi\tau f)}$ |
| 低通   | $`\mathbf{1}_{f \le f_{\max}}`$                         | $0$                                                                               |
| 高通   | $`\mathbf{1}_{f \ge f_{\min}}`$                         | $0$                                                                               |
| 带通   | $`\mathbf{1}_{f \le f_{\max} \land f \ge f_{\min}}`$    | $0$                                                                               |

其中可调节的参数有

- $\tau$ 延迟时间
- $\alpha$ 衰减系数
- $f_{\min}$ 最小频率
- $f_{\max}$ 最大频率

### 乐谱

- 使用 [ABC Notation](https://abcnotation.com/) 编写乐谱
- 使用 [abcjs](https://www.abcjs.net/) 解析文本和渲染乐谱
- 动画和演奏功能借助渲染乐谱后得到的回调函数实现
- SVG 直接由 abcjs 提供
- PNG 借助 [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) 转换 SVG 得到
- PDF 借助浏览器的打印功能转换 SVG 得到
- MIDI 直接由 abcjs 提供

### 输入设备

- MIDI 设备的连接通过 [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) 实现

## 技术栈

基于以下开源项目构建

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
