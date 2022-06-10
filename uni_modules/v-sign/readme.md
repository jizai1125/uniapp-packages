# v-sign 手写签名

**如有问题或者建议，欢迎留言或加群联系我（群号：736123963）！！！将保持维护！！！**

<img src="https://i.loli.net/2021/12/02/bgsfnDmCzXGq8ct.png" alt="uniapp 交流群群聊二维码" style="zoom: 80%;" />

## 快速使用

基础示例，具体说明见下方 API，**若需要使用内置子组件，见下方子组件说明。**

```html
<template>
	<v-sign :width="winWidth + 'px'" @init="onSignInit"></v-sign>
	<button @click="clear">清空<button>
</template>
<script>
  export default {
    data() {
      return {
        winWidth: 0
      }
    },
    created() {
      // 宽度设为可使用窗口宽度
      const { windowWidth } = uni.getSystemInfoSync()
      this.winWidth = windowWidth
    },
    methods: {
      onSignInit(signCtx) {
        this.signCtx = signCtx
      },
      // 清空
      clear() {
        this.signCtx.clear()
      }
    }
  }
</script>
```

## API

### 属性 (Props)

|   属性名    |     类型      |    默认值     |             说明             |
| :---------: | :-----------: | :-----------: | :--------------------------: |
|     cid     |    String     | v-sign-时间戳 |          canvas id           |
|    width    | String/Number |       -       | canvas 宽度，Number 单位 rpx |
|   height    | String/Number |       -       | canvas 高度，Number 单位 rpx |
| customStyle |    Object     |       -       |      canvas 自定义样式       |
|  lineWidth  |    Number     |       4       |        线宽，单位 px         |
|  lineColor  |    String     |     #333      |            线颜色            |
|   bgColor   |    String     |     #fff      |         画布背景颜色         |

### 事件（Events）

| 事件称名 |                              说明                              |               返回值               |
| :------: | :------------------------------------------------------------: | :--------------------------------: |
|  @init   | 创建完 canvas 实例后触发，向外提供 canvas 实例，撤回，清空方法 | Object：具体见下方事件回调参数说明 |
|  @clear  |                         清空画布后触发                         |                 -                  |
| @revoke  |                         撤销操作后触发                         |            坐标信息数组            |
|   @end   |                       每次绘制结束后触发                       |            坐标信息数组            |

### 事件回调参数说明

#### **`init(ctx: SignContext)`**

可以通过该事件回调暴露的 clear、revoke 等方法操作画布。

```java
interface SignContext {
  // canvas 实例
	ctx: object;
	// 清空画布
	clear(): void;
	// 撤回
	revoke(): void;
  // 保存 png 图片，文件名 filename 配置仅支持 h5
  saveImage(filename: string): Promise<object>;
  // 返回图片临时文件路径，config 参数同 uni.canvasToTempFilePath方法，内部只是做了 Promise 化处理而已
  canvasToTempFilePath(config: object): Promise<object>;
  // 设置画布背景色
  setBackgroundColor(color: string): void;
  setLineWidth(value: number): void;
  setLineColor(value: string): void;
  // 获取坐标信息数组
  getLineData(): Array<object>;
}
```

示例：

```html
<template>
	<v-sign @init="onSignInit"></v-sign>
	<button @click="clear">清空<button>
	<button @click="revoke">撤回<button>
    <button @click="saveTempFilePath">保存临时图片路径<button>
    <button @click="saveImage">保存图片<button>
</template>
<script>
  export default {
    methods: {
      onSignInit(signCtx) {
          this.signCtx = signCtx
      },
      // 清空
      clear() {
          this.signCtx.clear()
      },
      // 撤回
      revoke() {
          this.signCtx.revoke()
      },
      // 保存为临时图片路径，h5返回 base64
      saveTempFilePath() {
          this.signCtx.canvasToTempFilePath()
      },
      // 保存 png 图片
      saveImage() {
          this.signCtx.saveImage()
      }
    }
  }
</script>
```

# 子组件

子组件需要包裹在 `v-sign` 组件内使用！！！

## 按钮控件（v-sign-action）

### 示例

```html
<template>
  <v-sign>
    <v-sign-action @save="save" @clear="clear" @prev="revoke"></v-sign-action>
  </v-sign>
</template>
<script>
  export default {
    methods: {
      save(tempFilePath) {
        console.log(tempFilePath);
      },
    },
  };
</script>
```

### API

### 属性 (Props)

|   属性名    |     类型      |          默认值           |                          说明                          |
| :---------: | :-----------: | :-----------------------: | :----------------------------------------------------: |
|   actions   |     Array     | ["clear", "prev", "save"] | 按钮配置；清空（clear）, 撤回（prev） 保存图片（save） |
|   border    |    Boolean    |           true            |                     按钮是否有边框                     |
|    space    | String/Number |            12             |               按钮间隔，Number 单位 rpx                |
| customStyle |    Object     |             -             |                    根元素自定义样式                    |

### 事件（Events）

点击对应类型按钮触发对应事件， 例如：配置了清空（clear）按钮，点击则触发 clear 事件。

---

## 画笔组件（v-sign-pen）

### 示例

```html
<template>
  <v-sign>
    <v-sign-pen></v-sign-pen>
  </v-sign>
</template>
<script>
  export default {};
</script>
```

### API

### 属性 (Props)

|   属性名    |  类型   |      默认值      |             说明             |
| :---------: | :-----: | :--------------: | :--------------------------: |
|    type     | String  |      circle      | 选项样式，可选 circle \ line |
|    label    | String  |        -         |             标签             |
|    sizes    |  Array  | [2, 4, 6, 8, 10] |    画笔尺寸数组，单位 px     |
|    color    | String  |       #333       |           选项颜色           |
| activeColor | String  |       #333       |          选中项颜色          |
|   border    | Boolean |       true       |       选中项是否有边框       |
| borderWidth | Number  |        4         |      边框大小，单位 rpx      |
|    space    | Number  |        20        |      选项间隙，单位 rpx      |
|   bigger    | Number  |        2         |       圆点变大变粗倍数       |
|   minSize   | Number  |        4         |    圆点最小尺寸，单位 px     |

### 事件（Events）

| 事件称名 |        说明        |       返回值       |
| :------: | :----------------: | :----------------: |
| @change  | 选择画笔大小时触发 | size：画笔尺寸大小 |

---

## 颜色选择器组件（v-sign-color）

### 示例

```html
<template>
  <v-sign>
    <v-sign-color></v-sign-color>
  </v-sign>
</template>
<script>
  export default {};
</script>
```

### API

### 属性 (Props)

|   属性名    |     类型      |                             默认值                              |         说明          |
| :---------: | :-----------: | :-------------------------------------------------------------: | :-------------------: |
|    type     |    String     |                             square                              | 选项样式，可选 circle |
|    color    |    String     |                                -                                |       默认颜色        |
|   options   |     Array     | ['#333', '#f44236', '#3f51b5', '#2195f3', '#ffeb3b', '#ff9900'] |        备选色         |
|    size     | Number/String |                               44                                | 圆/方形大小，单位 rpx |
|    tick     |    Boolean    |                              true                               |     是否选中打勾      |
|  tickSize   | Number/String |                               24                                |        勾大小         |
| borderColor |    String     |                              #fff                               |       边框颜色        |
|   border    |    Boolean    |                              false                              |      是否有边框       |
|    space    | Number/String |                               16                                |       选项间隙        |

### 事件（Events）

| 事件称名 |      说明      | 返回值 |
| :------: | :------------: | :----: |
| @change  | 选择颜色时触发 | color  |
