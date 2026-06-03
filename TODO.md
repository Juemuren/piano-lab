# Todo

## Refactor

- [x] 重构 [SynthEngine](src/services//synth/SynthEngine.ts)，导出 startNote/stopNote 接口
- [x] 添加 createVoiceStartPlans/createVoiceStopPlans 函数，继续分离纯计算和业务逻辑
- [x] 将 [SynthEngine](src/services//synth/SynthEngine.ts) 中的纯函数提取出来
- [x] [types](src/types.ts) 中的类型拆分成多个文件，放入 `src/types` 中
- [x] [context](src/contexts/) 下的文件拆分到不同的目录中
- [ ] [ControlSelect](src/components/shared/ControlSelect.tsx) 增加一个可选元素 label
- [ ] [ControlRange](src/components/shared/ControlRange.tsx) 增加一个可选元素 p

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [x] 组合键存在问题，比如 ctrl+a 会触发全选
- [x] 清除项目中已存在的 `aria-` 样式
- [x] 第一次点击琴键时音符时长不正确，startNote 的调用处存在问题，未能正确处理异步
- [x] playNote 处同样也有问题

## Style

- [x] 改个更独特的应用名称
- [ ] 在脚注中补充关于应用的说明
- [ ] 设置面板样式修改，采用设置/子设置的方式

## Feat

- [ ] 增加修改键位映射的功能

- 需要 Web API 的
  - [ ] 允许录制乐谱演奏时的音频。可以参考 [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API)
- 需要修改合成器接口的
  - [x] 琴键能够获取按键时长，而不是只演奏默认的音符长度
  - [x] 处理 MIDI 设备的按住和释放
  - [x] 增强乐谱的反向输出功能：松开琴键后将音符写入乐谱，可以根据按压时长自动获取最匹配的音符长度。目前设想的方案是
    - 可以在设置面板中选择 默认音符长度/速度，这些会直接写入 abd 的 header 中。设置面板中会显示 1/4 音符的时长（单位为秒），通过计算按键时长相对其的倍数，然后四舍五入到最匹配的音符时长
    - 可以匹配附点音符
    - 暂时不处理 节拍/调号
- 需要借助第三方库的
  - [ ] 音频波形可视化。可以关注一下 [Wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) 和 [Meyda](https://github.com/meyda/meyda)
  - [ ] 增加效果器，用 Web Audio API 做真实的卷积，而不是只在频域上变换。可以关注一下 [Tone.js](https://github.com/Tonejs/Tone.js)
  - [ ] 可导入 `.midi` 文件，解析后接入自己的合成器来播放。同样关注 [Tone.js](https://github.com/Tonejs/Tone.js)
