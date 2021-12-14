<template>
	<view class="v-sign-color">
		<view class="options">
			<view
				class="option-item"
				v-for="(color, index) in options"
				:key="color"
				:style="[optionStyle(color, index)]"
				@click="onSelect(color, index)"
			>
				<view class="option-inner" :style="[optionInnerStyle(color, index)]">
					{{ tick && currentIndex === index ? '✓' : '' }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * v-sign-color 颜色选择器（v-sign 子组件）
 * @description 设置 v-sign 画笔的颜色
 * @tutorial
 * @property {String} type 选项样式，可选 SQUARE \ CIRCLE
 * @property {String} color 默认颜色
 * @property {Array} options 备选色
 * @property {Number/String} size 圆/方形大小
 * @property {Boolean} tick 是否选中打勾
 * @property {Number/String} tickSize 勾大小
 * @property {String} borderColor 边框颜色
 * @property {Boolean} border 是否有边框
 * @property {Number/String} space 选项间隙
 * @event {Function} change 改变颜色时触发
 * @example 示例
 **/
import { formatSize } from '../../utils'
// 选项样式
const type_style = {
	CIRCLE: 'circle',
	SQUARE: 'square'
}
// v-sign 父组件提供的接口
let vSignInterface

export default {
	name: 'v-sign-color',
	props: {
		// 选项样式
		type: {
			type: String,
			default: type_style.SQUARE
		},
		// 默认色，需在备选中
		color: {
			type: String
		},
		// 备选色
		options: {
			type: Array,
			default: () => ['#333', '#f44236', '#3f51b5', '#2195f3', '#ffeb3b', '#ff9900']
		},
		// 圆/方形大小
		size: {
			type: [Number, String],
			default: 44
		},
		// 是否选中打勾
		tick: {
			type: Boolean,
			default: true
		},
		// 勾大小
		tickSize: {
			type: [Number, String],
			default: 24
		},
		// 边框颜色
		borderColor: {
			type: String,
			default: '#fff'
		},
		// 是否有边框
		border: {
			type: Boolean,
			default: false
		},
		// 选项间隙
		space: {
			type: [Number, String],
			default: 16
		}
	},
	inject: ['getSignInterface'],
	data() {
		return {
			formatSize,
			currentIndex: null
		}
	},
	watch: {
		color: {
			handler(val) {
				if (!val) {
					this.currentIndex = 0
					return
				}
				const index = this.options.findIndex(item => item === this.color)
				if (index > 0) {
					this.currentIndex = index
				}
			},
			immediate: true
		}
	},
	computed: {
		currentColor() {
			return this.options[this.currentIndex]
		}
	},
	mounted() {
		vSignInterface = this.getSignInterface()
		this.setLineColor()
	},
	methods: {
		onSelect(color, index) {
			this.currentIndex = index
			this.$emit('change', color)
			this.setLineColor()
		},
		setLineColor() {
			vSignInterface.setLineColor(this.currentColor)
		},
		optionStyle(color, index) {
			const size = formatSize(this.size)
			let style = {
				marginRight: formatSize(this.space),
				width: size,
				height: size,
				lineHeight: size,
				border:
					this.border && this.currentIndex === index
						? `4rpx solid ${this.borderColor}`
						: '',
				padding: this.currentIndex === index ? 0 : this.border ? '4rpx' : ''
			}
			switch (this.type) {
				case type_style.SQUARE:
					style = {
						...style,
						borderRadius: this.currentIndex === index ? '8rpx' : 0
					}
					break
				case type_style.CIRCLE:
					style = {
						...style,
						borderRadius: '50%'
					}
					break
			}
			return style
		},
		optionInnerStyle(color, index) {
			let style = {
				background: color,
				fontSize: formatSize(this.tickSize)
			}
			switch (this.type) {
				case type_style.SQUARE:
					style = {
						...style,
						borderRadius: this.currentIndex === index ? 0 : '8rpx'
					}
					break
				case type_style.CIRCLE:
					style = {
						...style,
						borderRadius: '50%'
					}
					break
			}
			return style
		}
	}
}
</script>

<style lang="scss" scoped>
.options {
	padding: 8rpx;
	display: flex;
	flex-wrap: wrap;
}

.option-item {
	overflow: hidden;
	&:last-child {
		margin-right: 0;
	}
	&:active {
		transition: transform 0.3s;
		transform: scale(1.1);
	}
}

.option-inner {
	width: 100%;
	height: 100%;
	text-align: center;
	font-weight: bold;
	color: #fff;
}
</style>
