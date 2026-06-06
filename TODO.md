# Todo

## Refactor

- [ ] [共享组件](src/components/shared/) 下存在 3 种 button，最好进行统一
- [x] [SynthEngine](src/services/synth/SynthEngine.ts) 中分离出 BaseVoice/EffectChain 为后续添加效果器作铺垫
- [x] i18n key 名称重构
- [ ] [Effect](src/components/SoundSynthesizer/Effect) 下的组件可能会非常多，需要继续增加目录

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [ ] Chrome 对 [useMidiControl](src/hooks/piano/useMidiControl.ts) 中的 `navigator.requestMIDIAccess()` 调用发出警告。官方说明为 https://chromestatus.com/feature/5138066234671104。这个问题好像无法修复，只要调用就会有警告
- [x] [ControlCheckbox](src/components/shared/ControlCheckbox.tsx) 中的复选框在某些情况下会变小，应将其大小设为不可变
- [x] [SettingsPanel](/src/components/SettingsPanel/index.tsx) 的宽度会自动变化，改为宽度不变

## Style

- [ ] 对项目中的数个 [ControlSelect](src/components/shared/ControlSelect.tsx) 补充 label
- [ ] 在脚注中补充关于应用的说明

## Feat

增加新模块

[TransferFunction](src/components/SoundSynthesizer/TransferFunction/index.tsx) 模块改为效果器。首先进行如下的分类，然后每类都有一个添加/删除效果器的按钮，并提供可调节的参数。效果器的类型包括

- 滤波和均衡。参考 [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)。效果器应该是在干声生成后再滤波，所以最好放弃在连接振荡器前修改增益的想法
  - [x] 滤波。低通/高通（截止频率/谐振系数），带通/带组（中心频率/带宽因子）
  - [x] 均衡。低架/高架（截止频率/增益比例），峰值（中心频率/带宽因子/增益比例）
  - [x] 用 Plotly 绘制最终的幅频曲线
- 混响
  - [x] 早期反射。可以选择反射次数/增益/延时。两种方案，目前使用第二种
    1. 使用 [DelayNode](https://mdn.org.cn/en-US/docs/Web/API/DelayNode/DelayNode)
    2. 转为脉冲响应然后使用 [ConvolverNode](https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode)
  - [x] 晚期尾音。使用 ConvolverNode，脉冲响应为指数衰减，预设包括 浴室/车库/大厅/教堂
  - [x] 用 KaTeX/Plotly 绘制脉冲响应的公式和图像
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
