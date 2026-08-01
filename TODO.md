# Todo

## Chore

## Refactor

- [ ] 使用 [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) 处理音频以降低延时

## Fix

- [ ] 相位调制目前还不是真正的相位调制，而是使用全通滤波器进行近似

## Style

## Feat

- [ ] 添加 XBOX 手柄支持，使用 [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)，详细方案如下
  1. 只使用左扳机 LT 和右扳机 RT 的模拟量来演奏琴键，其它按键全部用于选音
  2. 左摇杆和右摇杆偏移越大选音越快，左右是移动一个半音，上下是移动一个八度。同时，单独按下 左 / 右 / 上 / 下 和拉动左摇杆效果相同，分别为降半音 / 升半音 / 升八度 / 降八度；A / B / X / Y 和右摇杆同理。
  3. 左肩键 LB 和按下左摇杆 LS 用于临时升/降八度；同理，右肩键 RB 和按下右摇杆 RS 用于临时升/降八度
  4. 视图键和菜单键不使用
  5. 左扳机和右扳机初始位于 A3 和 C5
  6. 在琴键上方显示指示符，标注此时按下左扳机和右扳机会分别演奏哪个琴键
