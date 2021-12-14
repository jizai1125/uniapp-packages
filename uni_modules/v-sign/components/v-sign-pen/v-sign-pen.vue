<template>
	<view class="v-sign-pen">
		<view class="label" v-if="label">{{ label }}</view>
		<view class="options">
			<view
				class="opt-item"
				:style="{
					minHeight: minWrapHeight,
					marginRight: space + 'rpx'
				}"
				v-for="item in csizes"
				:key="item.size"
				@click="onItemClick(item)"
			>
				<view
					:class="type"
					:style="{
						border:
							border && currentSelect.size === item.size
								? `${borderWidth}rpx solid ${activeColor}`
								: ''
					}"
				>
					<view class="inner" :style="[defaultInnerStyle(item)]"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * v-sign-pen 画笔（v-sign 子组件）
 * @description 设置 v-sign 画笔的线宽
 * @tutorial
 * @property {String} type 选项样式 line / circle
 * @property {String} label 标签
 * @property {Array}  sizes 画笔大小数组，单位 px
 * @property {String} color 选项颜色
 * @property {String} activeColor 选中项颜色
 * @property {Boolean} border 选中项是否有边框
 * @property {Number} borderWidth 边框大小，单位 rpx
 * @property {String} space 选项间隙，单位 rpx
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
			type: String
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
		// 边框大小, 单位 rpx
		borderWidth: {
			type: Number,
			default: 4
		},
		// 选项间隙, 单位 rpx
		space: {
			type: Number,
			default: 20
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
	inject: ['getSignInterface'],
	data() {
		return {
			type_style,
			currentSelect: null,
			csizes: [],
			maxSize: 0,
			maxCsize: 0
		}
	},
	computed: {
		minWrapHeight() {
			let height
			switch (this.type) {
				case type_style.CIRCLE:
					height = this.maxCsize + 10 + 'px'
					break
				case type_style.LINE:
					height = this.maxSize + 4 + 'px'
					break
			}
			return height
		}
	},
	created() {
		this.csizes = this.sizes.map((size, index) => {
			const csize = (index + 1) * this.bigger + this.minSize
			this.maxSize = csize > this.maxSize ? csize : this.maxSize
			this.maxCsize = csize > this.maxCsize ? csize : this.maxCsize
			return {
				size,
				csize
			}
		})
		this.currentSelect = this.csizes[0]
	},
	mounted() {
		vSignInterface = this.getSignInterface()
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
		},
		defaultInnerStyle(item) {
			let width
			let height
			switch (this.type) {
				case type_style.CIRCLE:
					width = `${item.csize}px`
					height = `${item.csize}px`
					break
				case type_style.LINE:
					width = '20px'
					height = `${item.size}px`
					break
			}
			const background = this.currentSelect.size === item.size ? this.activeColor : this.color
			return {
				width,
				height,
				background
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.v-sign-pen {
	padding: 12rpx;
	.label {
		font-size: 28rpx;
		color: #333;
	}
	.options {
		display: flex;
		align-items: flex-end;
		.opt-item {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			&:last-child {
				margin-right: 0;
			}
			&:active {
				transition: transform 0.3s;
				transform: scale(1.1);
			}
			.circle {
				border-radius: 50%;
				padding: 4rpx;
				.inner {
					border-radius: 50%;
				}
			}
			.line {
				padding: 4rpx;
			}
		}
	}
}
</style>
