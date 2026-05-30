<div align="center">

# 钢琴模拟器

[中文](README.md) | [English](docs/README.en.md) | [日本語](docs/README.jp.md)

[![action-deploy][badge-action-deploy]][link-action-deploy]
[![action-release][badge-action-release]][link-action-release]

[![website][badge-website]][link-website]
[![release][badge-release]][link-release]
[![license][badge-license]](LICENSE)

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

## 特性

钢琴模拟器提供可交互的虚拟琴键、声音合成器和乐谱编辑器：

- [声音合成器](#声音合成器)：集中调整振荡器、音量、谐波数量、包络、频谱和传递函数
- [乐谱编辑器](#乐谱编辑器)：用 ABC Notation 编写乐谱，实时渲染并自动演奏
- [虚拟琴键](#虚拟琴键)：支持鼠标或触屏演奏，并与乐谱播放状态同步高亮

应用支持多语言界面，适配移动端和黑暗模式，并且可以安装为[桌面应用][link-release]。

### 声音合成器

> [!Tip]
> 合成器配置可以导出为 JSON 文件，从而实现分享和复用

声音合成器由三个可折叠模块组成：包络、频谱和传递函数。

- 声音纯物理合成，不进行采样
- 使用十二平均律产生音阶，允许自由转调
- 支持正弦波、三角波、锯齿波、方波
- 支持调节音量系数和谐波数量

### 包络

包络使用 ADSR，可以完全自定义。

- 支持修改起音时间、衰音时间、释音时间、稳音增益和静音增益
- 提供振幅包络曲线预览，方便观察参数变化对声音动态的影响

### 频谱

频谱模块允许完全自定义谐波振幅，同时也提供了多种预设，并会直接渲染对应的数学公式。

- 金属
- 纯净
- 明亮
- 空灵
- 柔和
- 常规
- 真实
- 自定义

### 传递函数

传递函数模块用于模拟声音传播过程的幅频和相频特性。由于传递函数在频率上是连续的，不便完全自定义，因此只提供预设和可修改的参数，并通过图表预览不同谐波受到的影响。

- 纯延时
- 单回声
- 多回声
- 全通
- 低通
- 高通
- 带通

预览幅频和相频特性时，可以选择指定的基频或音高。

### 乐谱编辑器

- 用文本编写乐谱，提供实时渲染
- 能够自动演奏，并在乐谱和琴键上产生视觉反馈
- 点击乐谱上的音符，可以播放对应的声音，或从选中的音符处演奏整个乐谱
- 可以修改速度、节拍和调号，支持和弦、循环、多声部
- 支持导入和导出 `.abc` 文件
- 支持将渲染后的乐谱导出为 SVG 或 PNG 图片
- 提供数个复杂度不同的预设乐谱，从《小星星》到《春日影》都可直接使用

### 虚拟琴键

- 与声音合成器共享同一套音色配置
- 乐谱自动演奏时，当前音符会同步反映到键盘高亮状态

## 使用

### 在线体验

访问 <https://Juemuren.github.io/web-piano-simulator/> 即可使用网页版。

### 本地开发

```bash
npm install
npm run dev
```

### 构建

构建网页应用：

```bash
npm run build
```

构建桌面应用：

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
- SVG 直接由 abcjs 提供，PNG 借助 Canvas API 转换 SVG 得到

## 技术栈

基于以下开源项目构建

- React
- TypeScript
- Vite
- Tailwind CSS
- abcjs
- i18next
- KaTeX
- Plotly.js
- Tauri
