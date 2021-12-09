

# v-sign  手写签名

**如有问题或者建议，欢迎留言或加群联系我（群号：736123963）！！！将保持维护！！！**

<img src="https://i.loli.net/2021/12/02/bgsfnDmCzXGq8ct.png" alt="uniapp 交流群群聊二维码" style="zoom: 80%;" />

## 快速使用

基础示例，具体说明见下方API，**若需要使用内置子组件，见下方子组件说明。**

```html
<template>
	<v-sign @init="onSignInit"></v-sign>
	<button @click="clear">清空<button>
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
|    width    | String/Number |     100%      | canvas 宽度，Number 单位 rpx |
|   height    | String/Number |    300rpx     | canvas 高度，Number 单位 rpx |
| customStyle |    Object     |       -       |      canvas 自定义样式       |
|  lineWidth  |    Number     |       4       |             线宽             |
|  lineColor  |    String     |     #000      |            线颜色            |

### 事件（Events）

| 事件称名 |                             说明                             |               返回值               |
| :------: | :----------------------------------------------------------: | :--------------------------------: |
|  @init   | 创建完 canvas 实例后触发，向外提供 canvas实例，撤回，清空方法 | Object：具体见下方事件回调参数说明 |

### 事件回调参数说明

##### init

可以通过该事件回调暴露的 clear、revoke 等方法。

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

完整示例：

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
                this.signCtx.canvasToTempFilePath({fileType: 'jpg'})
                  	.then(filePath => {
                    	console.log(filePath)
	                })
            }
        }
    }
</script>
```

# 子组件

## 按钮控件（v-sign-action）

### API

### 属性 (Props)

|   属性名    |     类型      |          默认值           |                          说明                          |
| :---------: | :-----------: | :-----------------------: | :----------------------------------------------------: |
|   actions   |     Array     | ["clear", "prev", "save"] | 按钮配置；清空（clear）, 撤回（prev） 保存图片（save） |
|   border    |    Boolean    |           true            |                     按钮是否有边框                     |
|    space    | String/Number |          300rpx           |               按钮间隔，Number 单位 rpx                |
| customStyle |    Object     |             -             |                    根元素自定义样式                    |

### 事件（Events）

点击对应类型按钮触发对应事件， 例如点击 清空（clear）按钮则触发 clear 事件

### 示例

```html
<template>
    <v-sign>
		<v-sign-action @save="save"></v-sign-action>
	</v-sign>
</template>
<script>
    import vSignAction from '@/components/v-sign/v-sign-action'
    export default {
        components: {
			vSignAction
		},
        methods: {
            save(tempFilePath) {
                console.log(tempFilePath);
            }
		}
    }
</script>
```

## 画笔组件（v-sign-pen）

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
|    space    | Number  |      20rpx       |      选项间隙，单位 rpx      |
|   bigger    | Number  |        2         |       圆点变大变粗倍数       |
|   minSize   | Number  |        4         |    圆点最小尺寸，单位 px     |

### 事件（Events）

| 事件称名 |        说明        |       返回值       |
| :------: | :----------------: | :----------------: |
| @change  | 选择画笔大小时触发 | size：画笔尺寸大小 |

### 示例

```html
<template>
    <v-sign>
		<v-sign-pen></v-sign-pen>
	</v-sign>
</template>
<script>
    import vSignPen from '@/components/v-sign/v-sign-pen'
    export default {
        components: {
			vSignPen
		}
    }
</script>
```

