# Todo

## Refactor

## Fix

## Style

## Feat

已考虑的

- [ ] 增加播放进度控制条，去除双击音符这种奇怪的操作，单击音符变为改变进度，在播放时禁用单击功能。参考 https://examples.abcjs.net/synth-player
- [x] 可将乐谱打印为 PDF。参考 https://examples.abcjs.net/printable
- [x] 可导出 `.midi` 文件。参考 https://examples.abcjs.net/editor-synth
- [ ] 支持键盘操作

待考虑的

- [ ] 用 Web Audio API 做真实的卷积，而不是只在频域上变换
- [ ] 可导入 `.midi` 文件
- [ ] 可录制乐谱演奏时的音频
- [ ] 按下琴键可以修改乐谱，即把琴键的输入反向输出到文本框，从而自动生成乐谱
  - 简易实现：只获取音高，并设为默认音符长度
  - 高级实现：还获取按键时长，并自动规范到最接近的音符长度
