# Todo

## Chore

- [x] 迁移到 pnpm 上

## Refactor

- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时

## Fix

- [ ] 相位调制目前还不是真正的相位调制，而是使用全通滤波器进行近似
- [ ] localStorage 中的 piano-lab:app-settings 如果抛出错误，需要捕获并清空 localStorage 以避免程序崩溃

## Style

## Feat

- [ ] 添加 XBOX 手柄支持，使用 [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)
- [x] 键位映射增加 `清空键位` 按钮
