<template>
	<view class="signature-wrap">
		<canvas
			:canvas-id="cid"
			:id="cid"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd"
			disable-scroll
			:style="[
				{
					width: width && formatSize(width),
					height: height && formatSize(height)
				},
				customStyle
			]"
		></canvas>
		<slot />
	</view>
</template>

<script>
/**
 * sign canvas 手写签名
 * @description 设置线条宽度、颜色，撤回，清空
 * @tutorial
 * @property {String} cid canvas id 不设置则默认为 v-sign-时间戳
 * @property {String, Number} width canvas 宽度
 * @property {String, Number} height canvas 高度
 * @property {bgColor} bgColor 画布背景颜色
 * @property {Object} customStyle canvas 自定义样式
 * @property {String} lineWidth 画笔大小，权重小于 v-sign-pen 组件设置的画笔大小
 * @property {Number} lineColor 画笔颜色，权重小于 v-sign-pen 组件设置的画笔大小
 * @event {Function} init 当创建完 canvas 实例后触发，向外提供 canvas实例，撤回，清空方法
 * @example <v-sign @init="signInit"></v-sign>
 */
import { formatSize } from '../../utils'

export default {
	name: 'v-sign',
	props: {
		// canvas id
		cid: {
			type: String,
			default: `v-sign-${Date.now()}`
			// required: true
		},
		// canvas 宽度
		width: {
			type: [String, Number]
		},
		// canvas 高度
		height: {
			type: [String, Number]
		},
		// 画笔大小，权重小于 v-sign-pen 组件设置的画笔大小 penLineWidth
		lineWidth: {
			type: Number,
			default: 4
		},
		// 线颜色，权重小于 v-sign-color 组件设置的画笔颜色 penLineColor
		lineColor: {
			type: String,
			default: '#333'
		},
		// 画布背景颜色
		bgColor: {
			type: String,
			default: '#fff'
		},
		// canvas自定义样式
		customStyle: {
			type: Object,
			default: () => ({})
		}
	},
	provide() {
		return {
			getSignInterface: this.provideSignInterface
		}
	},
	data() {
		return {
			formatSize,
			lineData: [],
			winWidth: 0,
			winHeight: 0,
			penLineWidth: null, // v-sign-pen 组件设置的画笔大小
			penLineColor: null // v-sign-color 组件设置的颜色
		}
	},
	created() {
		// 获取窗口宽高
		const { windowWidth, windowHeight } = uni.getSystemInfoSync()
		this.winWidth = windowWidth
		this.winHeight = windowHeight
	},
	mounted() {
		this.canvasCtx = uni.createCanvasContext(this.cid, this)
		// h5 需延迟绘制，否则绘制失败
		// #ifdef H5
		setTimeout(() => {
			// #endif
			this.setBackgroundColor(this.bgColor)
			// #ifdef H5
		}, 10)
		// #endif
		// 初始化完成，触发 init 事件
		this.$emit('init', this.provideSignInterface())
	},
	methods: {
		onTouchStart(e) {
			const pos = e.touches[0]
			this.lineData.push({
				style: {
					color: this.penLineColor || this.lineColor,
					width: this.penLineWidth || this.lineWidth
				},
				// 屏幕坐标
				coordinates: [
					{
						type: e.type,
						x: pos.x,
						y: pos.y
					}
				]
			})
			this.drawLine()
		},
		onTouchMove(e) {
			const pos = e.touches[0]
			this.lineData[this.lineData.length - 1].coordinates.push({
				type: e.type,
				x: pos.x,
				y: pos.y
			})
			this.drawLine()
		},
		onTouchEnd(e) {
			this.$emit('end', this.lineData)
		},
		// 清空画布
		clear() {
			this.lineData = []
			this.canvasCtx.clearRect(0, 0, this.winWidth, this.winHeight)
			this.canvasCtx.draw()
			this.setBackgroundColor(this.bgColor)
			this.$emit('clear')
		},
		// 撤销
		revoke() {
			this.setBackgroundColor(this.bgColor)
			this.lineData.pop()
			this.lineData.forEach((item, index) => {
				this.canvasCtx.beginPath()
				this.canvasCtx.setLineCap('round')
				this.canvasCtx.setStrokeStyle(item.style.color)
				this.canvasCtx.setLineWidth(item.style.width)
				if (item.coordinates.length < 2) {
					const pos = item.coordinates[0]
					this.canvasCtx.moveTo(pos.x, pos.y)
					this.canvasCtx.lineTo(pos.x + 1, pos.y)
				} else {
					item.coordinates.forEach(pos => {
						if (pos.type == 'touchstart') {
							this.canvasCtx.moveTo(pos.x, pos.y)
						} else {
							this.canvasCtx.lineTo(pos.x, pos.y)
						}
					})
				}
				this.canvasCtx.stroke()
			})
			this.canvasCtx.draw(true)
			this.$emit('revoke', this.lineData)
		},
		// 绘制线条
		drawLine() {
			const lineDataLen = this.lineData.length
			if (!lineDataLen) return
			const currentLineData = this.lineData[lineDataLen - 1]
			const coordinates = currentLineData.coordinates
			const coordinatesLen = coordinates.length
			if (!coordinatesLen) return
			let startPos
			let endPos
			if (coordinatesLen < 2) {
				// only start, no move event
				startPos = coordinates[coordinatesLen - 1]
				endPos = {
					x: startPos.x + 1,
					y: startPos.y
				}
			} else {
				startPos = coordinates[coordinatesLen - 2]
				endPos = coordinates[coordinatesLen - 1]
			}

			const style = currentLineData.style
			this.canvasCtx.beginPath()
			this.canvasCtx.setLineCap('round')
			this.canvasCtx.setStrokeStyle(style.color)
			this.canvasCtx.setLineWidth(style.width)
			this.canvasCtx.moveTo(startPos.x, startPos.y)
			this.canvasCtx.lineTo(endPos.x, endPos.y)
			// const P1 = this.caculateBezier(startPos, endPos, centerPos)
			// console.log(P1.x, P1.y)
			// this.canvasCtx.moveTo(startPos.x, startPos.y)
			// this.canvasCtx.quadraticCurveTo(P1.x, P1.y, endPos.x, endPos.y)
			this.canvasCtx.stroke()
			this.canvasCtx.draw(true)
		},
		// 保存png图片，文件名配置 filename 仅支持 h5
		async saveImage(filename = '签名') {
			const tempFilePath = await this.canvasToTempFilePath()
			return new Promise((resolve, reject) => {
				// #ifdef H5
				try {
					const a = document.createElement('a')
					a.href = tempFilePath
					a.download = filename
					document.body.appendChild(a)
					a.click()
					a.remove()
					resolve({
						errMsg: 'saveImageH5:ok'
					})
				} catch (e) {
					console.error(e)
					reject(e)
				}
				// #endif
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: tempFilePath,
					success(resObj) {
						resolve(resObj)
					},
					fail(err) {
						reject(err)
					}
				})
				// #endif
			})
		},
		// canvas 保存为临时图片路径，h5返回 base64
		canvasToTempFilePath(conf = {}) {
			return new Promise((resolve, reject) => {
				uni.canvasToTempFilePath(
					{
						canvasId: this.cid,
						...conf,
						success: res => {
							resolve(res.tempFilePath)
						},
						fail: err => {
							console.log('fail', err)
							reject(err)
						}
					},
					this
				)
			})
		},
		setBackgroundColor(color = '#fff') {
			this.canvasCtx.beginPath()
			this.canvasCtx.setFillStyle(color)
			this.canvasCtx.fillRect(0, 0, this.winWidth, this.winHeight)
			this.canvasCtx.fill()
			this.canvasCtx.draw(true)
		},
		setLineWidth(numberVal) {
			this.penLineWidth = numberVal
		},
		setLineColor(strValue) {
			this.penLineColor = strValue
		},
		// 向外暴露内部方法
		provideSignInterface() {
			return {
				cid: this.cid,
				ctx: this.canvasCtx,
				clear: this.clear,
				revoke: this.revoke,
				saveImage: this.saveImage,
				canvasToTempFilePath: this.canvasToTempFilePath,
				setLineWidth: this.setLineWidth,
				setLineColor: this.setLineColor,
				setBackgroundColor: this.setBackgroundColor,
				getLineData: () => this.lineData
			}
		},
		/**
		 * 计算二次贝塞尔曲线 控制点 P1
		 * 起点 P0(x0,y0)、控制点P1(x1, y1)、P2(x2, y2)、曲线上任意点B(x, y)
		 * 二次贝塞尔公式：B(t) = (1-t)²P0 + 2t(1-t)P1 + t²P2
		 * 代入坐标得：
		 * x = (1-t)²*x0 + 2t(1-t)*x1 + t²*x2
		 * y = (1-t)²*y0 + 2t(1-t)*y1 + t²*y2
		 */
		caculateBezier(P0, P2, B, t = 0.5) {
			const { x: x0, y: y0 } = P0
			const { x: x2, y: y2 } = P2
			const { x, y } = B
			let x1 = (x - (1 - t) * (1 - t) * x0 - t * t * x2) / (2 * t * (1 - t))
			let y1 = (y - (1 - t) * (1 - t) * y0 - t * t * y2) / (2 * t * (1 - t))
			return {
				x: x1,
				y: y1
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.signature-wrap {
	position: relative;
}
</style>
