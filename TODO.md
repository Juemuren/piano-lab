# Todo

## Refactor

- [ ] [共享组件](src/components/shared/) 下存在 3 种 button，最好进行统一
- [x] [SynthEngine](src/services/synth/SynthEngine.ts) 中分离出 BaseVoice/EffectChain 为后续添加效果器作铺垫
- [ ] [SynthEngine](src/services/synth/SynthEngine.ts) 中可以把所有 for 循环改为 foreach，更加函数式
- [ ] [constants](src/constants.ts) 目前都是合成器配置，可以考虑移动到 [src/services/synth/](src/services/synth/) 目录下

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [ ] Chrome 对 [useMidiControl](src/hooks/piano/useMidiControl.ts) 中的 `navigator.requestMIDIAccess()` 调用发出警告。官方说明为 https://chromestatus.com/feature/5138066234671104。这个问题好像无法修复，只要调用就会有警告
- [ ] [ControlCheckbox](src/components/shared/ControlCheckbox.tsx) 中的复选框在某些情况下会变小，应将其大小设为不可变

## Style

- [ ] 在脚注中补充关于应用的说明

## Feat

增加新模块

[TransferFunction](src/components/SoundSynthesizer/TransferFunction/index.tsx) 模块改为效果器。首先进行如下的分类，然后每类都有一个添加/删除效果器的按钮，并提供可调节的参数。效果器的类型包括

- 滤波和均衡。参考 [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)。效果器应该是在干声生成后再滤波，所以最好放弃在连接振荡器前修改增益的想法
  - [ ] 滤波。低通/高通（截止频率/谐振系数），带通/带组（中心频率/带宽因子）
  - [ ] 均衡。低架/高架（截止频率/增益比例），峰值（中心频率/带宽因子/增益比例）
  - [ ] 用 Plotly 绘制最终的幅频曲线
- 空间
  - [ ] 回声。可以选择衰减率/反射次数/延迟时间。主要逻辑其实也已经实现，但目前是把这些效果转为了脉冲响应然后在合成器中使用。改为使用 [DelayNode](https://mdn.org.cn/en-US/docs/Web/API/DelayNode/DelayNode) 做真正的回声
  - [ ] 混响。使用 [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode)，可以选择脉冲响应的预设，比如房间/浴室/大厅，并对预设用 KaTeX/Plotly 绘制公式和图像
  - [ ] 立体声。参考 [StereoPannerNode](https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode)/[PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)
- [ ] 压缩。参考 [DynamicsCompressorNode](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode)。压缩是减小音频信号的最大音量与最小音量之间的差距，属于动态调节，无法绘制幅频曲线
- [ ] 失真。参考 [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode)。重塑波形，包括过载/法兹/饱和，优先实现饱和效果
- [ ] 调制。包括镶边/移相/合唱/颤音（Tremolo，音量调制）/震音（Vibrato，音高调制）。不是核心效果，可以后续再实现。全通滤波器（相变中心/陡峭程度）可以用于移相

[SoundSynthesizer](src/components/SoundSynthesizer/index.tsx) 下增加可视化子模块

- 使用 Web Audio API 的 [AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) 分别显示频域和时域的波形

修改已有模块

- [ ] 增加修改键位映射的功能
- [ ] 修改合成器根据频率减少振幅和衰减时间的行为。不要使用谐波次数，而是用真正的频率
- 乐谱自动生成功能增强
  - [ ] 处理调号和节拍
  - [ ] 可以同步 textarea 中的修改

需要考虑是否使用第三方库的

- [ ] 可导入 `.midi` 文件，解析后接入自己的合成器来播放。可以关注 [Tone.js](https://github.com/Tonejs/Tone.js)/[Wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)
