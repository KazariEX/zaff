---
title: 物量
---

# {{ $frontmatter.title }}

ZAff 导出了 `countAff` 和 `countTimingGroup` 两个方法，前者用于计算整个 Aff 的物量，后者用于计算单个 TimingGroup 的物量。按照以下方式导入：

```ts
import { countAff, countTimingGroup } from "zaff";
```

## 基本用法

直接传入 Aff 或 TimingGroup 对象即可：

```ts
const count1 = countAff(aff);
const count2 = countTimingGroup(tg);
```

如果想要限定物量的范围，可在第二个参数中传入一个配置对象：

```ts
const count = countAff(aff, {
  from: 2333,
  to: 6666
});
```

对于 `countTimingGroup` 方法，它包含以下配置项：

| 属性     | 类型     | 描述                                      |
| -------- | -------- | ----------------------------------------- |
| from     | `number` | 起始时间                                  |
| to       | `number` | 结束时间                                  |
| density  | `number` | 密度，等价于 `Aff#density` 属性           |
| connects | `Arc[]`  | 外部 Arc，用于判断内部 Arc 是否被首尾相连 |