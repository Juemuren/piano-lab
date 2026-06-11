# Todo

## Chore

- [x] 迁移到 [Biome](https://biomejs.dev/)
- [x] 钩子 npm run build 太慢了，改为只进行类型检查，或者尝试一下 [tsgo](https://github.com/microsoft/typescript-go)

## Refactor

- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时

## Fix

- [x] 效果链存在 Bug，如果同时启用压缩和混响，之后再修改混响，会导致声音消失。合理怀疑效果链对 AudioNode 对象的管理存在问题
- [ ] 相位调制不是真正的相位调制，而是使用全通滤波器进行近似

## Style

- [x] [VerticalSliderGroup](src/components/shared/VerticalSliderGroup.tsx) 中的 [<input type="range">](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range) 在禁用时，滑钮的颜色无法修改，即时设置 `appearance: none` 也是如此。但各浏览器暴露的伪元素不一致，导致必须得写 `::-webkit-` / `::-moz` 这种丑陋的代码。看起来必须得在代码丑陋和界面丑陋里做出抉择。浏览器厂商，我恨你……
- [x] `<input type="range">` 在使用 `appearance: none` 后自动着色消失了。是的，依旧需要编写 `::-webkit-` / `::-moz` 这种丑代码
- [x] [ControlCheckbox](src/components/shared/ControlCheckbox.tsx) 中的 [<input type="checkbox">](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox) 还在使用原生样式，可能要美化一下

## Feat
