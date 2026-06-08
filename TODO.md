# Todo

## Chore

- [ ] 尝试一下 [Biome](https://biomejs.dev/) 或类似的 Rust 工具

## Refactor

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] Chrome 对 [useMidiControl](src/hooks/piano/useMidiControl.ts) 中的 `navigator.requestMIDIAccess()` 调用发出警告。官方说明为 <https://chromestatus.com/feature/5138066234671104> 。这个问题好像无法修复，只要调用就会有警告
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [x] 快速按下不同的琴键，有时会发出类似弦断了的声音。此时根据频域分析的结果，声音的频谱非常密集，几乎铺满而没有空隙。问题大概出在 [SynthEngine](src/services/synth/SynthEngine.ts) 的 `stopNote()` 函数中。GainNode 的 gain.value 并不可靠，快速松键时可能把正在 attack/decay 的声音瞬间跳到错误电平，再进入 release，从而产生宽频瞬态

## Style

- [x] 在脚注中补充关于应用的说明
- [x] 多用点 Icon

## Feat

效果

- 增加调制效果。用一个低频振荡器让被调制的量周期性变化
  - [x] 振幅调制（Tremolo）
    - 公式 $A_y(t)=[1-\frac{d}{2}+\frac{d}{2}\sin(2\pi f_m t)]A_x(t)$
    - 参数
      - d 调制深度
      - f_m 调制频率
  - [x] 频率调制（Vibrato）
    - 公式 $f_y(t)=[1 + (2^{c/1200}-1)\sin(2\pi f_m t)]f_x(t)$
    - 参数
      - c 调制深度
      - f_m 调制频率
  - [x] 相位调制（Phaser）。全通滤波器可以用于相位调制
  - [x] 延时调制（Chorus/Flanger）
- [x] 早期反射增加相位参数，可以改变增益的符号
- [x] 晚期尾音考虑用高斯噪声进行改进。可以用 Box-Muller 变换生成标准正态分布随机数

乐谱自动生成

- [x] 处理调号
- [x] 处理节拍
- [x] 自动分行
- [x] 增加恢复默认和清空乐谱的功能

其余模块

- [x] 增加修改键位映射的功能
- [x] 全局设置进行持久化保存
