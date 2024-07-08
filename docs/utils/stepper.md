---
title: 步进
---

# {{ $frontmatter.title }}

步进器用于按照指定的节奏模式生成时间片段。按照以下方式导入：

```ts
import { Stepper } from "zaff";
```

## 基本用法

初始化步进器时，既可以传入一个配置对象，也可以直接传入一个 Timing：

```ts
const stepper = new Stepper({
  time: 2333,
  bpm: 185,
  beats: 4
});

// const timing = Aff.timing(...);
const stepper = new Stepper(timing);
```

在步进器上挂载了一个核心方法 `generate()`，如果我们想生成 332 的节奏型，则可以这么做：

```ts
const it = stepper.generate([3, 3, 2], {
  noteValue: 8,
  timeEnd: 7777
});
```

第一个参数 `pattern` 即为期望的节奏型数组，它表示依次按照 3 个音符、3 个音符、2 个音符的模式循环生成时间戳。第二个参数为配置对象，其中 `noteValue` 属性表示音符值，如 `noteValue: 8` 表示以 8 分音符为前者的基准，如果缺省则默认取步进器上的 `beats` 属性值。

这个方法实际上是一个 Generator 函数，使用 `for ... of ...` 来运行返回的遍历器对象，便可以生成相应的时间片段了：

```ts
for (const time of it) {
  console.log(Math.floor(time));
}
// 2333, 2819, 3305, 3630, 4116, 4603, 4927...
```