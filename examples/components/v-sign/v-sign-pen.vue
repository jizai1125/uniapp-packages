<template>
	<view class="v-sign-pen">
		<view class="label">
			<view class="title">画笔大小：</view>
			<view class="current">
				<view
					class="circle"
					:style="[
						{
							width: currentSelect.csize + 'px',
							height: currentSelect.csize + 'px',
							background: color
						},
						customStyle
					]"
				></view>
			</view>
		</view>
		<view class="options">
			<view
				class="opt-item"
				v-for="item in csizes"
				:key="item.size"
				@click="onItemClick(item)"
			>
				<view
					class="circle"
					:style="[
						{
							width: item.csize + 'px',
							height: item.csize + 'px',
							background: currentSelect.size === item.size ? activeColor : color,
							boxShadow:
								currentSelect.size === item.size ? `0 0 2px 0 ${activeColor}` : ''
						},
						customStyle
					]"
				></view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * v-sign-pen 画笔（v-sign 子组件）
 * @description 控制 v-sign 画笔的线宽
 * @tutorial
 * @property {Array} sizes 画笔大小数组，单位是px
 * @property {String} color 圆点颜色
 * @property {String} activeColor 选中项颜色
 * @property {Object} customStyle 圆点自定义样式
 * @property {Number} bigger 圆点变大变粗倍数
 * @property {Number} minSize 圆点最小大小，单位 px
 * @event {Function} change 选择画笔大小时触发
 * @example
 **/
// v-sign 父组件提供的接口
let vSignInterface
export default {
	name: 'v-sign-pen',
	props: {
		// 画笔大小数组，单位是px
		sizes: {
			type: Array,
			default: () => [2, 4, 6, 8, 10]
		},
		// 圆点颜色
		color: {
			type: String,
			default: '#333'
		},
		// 选中项颜色
		activeColor: {
			type: String,
			default: '#333'
		},
		// 圆点自定义样式
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
	.label {
		display: flex;
		align-items: center;
		min-height: 40rpx;
		.title {
			font-sizes: 28rpx;
			color: #666;
		}
		.current {
		}
	}
	.circle {
		border-radius: 50%;
		margin: 0 auto;
		border: 4rpx solid #fff;
	}
	.options {
		display: flex;
		margin: 20rpx;
		.opt-item {
			min-width: 40rpx;
			margin-right: 20rpx;
			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
