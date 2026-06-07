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

- [x] 对项目中的数个 [ControlSelect](src/components/shared/ControlSelect.tsx) 补充 label
- [x] 混响添加一个启用开关
- [x] 频谱中添加公式
- [x] 包络中添加公式
- [ ] 在脚注中补充关于应用的说明
- [x] 使用 [Catppuccin](https://catppuccin.com/palette/) 的配色方案。亮色为 Latte，暗色为 Mocha

## Feat

增加新的效果

- 压缩。参考 [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode)。
  - [x] 实现压缩效果
  - [x] 绘制实时的 reduction
- 声像。参考 [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)
  - [x] 实现声像效果
  - [x] 声锥示意图（3D）
  - [x] 距离增益曲线
- [x] 波形重塑。参考 [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode)。包括饱和/过载/失真/法兹，公式如下

| 效果 | 公式                                 | 参数(强度)    |
| ---- | ------------------------------------ | ------------- |
| 饱和 | $y = \frac{x}{1+c\|x\|}$             | $c=0\sim1$    |
| 过载 | $y = \frac{\arctan(kx)}{\arctan(k)}$ | $k=1\sim20$   |
| 失真 | $y = \tanh(gx)$                      | $g=2\sim10$   |
| 法兹 | $y = \frac{2}{\pi}\arctan(sx)$       | $s=10\sim100$ |

- [ ] 调制。包括镶边/移相/合唱/颤音（Tremolo，音量调制）/震音（Vibrato，音高调制）。不是核心效果，可以后续再实现。全通滤波器（相变中心/陡峭程度）可以用于移相

已有效果修改

- [ ] 晚期尾音考虑用高斯噪声进行改进。可以用 Box-Muller 变换生成标准正态分布随机数

增加可视化子模块，放入 [SoundSynthesizer](src/components/SoundSynthesizer/index.tsx) 下

- 使用 Web Audio API 的 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) 分别显示频域和时域的波形

增强乐谱自动生成功能

- [ ] 处理调号和节拍
- [ ] 可以同步 textarea 中的修改

其余模块

- [ ] 增加修改键位映射的功能
