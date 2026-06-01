# AGENTS.md

本项目是一个基于 Web 的钢琴模拟器，使用 React + TypeScript + Tailwind CSS + Vite 构建应用

## React 指南

- 组件只负责渲染，业务逻辑相关的代码请写入 hook 中

## TypeScript 指南

- 除了 `type`/`interface` 外尽量不使用别的类型定义方式

## Tailwind CSS 指南

- 不要添加 `aria-` 属性
- `className` 尽量简洁，不要添加不必要的样式

## 代码质量

修改代码后请运行以下命令以保证质量

```sh
npm run lint
npm run format
npm run build
```
