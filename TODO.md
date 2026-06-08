# Todo

## Chore

- [ ] 尝试一下 [Biome](https://biomejs.dev/) 或类似的 Rust 工具

## Refactor

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] Chrome 对 [useMidiControl](src/hooks/piano/useMidiControl.ts) 中的 `navigator.requestMIDIAccess()` 调用发出警告。官方说明为 https://chromestatus.com/feature/5138066234671104。这个问题好像无法修复，只要调用就会有警告
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [ ] 快速按下不同的琴键，有时会发出类似弦断了的声音。暂时还没找到问题在哪里

## Style

- [ ] 在脚注中补充关于应用的说明
- [ ] 多用点 Icon

## Feat

效果

- [ ] 调制。包括镶边/移相/合唱/颤音（Tremolo，音量调制）/震音（Vibrato，音高调制）。全通滤波器（相变中心/陡峭程度）可以用于移相
- [ ] 早期反射增加相位参数，可以改变增益的符号
- [ ] 晚期尾音考虑用高斯噪声进行改进。可以用 Box-Muller 变换生成标准正态分布随机数

乐谱自动生成

- [ ] 处理调号和节拍
- [ ] 可以同步 textarea 中的修改

其余模块

- [ ] 增加修改键位映射的功能
