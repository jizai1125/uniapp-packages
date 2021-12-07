<template>
	<view class="signature-wrap">
		<canvas
			:canvas-id="cid"
			:id="cid"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd"
			:style="[{ width: formatSize(width), height: formatSize(height) }, customStyle]"
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
 * @property {Object} customStyle 自定义样式
 * @property {String} lineColor 线颜色
 * @property {Number} lineWidth 线宽度
 * @event {Function} init 当创建完 canvas 实例后触发，向外提供 canvas实例，撤回，清空方法
 * @example <v-sign @init="signInit"></v-sign>
 */
import { formatSize } from './utils'
// convas 实例
let canvasCtx

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
			type: [String, Number],
			default: '100%'
		},
		// canvas 高度
		height: {
			type: [String, Number],
			default: 300
		},
		// 线宽
		lineWidth: {
			type: Number,
			default: 4
		},
		// 线颜色
		lineColor: {
			type: String,
			default: '#000'
		},
		// canvas自定义样式
		customStyle: {
			type: Object,
			default: () => ({})
		}
	},
	provide() {
		return {
			getInterface: this.provideInterface
		}
	},
	data() {
		return {
			formatSize,
			lineData: [],
			winWidth: 0,
			winHeight: 0
		}
	},
	mounted() {
		canvasCtx = uni.createCanvasContext(this.cid, this)
		// 初始化完成，向外暴露接口
		this.$emit('init', this.provideInterface())
		// 获取窗口宽高
		uni.getSystemInfo({
			success: res => {
				this.winWidth = res.windowWidth
				this.winHeight = res.windowHeight
			}
		})
	},
	methods: {
		onTouchStart(e) {
			const pos = e.touches[0]
			this.lineData.push({
				style: {
					color: this.lineColor,
					width: this.lineWidth
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
			// console.log(e.type, e)
		},
		// 清空画布
		clear() {
			this.lineData = []
			canvasCtx.clearRect(0, 0, this.winWidth, this.winHeight)
			canvasCtx.draw()
		},
		// 撤销
		revoke() {
			this.lineData.pop()
			this.lineData.forEach((item, index) => {
				canvasCtx.beginPath()
				canvasCtx.setLineCap('round')
				canvasCtx.setStrokeStyle(item.style.color)
				canvasCtx.setLineWidth(item.style.width)
				item.coordinates.forEach(pos => {
					if (pos.type == 'touchstart') {
						canvasCtx.moveTo(pos.x, pos.y)
					} else {
						canvasCtx.lineTo(pos.x, pos.y)
					}
				})
				canvasCtx.stroke()
			})
			canvasCtx.draw()
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
				endPos = { x: startPos.x + 1, y: startPos.y }
			} else {
				startPos = coordinates[coordinatesLen - 2]
				endPos = coordinates[coordinatesLen - 1]
			}
			
			const style = currentLineData.style
			canvasCtx.beginPath()
			canvasCtx.setLineCap('round')
			canvasCtx.setStrokeStyle(style.color)
			canvasCtx.setLineWidth(style.width)
			canvasCtx.moveTo(startPos.x, startPos.y)
			canvasCtx.lineTo(endPos.x, endPos.y)
			// const P1 = this.caculateBezier(startPos, endPos, centerPos)
			// console.log(P1.x, P1.y)
			// canvasCtx.moveTo(startPos.x, startPos.y)
			// canvasCtx.quadraticCurveTo(P1.x, P1.y, endPos.x, endPos.y)
			canvasCtx.stroke()
			canvasCtx.draw(true)
		},
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
		provideInterface() {
			return {
				cid: this.cid,
				ctx: canvasCtx,
				clear: this.clear,
				revoke: this.revoke,
				canvasToTempFilePath: this.canvasToTempFilePath
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
			return { x: x1, y: y1 }
		}
	}
}
</script>

<style lang="scss" scoped>
.signature-wrap {
}
</style>
