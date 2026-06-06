# Todo

## Refactor

- [ ] [synth](src/services/synth) 目录下的文件命名存在误导性，需要修改

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] Chrome 对 [useMidiControl](src/hooks/piano/useMidiControl.ts) 中的 `navigator.requestMIDIAccess()` 调用发出警告。官方说明为 https://chromestatus.com/feature/5138066234671104。这个问题好像无法修复，只要调用就会有警告
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [ ] 混响的混合比例设为 1 时，会导致声音变得很小

## Style

- [ ] 对项目中的数个 [ControlSelect](src/components/shared/ControlSelect.tsx) 补充 label
- [ ] [ControlSelect](src/components/shared/ControlSelect.tsx) 中的标签在宽屏上改为横向
- [ ] 在脚注中补充关于应用的说明

## Feat

增加新的效果

- [ ] 立体声。参考 [StereoPannerNode](https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode)/[PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)
- [ ] 压缩。参考 [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode)。压缩是减小音频信号的最大音量与最小音量之间的差距，属于动态调节，无法绘制幅频曲线
- [ ] 失真。参考 [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode)。重塑波形，包括过载/法兹/饱和，优先实现饱和效果
- [ ] 调制。包括镶边/移相/合唱/颤音（Tremolo，音量调制）/震音（Vibrato，音高调制）。不是核心效果，可以后续再实现。全通滤波器（相变中心/陡峭程度）可以用于移相

增加可视化子模块，放入 [SoundSynthesizer](src/components/SoundSynthesizer/index.tsx) 下

- 使用 Web Audio API 的 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) 分别显示频域和时域的波形

修改已有模块

- [ ] 增加修改键位映射的功能
- [ ] 修改合成器根据频率减少振幅和衰减时间的行为。不要使用谐波次数，而是用真正的频率
- 效果修改
  - [ ] 考虑用高斯噪声改进尾音包络。可以用 Box-Muller 变换生成标准正态分布随机数
  - [ ] 早期反射考虑一下是否使用 [DelayNode](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode)
- 乐谱自动生成功能增强
  - [ ] 处理调号和节拍
  - [ ] 可以同步 textarea 中的修改

需要考虑是否使用第三方库的

- [ ] 可导入 `.midi` 文件，解析后接入自己的合成器来播放。可以关注 [Tone.js](https://github.com/Tonejs/Tone.js)/[Wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)
