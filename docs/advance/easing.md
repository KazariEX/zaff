---
title: 缓动
---

# {{ $frontmatter.title }}

缓动是制作动画、提升谱面视觉效果的核心之一，ZAff 提供了一系列基本缓动函数，以及创建自定义缓动曲线的方法。

## 基本曲线

ZAff 导出了 4 个游戏内原生支持的缓动曲线，与音弧的四种缓动类型一一对应，分别为：

* `bezier()`，对应 `b`
* `linear()`，对应 `s`
* `sin()`，对应 `si`
* `cos()`，对应 `so`

这些函数表示取值范围和值域均为 [0, 1] 的曲线，在音弧中表示 timing 和 x / y 坐标的对应关系。考察 `Arc#at()` 方法的实现：

```ts
function at(t: number) {
  const percent = (t - this.time) / (this.timeEnd - this.time);
  const [cx, cy] = getBiaxialCurves(this.easing);

  return {
    x: this.x1 + cx(percent) * (this.x2 - this.x1),
    y: this.y1 + cy(percent) * (this.y2 - this.y1)
  };
}
```

不难发现，该方法通过向缓动曲线中传入指定 timing 在总时长上的占比，获取 x / y 坐标的百分比偏移，最后计算得出音弧在该点的坐标。

至于获取缓动曲线的 `getBiaxialCurves()` 方法，将在后面的小节中介绍。

## 自定义曲线

游戏中的 `b` 类音弧，实际上是一条三阶贝塞尔曲线，它的两个控制点分别为 `(1/3, 0)` 和 `(2/3, 1)`。ZAff 提供了 `createBezier()` 方法，供我们创建自定义的缓动曲线。该方法默认起点和终点分别为 `(0, 0)` 和 `(1, 1)`，传入的四个参数分别为两个控制点的 x / y 坐标。示例如下：

```ts
import { createBezier } from "zaff";

const curve = createBezier(0.11, 0.19, 0.23, 0.66);
console.log(curve(0.5));
// 0.6994330827275067
```

可以在 [这个页面](https://cubic-bezier.com/) 测试三阶贝塞尔曲线。

## 缓动类型

`Arc#easing` 是一个字符串类型的属性，它的可选值与游戏内音弧的缓动类型相同。`getBiaxialCurves()` 方法用于从原生缓动类型获取对应的曲线，观察下面这个例子：

```ts
import { cos, getBiaxialCurves, sin } from "zaff";

const [cx, cy] = getBiaxialCurves("siso");

console.log(cx === sin); // true
console.log(cy === cos); // true
```

容易看出，`siso` 即 x 轴上为 `sin` 曲线、y 轴上为 `cos` 曲线的缓动类型。

另外还有一个 `getUniaxialCurve()` 方法，用于从单轴的缓动类型获取对应的曲线。使用方法类似，返回一个 EasingFunction 对象。

## 切分

### Arc

`Arc#cut()` 方法还可传入一个配置对象，属性如下：

| 属性  | 类型             | 描述                               |
| ----- | ---------------- | ---------------------------------- |
| start | `number`         | 起始时间                           |
| end   | `number`         | 结束时间                           |
| ender | `boolean`        | 是否生成两端的音弧（默认 `false`） |
| cx    | `EasingFunction` | x 轴缓动曲线                       |
| cy    | `EasingFunction` | y 轴缓动曲线                       |

```ts
const arc = Aff.arc(0, 2333, 0.00, 1.00, "s", 0.00, 1.00, 0, "none", false);
const tg = arc.cut(9, {
  start: 810,
  end: 1919,
  ender: true,
  cx: sin,
  cy: bezier
});
```

此时传入的曲线将覆盖音弧原来的缓动类型，如果参数缺省则保留。

### Timing