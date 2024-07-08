---
title: 基础
---

# {{ $frontmatter.title }}

ZAff 使用 Aff 类来模拟一个 .aff 文件模块，并使用 Note 的衍生类等描述谱面的各种元素。首先，使用 ESModule 的语法引入：

```ts
// export default Aff;
import Aff from "zaff";

// export { Aff };
import { Aff } from "zaff";
```

## 新建谱面

引入 ZAff，并输入以下代码：

```ts
const aff = new Aff();
const tg = Aff.timinggroup([
  Aff.timing(0, 128.00, 4.00),
  Aff.tap(0, 1),
  Aff.hold(0, 250, 4),
  Aff.arc(250, 500, 0.00, 1.00, "s", 1.00, 1.00, 0, "none", true, [250, 375, 500])
]);

aff.addTimingGroup(tg);
const str = aff.toString();
console.log(str);
```

点击运行，它将在控制台输出：

```
AudioOffset:0
-
timing(0,128.00,4.00);
(0,1);
hold(0,250,4);
arc(250,500,0.00,1.00,s,1.00,1.00,0,none,true)[arctap(250),arctap(375),arctap(500)];
```

我们得到了一张完整的谱面。

## 从文件读取

ZAff 导出了 `parseAff()` 和 `parseNote()` 两个方法，分别用于从字符串中解析整张谱面或单个 Note：

```ts
import { parseAff, parseNote } from "zaff";

const aff = parseAff(`
AudioOffset:0
-
timing(0,128.00,4.00);
(0,1);
hold(0,250,4);
arc(250,500,0.00,1.00,s,1.00,1.00,0,none,true)[arctap(250),arctap(375),arctap(500)];
`);

const note = parseNote<Tap>("(233,1);");
```

然后，你可以使用 `toString()` 方法将 Aff 或 Note 对象转换为字符串。

如果是 Node.js 等服务端环境，则可以从文件中读取或导出：

```ts
import { readFile } from "node:fs/promise";

const file = await readFile("2.aff");
const aff = parseAff(file.toString());

/* 一些对谱面的操作 */

const str = aff.toString();
fs.writeFileSync("3.aff", str);
```

## 元素类（Note）

ZAff 使用类似 `Aff.tap(0, 1)` 的代码风格对 Note 进行实例化，返回一个 Note 对象，它的传参等同于谱面文件中描述 Note 的语句。另外，也可以使用配置对象来初始化 Note，例如：

```ts
Aff.arc({
  time: 250,
  timeEnd: 500,
  x1: 0.00,
  x2: 1.00,
  easing: "s",
  y1: 1.00,
  y2: 1.00,
  color: 0,
  arctap: [250, 375, 500]
});
```

未赋值的属性，将自动分配其对应的默认值。

### Tap

Tap 是 Arcaea 中最简单的 Note 对象，它只有 `time` 和 `track` 两个属性。Tap 继承了 Note 的基本方法，可以进行以下操作：

```ts
// 直接传参
const tap = Aff.tap(0, 1);

// 配置对象
const tap = Aff.tap({
  time: 0,
  track: 1
});

tap.time = 233;             // 将时间点设置为233ms
tap.track = 3;              // 将轨道编号设置为3

tap.mirror();               // 镜像
tap.moveBy(100);            // 以当前时间点为基准，偏移100ms（可以为负数）
tap.moveTo(2333);           // 将时间点移动至2333ms
tap.speedAs(1.5);           // 按照1.5倍速变换时间点

const str = tap.toString(); // 生成字符串形式的Note语句
const taptap = tap.clone(); // 深拷贝
```

值得一提的是，`track` 属性支持小数，因此以下语句也是合理的：

```ts
tap.track = 0.5;

console.log(tap.toString());
// (0, 0.5);
```

### Hold

Hold 继承自 Tap，多了一个 `timeEnd` 属性。使用方式大致等同于 Tap：

```ts
const hold = Aff.hold(0, 250, 4);

hold.timeEnd = 500; // 将结束时间点设置为500ms
```

### Arc

Arc 继承自 Hold，属性最多且最为复杂（然而有一个无用的属性 `track`），因此有额外的方法供我们调用：

```ts
const arc = Aff.arc(250, 500, 0.00, 1.00, "s", 1.00, 1.00, 0, "none", false);

arc.x1 = 0.50;
arc.x2 = 1.00;
arc.easing = "sosi";
arc.y1 = 0.00;
arc.y2 = 1.61;
arc.color = 3;
arc.hitsound = "laur_kick_roll_wav";
arc.skyline = true;
arc.arctap.push(500);

const { x, y } = arc.at(375); // 获取在375ms处的坐标
const tg = arc.cut(8);        // 进行8等分切片，返回一个TimingGroup
```

### Flick

Flick 拥有以下属性：

* `time` (ms)：时间点
* `x` (px)：初始横坐标
* `y` (px)：初始纵坐标
* `vx` (float)：滑动向量横向值
* `vy` (float)：滑动向量纵向值

### Timing

Timing 拥有以下属性：

* `time` (ms)：时间点
* `bpm` (float)：节奏速度
* `beats` (float)：每小节四分音符的数量

### Camera

Camera 拥有以下属性：

* `time` (ms)：时间点
* `x` (px)：x 轴移动，正->向右，负->向左
* `y` (px)：y 轴移动，正->向上，负->向下
* `z` (px)：z 轴移动，正->向后，负->向前
* `xoyAngle` (deg°)：xoy 平面角度，正->逆时针，负->顺时针
* `yozAngle` (deg°)：yoz 平面角度，正->抬头，负->低头
* `xozAngle` (deg°)：xoz 平面角度，正->逆时针，负->顺时针
* `easing` (preset)：缓动类型（l, s, qi, qo, reset）
* `duration` (ms)：持续时间

### SceneControl

SceneControl 拥有以下属性：

* `time` (ms)：时间点
* `type` (preset)：场景控制类型
* `param1` (float)：参数 1
* `param2` (int)：参数 2

## 容器类

### Aff

Aff 是一个类似数组的对象，它模拟了一张完整的谱面，可以用以下方式处理：

```ts
const aff = new Aff({
  audioOffset: 200,
  density: 1
});

aff.audioOffset = 400;
aff.density = 2;

const tg0 = Aff.timinggroup();
const tg1 = Aff.timinggroup();
aff.addTimingGroup(tg0, tg1);
// aff[0] = tg0
// aff[1] = tg1
// aff.length = 2

while (aff.length) {
  aff.removeTimingGroup(0);
}
// aff.length = 0
```

传入的第一个 TimingGroup 将作为 `.aff` 文件的顶层输出，即 `Aff[0]`。

Aff 上有一些对内部 Note 进行批量操作的方法，如：

```ts
aff.mirror();      // 谱面镜像
aff.moveBy(500);   // 谱面偏移500ms
aff.sort();        // 谱面排序（按时间）
aff.speedAs(1.5);  // 谱面1.5倍变速
```

以上方法实际上是通过遍历器调用了 Aff 中所有 TimingGroup 上的对应方法，使用扩展运算符对 Aff 进行展开，即可快速遍历其中的 TimingGroup：

```ts
// 按照时间倒序排列
[...aff].forEach((tg) => {
  tg.sort((a, b) => b.time - a.time);
});
```

### TimingGroup

TimingGroup 继承自 Array，可以使用所有原生 Array 对象的方法，像操作 js 原生数组那样向其中添加 Note：

```ts
// 第二个参数可传入由特殊标识字符串构成的数组
const tg = Aff.timinggroup([
  Aff.timing(0, 128.00, 4.00)
], [
  "noinput",
  "anglex200",
  "angley300"
]);

for (let i = 0; i < 5; i++) {
  const tap = Aff.tap(1000 + i * 20, 1);
  tg.push(tap);
}

console.log(tg.toString(true));
// timinggroup(noinput_anglex200_angley300){
//   timing(0,128.00,4.00);
//   (1000,1);
//   (1020,1);
//   (1040,1);
//   (1060,1);
//   (1080,1);
// };

// 当向toString方法传入false或省略参数时，将不输出timinggroup(){}的部分
console.log(tg.toString());
// timing(0,128.00,4.00);
// (1000,1);
// (1020,1);
// (1040,1);
// (1060,1);
// (1080,1);
```

此外，TimingGroup 上还挂载了一些 Note 中的方法，用于对内部的 Note 进行批量操作：

```ts
tg.mirror();     // 整体镜像
tg.moveBy(500);  // 整体偏移500ms
tg.speedAs(1.5); // 整体1.5倍变速
```