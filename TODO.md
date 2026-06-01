# Todo

## Refactor

- [x] 对 [types.ts](src/types.ts) 进行重构，将 Spectrum 和 TransferFunction 的职责 Preset/Config/Value 区分清楚
- [x] 重构 [AbcEditor](src/components/AbcEditor/index.tsx) 将预设选择和文本框提取为子组件

## Fix

- [x] Android Chrome 上 afterprint 不是在 print 后触发，而是在 print 时就触发。这导致 PDF 打印功能在移动端上存在问题。修复这个问题有两种方案，暂时使用第二种进行了修复
  - 不使用 afterprint 事件，但这会导致 [usePdfExport.ts](src/hooks/abc/usePdfExport.ts) 代码语义不一致
  - 直接打印 [AbcEditor.tsx](src/components/AbcEditor/index.tsx) 中已有的乐谱，但这要求 `renderAbc` 时添加 `oneSvgPerLine: true` 参数，于是还得修复 SVG 的导出
- [ ] 点击音符调整进度时，有时不会正确匹配，未匹配的音符变成红色。目前禁用了红色，但不匹配的问题未能修复
- [x] 修复 SVG/PNG 的导出
- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频降低延时
- [x] 给所有的 select 和 textarea 元素添加 id 以消除浏览器警告

## Style

- [ ] 取个更独特的应用名称和图标

## Feat

准备实现的

- [x] 支持键盘操作，映射方案如下，并使用 `z` 降八度，`x` 升八度。默认八度为 4

| 音  | C   | C#  | D   | D#  | E   | F   | F#  | G   | G#  | A   | A#  | B   | C   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 键  | A   | W   | S   | E   | D   | F   | T   | G   | Y   | H   | U   | J   | K   |

- [x] 键盘操作的功能可以开启或关闭，默认开启
- [x] 鼠标控制和触摸控制的功能也可以开启或关闭，默认开启
- [x] 按下琴键可以修改乐谱，即把琴键的输入反向输出到文本框，从而自动生成乐谱。只获取音高，并使用默认音符长度。此功能默认关闭，提供选项开启
- [x] 接入真实的 MIDI 设备。使用 [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)
- [ ] 显示已连接的 MIDI 输入设备名称和连接状态，并在 MIDI 权限失败 / 浏览器不支持时给出提示
- [ ] 可以选择单个 MIDI 输入设备，而不是监听全部输入
- [ ] 把 MIDI note off 接到真正的 release，而不是只能弹奏默认的音符长度

有待考虑的

- [ ] 增加效果器，用 Web Audio API 做真实的卷积，而不是只在频域上变换。可以关注一下 [Tone.js](https://github.com/Tonejs/Tone.js)
- [ ] 音频波形可视化。可以关注一下 [Wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) 和 [Meyda](https://github.com/meyda/meyda)
- [ ] 可导入 `.midi` 文件，解析后接入自己的合成器来播放。同样关注 [Tone.js](https://github.com/Tonejs/Tone.js)
- [ ] 可录制乐谱演奏时的音频，可以使用 [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API)
