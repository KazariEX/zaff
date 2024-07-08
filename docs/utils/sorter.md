---
title: 排序
---

# {{ $frontmatter.title }}

ZAff 导出了 `sortAff()` 和 `sortTimingGroup()` 两个方法，分别用于对 Aff 和 TimingGroup 内的 Note 进行排序。按照以下方式导入：

```ts
import { sortAff, sortTimingGroup } from "zaff";
```

## 基本用法

直接传入 Aff 或 TimingGroup 对象，内部的 Note 将默认按照时间顺序从小到大排列：

```ts
sortAff(aff);
sortTimingGroup(tg);
```

如果想要按照 Note 类型排序，可在第二个参数中传入一个配置项，例如：

```ts
sortAff(aff, {
  mode: "kind"
});
```

此时，内部的 Note 将按照各自的类型，默认以 `timing` -> `tap` -> `flick` -> `hold` -> `arc` -> `camera` -> `scenecontrol` 的顺序进行排列。

当然，我们可以自定义这条排序规则，使它按照我们所规定的顺序排列：

```ts
sortAff(aff, {
  mode: "kind",
  kinds: ["arc", "camera", "flick", "hold", "scenecontrol", "tap", "timing"]
});
```

> [!TIP]
> ZAff 会根据 `mode` 字段的值优先选择排列方式。当 `mode: "time"` 时，若两 Note 时间一致，则会再根据 Note 类型进行排序；反之亦然。

配置对象上还有一 `desc` 字段，能够指定整体的排序方向，默认为 `false`，即升序。

实际上，它仅仅是在排序的末尾调用了数组的 `reverse()` 方法：

```ts
desc && tg.reverse();
```