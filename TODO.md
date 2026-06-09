# Todo

## Chore

- [ ] 尝试一下 [Biome](https://biomejs.dev/) 或类似的 Rust 工具

## Refactor

- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时

## Fix

- [ ] 效果链存在 Bug，如果同时启用压缩和混响，之后再修改混响，会导致声音消失。合理怀疑效果链对 AudioNode 对象的管理存在问题
- [ ] 相位调制不是真正的相位调制，而是使用全通滤波器进行近似

## Style

## Feat
