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

弦律（Piano Lab）提供可交互的虚拟琴键、可定制的声音合成器和可演奏的乐谱编辑器。

- [声音合成器](#声音合成器)：能够自定义声音包络、谐波频谱和效果器，可录制音频并支持 WebM/MP4 等多种导出格式
- [乐谱编辑器](#乐谱编辑器)：用 ABC Notation 编写乐谱，也可以自动记录演奏的音符，能够渲染、播放以及导出为 SVG/PNG/PDF/MIDI 文件
- [虚拟琴键](#虚拟琴键)：提供从 A0 到 C8 的完整 88 键，支持使用鼠标、触屏、电脑键盘和 MIDI 输入设备进行演奏

应用支持多语言，适配移动端和黑暗模式，并且可以安装为[桌面应用][link-release]。

### 声音合成器

声音合成器由以下模块组成：包络、频谱、效果和分析。

- 声音纯物理合成，不进行采样
- 使用十二平均律产生音阶，允许自由转调
- 支持正弦波、三角波、锯齿波、方波
- 支持调节音量系数和谐波数量
- 所有配置都可以导出为 JSON 文件，从而实现分享和复用
- 能够录制合成器输出，并根据浏览器的支持情况可导出为 WebM/OGG/MP4 音频

### 包络

- 支持修改起音时间、衰音时间、释音时间、稳音增益和静音增益
- 提供振幅包络曲线的预览

### 频谱

- 允许完全自定义谐波振幅
- 提供多种预设，且能够显示对应的数学公式

### 效果

包含滤波、均衡、混响、压缩、声像、波形重塑、调制等多种效果。

#### 滤波和均衡

- 支持低通、高通、带通和带阻四种滤波器
- 支持低架、高架和峰值三种均衡器
- 提供可调节的截止频率、品质因数和增益
- 能够绘制滤波器和均衡器组合后的幅频特性曲线，并可查看在特定音高谐波上采样的结果

#### 压缩

- 可实现动态压缩
- 可配置阈值、拐点、压缩比、启动时间和恢复时间
- 能够实时绘制增益衰减曲线

#### 声像

- 提供完全的自定义，支持修改位置、朝向、距离和角度
- 可选择等功率平移算法和头部相关传递函数两种声像模型
- 可选择反比、线性和指数三种距离模型
- 提供三维的声锥示意图，并绘制距离增益曲线

#### 波形重塑

- 可实现非线性失真效果
- 提供饱和、过载、失真和法兹四种类型
- 每种类型都有可调节的强度参数，并绘制相应的公式和曲线

#### 调制

- 支持振幅/频率/相位/延时四种调制，每种调制均可独立启用或禁用
- 振幅调制实现颤音效果，可调节调制频率和深度
- 频率调制实现揉弦效果，可调节调制频率和深度
- 相位调制实现移相效果，可调节调制频率和深度
- 延时调制实现合唱/镶边效果，可调节调制频率和深度
- 能够显示公式并绘制曲线

#### 混响

- 采用分离早期反射和晚期尾音的方案
- 提供多种预设，也可以完全自定义参数
- 早期反射支持修改反射次数、增益、延时和相位
- 晚期尾音支持修改延迟时间、持续时间、振幅系数和衰减系数
- 可绘制脉冲响应的公式和图像
- 支持按需启用或禁用混响效果

### 分析

- 可实时绘制频域和时域的波形

### 乐谱编辑器

- 用文本编写乐谱，能够实时渲染
- 能够自动演奏，并在乐谱和琴键上产生视觉反馈
- 能够播放、暂停、重放，可通过移动控制条或点击音符来调整进度
- 可以修改速度、节拍和调号，支持和弦、循环、多声部
- 演奏琴键可以直接修改乐谱，并根据按键持续时间匹配音符时值，便于记录旋律
- 乐谱生成时可设置默认音符长度、速度、节拍和调号，且能够自动分行
- 支持一键恢复默认设置或清空乐谱
- 支持导入和导出 ABC 文件
- 支持导出 MIDI 文件
- 可将渲染后的乐谱导出为 SVG/PNG，或打印为 PDF
- 提供从《小星星》到《春日影》的数个复杂度各异的预设乐谱

### 虚拟琴键

- 接入自定义的声音合成器，并与乐谱自动演奏的状态同步
- 覆盖 A0 到 C8 的 88 个琴键，在窄屏设备上可以横向滚动
- 琴键按下时开始发声，松开后释放声音，可以演奏任意时长的音符
- 支持使用鼠标、触屏、电脑键盘和 MIDI 输入设备进行演奏，并可分别启用或禁用
- 电脑键盘使用单排半音阶的布局方案，且支持自定义键位映射
- 可以显示 MIDI 输入设备的连接状态，并能够在设备列表中进行选择一个监听

## 使用

访问 <https://piano.raind.me/> 使用网页版

在 <https://github.com/juemuren/piano-lab/releases> 中下载桌面应用

### 本地开发

```bash
npm install
npm run dev
```

### 构建

使用 Vite 构建网页应用

```bash
npm run build
```

使用 Tauti 构建桌面应用

```bash
npm run build:tauri
```

### 代码质量

使用 Biome 进行风格检查和格式化

```sh
npm run lint
npm run format
# lint + format
npm run check
```

使用 TypeScript 进行类型检查

```sh
npm run typecheck
```

## 原理

### 声音合成

琴弦振动发出的声音，在理想情况下是由一系列正弦谐波组成的，其中基波的频率为 $f_1$，其余谐波的频率都是基频的整数倍。因此理想的声压可表示为

$$
p(t) = \sum_{n=1}^{N}A_n\sin(2\pi n f_1 t)
$$

基于此原理，使用 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) 的 [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) 和 [GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode) 合成声音。

> 关于声音合成更详细的物理原理，可阅读我的科普文章[《音乐的数学原理》](https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/)。该文章的 **振动弦** 章节，从波动方程开始推导，一步步地求解偏微分方程，并最终得到了振动的傅里叶级数。

### 谐波振幅频谱

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

### 振幅包络

通过一系列指数函数来模拟振幅随时间的变化

- 振幅首先被设置为**静音增益**
- 然后在**起音时间**内，振幅变化到目标增益
- 接着在**衰音时间**内，振幅衰减到**稳音增益**
- 在音符的持续时间内，振幅维持在稳音增益
- 最后在**释音时间**内，振幅重新回到静音增益

完整的公式为

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

其中 $\varepsilon, S, \tau_a, \tau_d, \tau_r, T$ 分别表示静音增益、稳音增益、起音时间、延迟时间、释放时间和音符持续时间。

为了更符合物理事实，高次谐波的衰减和释放会变快，且其稳音增益也会变小。代码中使用 $t_n = \frac{t_1}{\sqrt n}$ 和 $g_n = \frac{g_1}{\sqrt{n+1}}$ 来模拟这种关系。

应用内使用 Plotly.js 绘制振幅包络曲线。

### 脉冲响应和传递函数

在谐波合成之后，效果器对音频信号进行下一步处理。这种处理在频域和时域两方面都能得到解释。对于线性时不变系统，频域的描述就是传递函数，时域的描述就是脉冲响应。

#### 滤波原理

滤波和均衡效果都使用 Web Audio API 的 [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode) 实现。

`BiquadFilterNode` 是双二阶滤波器，其标准传递函数为

$$
H(z) = \frac{b_0 + b_1 z^{-1} + b_2 z^{-2}}{1 + a_1 z^{-1} + a_2 z^{-2}}
$$

其中 $b_0, b_1, b_2, a_1, a_2$ 都是系数，且只需修改这 5 个系数就能够实现低通/高通/带通/带阻/低架/高架/峰值等所有常见的滤波器。

而 `BiquadFilterNode` 进一步封装了更具实际意义的接口

- **低通/高通**，可以修改截止频率和谐振系数。其中谐振系数决定了在截止频率处的凸起高度
- **带通/带阻**，可以修改中心频率和带宽因子。带宽因子越大，则带宽越小，且中心频率处的凸起也越明显
- **低架/高架**，可以修改截止频率和增益比例
- **峰值**，可以修改中心频率、带宽因子和增益比例

滤波器可以叠加，组成级联的效果链。

应用内使用 Plotly.js 绘制最终幅频特性曲线。

#### 混响原理

混响为卷积混响，把计算得到的脉冲响应送入 [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode) 与干声进行卷积。

`ConvolverNode` 对离散信号进行卷积，其公式为

$$
(f * g)[n] = \sum_{k=-\infty}^{\infty} f[k] g[n - k]
$$

混响采用分离早期反射和晚期尾音的方案。总的脉冲响应为

$$
h[n]=\delta[n]+h_e[n]+h_l[n]
$$

其中 $\delta[n]$ 为单位脉冲，表示干声的脉冲响应。

**早期反射**模拟声音在空间中经少量反射后到达人耳的短延时回声，使用一组不同延时和增益的离散脉冲表示。可以写为

$$
h_e[n]=\sum_i a_i\cos(\phi_i)\delta[n-d_if_s]
$$

其中 $a_i,d_i,\phi_i$ 分别为反射的振幅、延时和相位。

而 $f_s$ 是采样率，其值由 [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) 根据当前的音频输出设备自动选择，通常是 44100 Hz 或 48000 Hz。

**晚期尾音**模拟声音在空间中经多次反射后叠加而成的密集回声，使用指数衰减曲线作为包络，并用正态随机数模拟相位，其表达式为

$$
h_l[n]=A\mathcal{N}(0,1)e^{-\alpha(n-Df_s)}
$$

其中 $A,\alpha,D,T$ 分别为初始振幅、衰减系数、延迟时间和持续时间。

而 $\mathcal{N}(0,1)$ 是均值为 $0$，标准差为 $1$ 的正态随机变量，目的是让脉冲响应正负分布均匀，防止卷积时产生过大的直流增益。直流增益的计算公式如下

$$
H(0)=\int_{-\infty}^{\infty}h(t)\mathrm{d}t
$$

> 高斯随机数通过 Box-Muller 算法转换均匀随机数得到。此部分更详细的解释可阅读我的科普文章[《高斯随机数生成器》](https://juemuren.github.io/blog/posts/math/%E9%AB%98%E6%96%AF%E9%9A%8F%E6%9C%BA%E6%95%B0%E7%94%9F%E6%88%90%E5%99%A8/)。该文章在数学上进行了完整的推导，并最终给出了一个可以设置种子的 JavaScript 实现。

混响效果提供浴室/车库/大厅/教堂预设，以模拟从小到大的不同空间。

应用内使用 KaTeX 与 Plotly.js 绘制脉冲响应的公式和图像。

#### 压缩原理

压缩效果使用 Web Audio API 的 [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode) 实现。

`DynamicsCompressorNode` 通过降低信号中超过阈值的部分来减小动态范围。其关键参数为

- **阈值**，设置压缩开始作用的电平
- **拐点**，控制阈值附近压缩过渡的平滑程度
- **压缩率**，控制超过阈值的信号的压缩程度
- **启动时间**，控制压缩器对信号超过阈值的反应速度
- **恢复时间**，控制压缩器在信号回落到阈值以下后的恢复速度

应用内使用 Plotly.js 实时绘制增益曲线。

#### 声像原理

声像效果使用 Web Audio API 的 [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode) 实现，用于在立体声场中定位音源。

`PannerNode` 的声像模型支持等功率平移算法和头部相关传递函数，可模拟来自不同位置和朝向的声音，从而提供更真实的空间感。其关键参数为

- **坐标**和**方位角**，控制音源在空间中的位置和朝向
- **距离**，控制音源与听者的距离，距离模型可选择线性/反比/指数
- **声锥**，定义音源的锥角大小。内锥角内声音保持原始音量，外锥角外声音衰减至锥外增益，内外锥之间平滑过渡

应用内使用 Plotly.js 绘制三维声锥示意图和距离增益曲线。

#### 波形重塑原理

波形重塑效果使用 Web Audio API 的 [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode) 实现。

`WaveShaperNode` 通过对信号施加非线性映射，来改变信号的波形。

本应用提供多种失真类型，非线性映射公式分别为

| 效果 | 公式                                 | 强度参数      |
| ---- | ------------------------------------ | ------------- |
| 饱和 | $y = \frac{x}{1+c\|x\|}$             | $c=0\sim1$    |
| 过载 | $y = \frac{\arctan(kx)}{\arctan(k)}$ | $k=1\sim20$   |
| 失真 | $y = \tanh(gx)$                      | $g=2\sim10$   |
| 法兹 | $y = \frac{2}{\pi}\arctan(sx)$       | $s=10\sim100$ |

应用内使用 Plotly.js 绘制每种效果的映射曲线。

#### 调制原理

调制通过一个低频振荡器周期性地改变被调制量来实现，根据被调制量的不同，可以产生颤音、揉弦、移相、合唱/镶边等多种效果。

**振幅调制**通过周期性地改变 [GainNode.gain](https://developer.mozilla.org/en-US/docs/Web/API/GainNode/gain) 实现。公式为

$$
A_y(t)=[1-\Delta G+\Delta G\sin(2\pi f_m t)]A_x(t)
$$

其中 $\Delta G,f_m$ 分别为调制深度和调制频率。

**频率调制**通过周期性地改变 [OscillatorNode.frequency](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/frequency) 实现。公式为

$$
f_y(t)=[1 + (2^{\Delta c/1200}-1)\sin(2\pi f_m t)]f_x(t)
$$

这里 $\Delta c$ 的单位是音分，而一个八度的频率跨度为 1200 音分。

**相位调制**通过全通滤波器实现，周期性地改变信号相位。

全通滤波器也是 `BiquadFilterNode` 的一种，其产生的相位偏移可近似为

$$
\phi(t)=\phi_{\max}\sin(2\pi f_m t)
$$

**延时调制**通过周期性地改变 [DelayNode.delayTime](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode/delayTime) 实现。公式为

$$
\tau(t)=\frac{\tau_{\max}}{2}+\frac{\tau_{\max}}{2}\sin(2\pi f_m t)
$$

应用内使用 Plotly.js 和 KaTeX 绘制调制曲线及对应公式。

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

### 时域分析和频域分析

- 使用 Web Audio API 的 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) 获取频域和时域数据
- 图像绘制使用 Canvas API 实现
- 动画通过 [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) 持续刷新每帧来实现

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
