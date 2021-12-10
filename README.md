# v-sign  手写签名

**如有问题或者建议，欢迎留言！！！将保持维护！！！**

## 基本用法

```vue
<v-sign></v-sign>
```

## API

### 属性 (Props)

|   属性名    |     类型      |    默认值     |             说明             |
| :---------: | :-----------: | :-----------: | :--------------------------: |
|     cid     |    String     | v-sign-时间戳 |          canvas id           |
|    width    | String/Number |     100%      | canvas 宽度，Number 单位 rpx |
|   height    | String/Number |    300rpx     | canvas 高度，Number 单位 rpx |
| customStyle |    Object     |       -       |      canvas 自定义样式       |
|  lineWidth  |    Number     |       4       |             线宽             |
|  lineColor  |    String     |     #000      |            线颜色            |

### 事件（Events）

| 事件称名 |                             说明                             |               返回值               |
| :------: | :----------------------------------------------------------: | :--------------------------------: |
|  @init   | 创建完 canvas 实例后触发，向外提供 canvas实例，撤回，清空方法 | Object：具体见下方事件回调参数说明 |
|  @save   |                   canvas保存为临时图片路径                   |            tempFilePath            |

## 事件回调参数说明

### init

如果不使用默认撤回、清空的样式，自己自定义，则可以通过该事件回调暴露的 clear、revoke 方法。

```js
{
    // canvas 实例
	ctx: Object,
	// 清空画布
	clear: Function,
	// 撤回
	revoke: Function,
    // 返回为图片临时文件路径，用法同 uni.canvasToTempFilePath方法，内部只是做了 Promise 化处理而已
    canvasToTempFilePath: <Promise>Function
}
```

示例：

```html
<template>
	<v-sign @init="onSignInit"></v-sign>
	<button @click="clear">清空<button>
	<button @click="revoke">撤回<button>
    <button @click="saveTempFile">保存<button>
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
            // 保存
            saveTempFile() {
                this.signCtx.canvasToTempFilePath({fileType: 'jpg'}).then(filePath => {
                    console.log(filePath)
                })
            }
        }
    }
</script>
```

