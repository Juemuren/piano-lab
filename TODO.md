# Todo

## Refactor

## Fix

- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了颜色变化，但不匹配的问题未能修复
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时
- [x] 组合键存在问题，比如 ctrl+a 会触发全选
- [x] 清除项目中已存在的 `aria-` 样式
- [ ] 第一次点击琴键时音符时长不正确，似乎 AudioContext 未能正确初始化

## Style

- [x] 改个更独特的应用名称
- [ ] 在脚注中补充关于应用的说明
- [ ] 设置面板样式修改

## Feat

- 需要 Web API 的
  - [ ] 允许录制乐谱演奏时的音频。可以参考 [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API)
- 需要修改合成器接口的
  - [x] 琴键能够获取按键时长，而不是只演奏默认的音符长度
  - [ ] 乐谱的反向输出功能可以根据按键时长自动规范到最匹配的音符长度
  - [ ] 把 MIDI note off 接到真正的 release
- 需要借助第三方库的
  - [ ] 音频波形可视化。可以关注一下 [Wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) 和 [Meyda](https://github.com/meyda/meyda)
  - [ ] 增加效果器，用 Web Audio API 做真实的卷积，而不是只在频域上变换。可以关注一下 [Tone.js](https://github.com/Tonejs/Tone.js)
  - [ ] 可导入 `.midi` 文件，解析后接入自己的合成器来播放。同样关注 [Tone.js](https://github.com/Tonejs/Tone.js)
