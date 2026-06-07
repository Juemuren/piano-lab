# Todo

## Chore

- [ ] 尝试一下 [Biome](https://biomejs.dev/) 或类似的 Rust 工具
- [x] 买个国内的域名，优化访问

## Refactor

- [x] [synth](src/services/synth) 目录下的文件命名存在误导性，需要修改
- [x] 拆分 [useEffectControl](src/hooks/synth/useEffectControl.ts)，每个效果单独一个 hook
- [x] 拆分 [SynthConfig](src/services/synth/SynthConfig.ts)，分出 Defaults/Options/Normalize

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] Chrome 对 [useMidiControl](src/hooks/piano/useMidiControl.ts) 中的 `navigator.requestMIDIAccess()` 调用发出警告。官方说明为 https://chromestatus.com/feature/5138066234671104。这个问题好像无法修复，只要调用就会有警告
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [x] 混响的混合比例设为 1 时，会导致声音变得很小。修复方案是把起始音补上，即 $h[n] = \delta[n] + h_e[n] + h_l[n]$，然后再禁用 ConvolverNode 的 normalize

## Style

- [ ] 对项目中的数个 [ControlSelect](src/components/shared/ControlSelect.tsx) 补充 label
- [ ] [ControlSelect](src/components/shared/ControlSelect.tsx) 中的标签在宽屏上改为横向
- [ ] 在脚注中补充关于应用的说明
- [ ] 混响添加一个启用开关
- [x] 频谱中添加公式
- [x] 包络中添加公式

## Feat

增加新的效果

- 压缩。参考 [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode)。
  - [x] 实现压缩效果
  - [x] 绘制实时的 reduction
- 声像。参考 [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)
  - [x] 实现声像效果
  - [x] 声锥示意图。根据 orientation、coneInnerAngle、coneOuterAngle、coneOuterGain 画极坐标图。coneOuterAngle 之外会按 coneOuterGain 衰减。https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/coneOuterAngle
  - [x] 距离增益曲线。根据 MDN 给出的计算方式画 linear、inverse、exponential 的曲线。https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/distanceModel
  - [ ] 实时左右声道能量。在 PannerNode 后接 ChannelSplitterNode + AnalyserNode，分别分析 L/R 的时域 RMS 或频谱

- [ ] 失真。参考 [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode)。重塑波形，包括饱和/失真/过载/法兹，公式如下

| 效果 | 公式                                 | 参数(强度)    |
| ---- | ------------------------------------ | ------------- |
| 饱和 | $y = \frac{x}{1+c\|x\|}$             | $c=0\sim1$    |
| 过载 | $y = \frac{\arctan(kx)}{\arctan(k)}$ | $k=1\sim20$   |
| 失真 | $y = \tanh(gx)$                      | $g=2\sim10$   |
| 法兹 | $y = \frac{2}{\pi}\arctan(sx)$       | $s=10\sim100$ |

- [ ] 调制。包括镶边/移相/合唱/颤音（Tremolo，音量调制）/震音（Vibrato，音高调制）。不是核心效果，可以后续再实现。全通滤波器（相变中心/陡峭程度）可以用于移相

已有效果修改

- [ ] 晚期尾音考虑用高斯噪声进行改进。可以用 Box-Muller 变换生成标准正态分布随机数
- [ ] 早期反射考虑一下是否使用 [DelayNode](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode)

增加可视化子模块，放入 [SoundSynthesizer](src/components/SoundSynthesizer/index.tsx) 下

- 使用 Web Audio API 的 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) 分别显示频域和时域的波形

增强乐谱自动生成功能

- [ ] 处理调号和节拍
- [ ] 可以同步 textarea 中的修改
- [ ] 考虑一下是否把 “将演奏的音符写入乐谱” 这一设置移动到乐谱编辑器中

其余模块

- [ ] 增加修改键位映射的功能
- [ ] 修改合成器根据频率减少振幅和衰减时间的行为。不要使用谐波次数，而是用真正的频率
- [ ] [SynthEngine](src/services/synth/SynthEngine.ts) 中 `stopNote` 不会触发稳音期间的振幅衰减。该特性不好用公式表示，考虑一下是否把这个特性在 `playNote` 中也删了

需要考虑是否使用第三方库的

- [ ] 可导入 `.midi` 文件，解析后接入自己的合成器来播放。可以关注 [Tone.js](https://github.com/Tonejs/Tone.js)/[Wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)
