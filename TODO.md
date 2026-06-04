# Todo

## Refactor

- [ ] [共享组件](src/components/shared/) 下的 button 很混乱，存在 3 种 button，最好统一一下

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [ ] Chrome 对 [useMidiControl](src/hooks/piano/useMidiControl.ts) 中的 `navigator.requestMIDIAccess()` 调用发出警告。官方说明为 https://chromestatus.com/feature/5138066234671104。这个问题好像无法修复，只要调用就会有警告

## Style

- [ ] 在脚注中补充关于应用的说明

## Feat

- [ ] 增加修改键位映射的功能
- 乐谱自动生成功能增强
  - [ ] 处理调号和节拍
  - [ ] 可以同步 textarea 中的修改
- 需要借助第三方库的
  - [ ] 音频波形可视化。可以关注一下 [Wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) 和 [Meyda](https://github.com/meyda/meyda)
  - [ ] 增加效果器，用 Web Audio API 做真实的卷积，而不是只在频域上变换。可以关注一下 [Tone.js](https://github.com/Tonejs/Tone.js)
  - [ ] 可导入 `.midi` 文件，解析后接入自己的合成器来播放。同样关注 [Tone.js](https://github.com/Tonejs/Tone.js)
