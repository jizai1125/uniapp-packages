<template>
	<view class="v-sign-pen">
		<view class="label">{{ label }}</view>
		<view class="options">
			<view
				:class="['opt-item', 'type-' + type]"
				:style="[{ marginRight: space + 'rpx' }]"
				v-for="item in csizes"
				:key="item.size"
				@click="onItemClick(item)"
			>
				<!-- 圆点 -->
				<template v-if="type === type_style.CIRCLE">
					<view
						class="circle"
						:style="[
							{
								width: item.csize + 'px',
								height: item.csize + 'px',
								background: currentSelect.size === item.size ? activeColor : color,
								boxShadow:
									border && currentSelect.size === item.size
										? `0 0 0 1px ${activeColor}`
										: ''
							},
							customStyle
						]"
					></view>
				</template>
				<!-- 线 -->
				<template v-else-if="type === type_style.LINE">
					<view
						class="line"
						:style="[
							{
								height: item.size + 'px',
								background: currentSelect.size === item.size ? activeColor : color,
								boxShadow:
									border && currentSelect.size === item.size
										? `0 0 0 1px ${activeColor}`
										: '',
								customStyle
							}
						]"
					></view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * v-sign-pen 画笔（v-sign 子组件）
 * @description 控制 v-sign 画笔的线宽
 * @tutorial
 * @property {String} type 选项样式 line / circle
 * @property {String} label 标签
 * @property {Array}  sizes 画笔大小数组，单位是px
 * @property {String} color 选项颜色
 * @property {String} activeColor 选中项颜色
 * @property {Boolean} border 选中项是否有边框
 * @property {String} space 选项间隙
 * @property {Object} customStyle 选项自定义样式
 * @property {Number} bigger 圆点变大变粗倍数
 * @property {Number} minSize 圆点最小大小，单位 px
 * @event {Function} change 选择画笔大小时触发
 * @example
 **/
// v-sign 父组件提供的接口
let vSignInterface
// 选项样式
const type_style = {
	CIRCLE: 'circle',
	LINE: 'line'
}
export default {
	name: 'v-sign-pen',
	props: {
		// 选项样式
		type: {
			type: String,
			default: type_style.CIRCLE
		},
		label: {
			type: String,
		},
		// 画笔大小数组，单位是px
		sizes: {
			type: Array,
			default: () => [2, 4, 6, 8, 10]
		},
		// 选项颜色
		color: {
			type: String,
			default: '#333'
		},
		// 选中项颜色
		activeColor: {
			type: String,
			default: '#333'
		},
		// 选中项是否有边框
		border: {
			type: Boolean,
			default: true
		},
		// 选项间隙
		space: {
			type: Number,
			default: 20
		},
		// 选项自定义样式
		customStyle: {
			type: Object,
			default: () => ({})
		},
		// 圆点变大变粗倍数
		bigger: {
			type: Number,
			default: 2
		},
		// 圆点最小大小，单位 px
		minSize: {
			type: Number,
			default: 4
		}
	},
	inject: ['getInterface'],
	data() {
		return {
			type_style,
			currentSelect: null,
			csizes: []
		}
	},
	created() {
		this.csizes = this.sizes.map((size, index) => {
			const csize = (index + 1) * this.bigger + this.minSize
			return {
				size,
				csize
			}
		})
		this.currentSelect = this.csizes[0]
	},
	mounted() {
		vSignInterface = this.getInterface()
		this.setLineWidth()
	},
	methods: {
		onItemClick(opt) {
			this.currentSelect = opt
			this.setLineWidth()
			this.$emit('change', opt.size)
		},
		setLineWidth() {
			vSignInterface.setLineWidth(this.currentSelect.size)
		}
	}
}
</script>

<style lang="scss" scoped>
.v-sign-pen {
	padding: 12rpx;
	background: #fff;
	.label {
		font-size: 28rpx;
		color: #333;
	}
	.circle {
		border-radius: 50%;
		margin: 0 auto;
		border: 4rpx solid #fff;
	}
	.line {
		width: 20px;
		margin: 0 auto;
		border: 4rpx solid #fff;
	}
	.options {
		display: flex;
		align-items: flex-end;
		.opt-item {
			height: 100%;
			&.type-circle {
				min-width: 40rpx;
			}
			&.type-line {
				min-height: 20px;
				display: flex;
				align-items: flex-end;
			}
			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
