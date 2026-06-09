# AGENTS.md

本项目是一个基于 Web 的钢琴模拟器，使用 React + TypeScript + Tailwind CSS + Vite 构建应用

## React 指南

- 组件只负责渲染，业务逻辑相关的代码请写入 hook 中
- 对于 button/input/select 等基础元素，尽量复用[共享组件](src/components/shared/)
- 需要由[根组件](src/App.tsx)管理的 state 统一改为 context，避免 prop drilling

## TypeScript 指南

- 除 `type`/`interface` 外尽量不使用别的类型定义方式
- [SynthConfig](src/services/synth/SynthConfig.ts) 不要兼容旧配置，保持代码干净

## Tailwind CSS 指南

- 不要添加 `aria-` 属性
- `className` 尽量简洁，减少不必要的样式

## i18n 指南

- 除非指定进行 i18n，否则只实现 [zh-CN](src/i18n/locales/zh-CN/) 的原始文本
- 不要设置回退行为，未翻译的语言直接暴露 key
- 能只用图标表示的就不要使用文字

## 代码质量

修改了 [src](src) 中的代码后，请运行以下命令以保证质量

```sh
npm run check
npm run build
```

不要运行 `npm run dev` 或类似的命令
