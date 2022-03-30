<template>
	<view class="v-sign-action" :style="[customStyle]">
		<view
			v-for="item in btns"
			:key="item.label"
			:class="['btn', { border: border }]"
			:style="[{ 'margin-right': formatSize(space) }]"
			@click="onBtnClick(item)"
		>
			<image v-if="item.icon" :class="['icon', 'icon-' + item.action]" :src="item.icon"></image>
			<text class="text">{{ item.label }}</text>
		</view>
	</view>
</template>

<script>
/**
 * v-sign-action 控制按钮组（v-sign 子组件）
 * @description 控制 v-sign 组件的一些按钮
 * @tutorial
 * @property {Array} actions 按钮配置 所有值： 清空（clear）, 撤回（prev） 保存图片（save）
 * @property {Boolean} border 按钮是否有边框
 * @property {String/Number} space 按钮间隔
 * @property {Object} customStyle 根元素自定义样式
 * @event {Function} 点击对应类型按钮触发对应事件， 例如点击 clear 则触发 clear 事件
 * @example 示例
 **/
import { formatSize } from '../../utils'

// v-sign 父组件提供的接口
let vSignInterface
// 按钮类型
const btn_type = {
	CLEAR: 'clear', // 清空
	PREV: 'prev', // 撤回/上一步
	// NEXT: 'next',
	SAVE: 'save' // 保存临时图片
}
const all_action = Object.values(btn_type)
const btnsConf = [
	{
		label: '清空',
		action: btn_type.CLEAR,
		icon: require('../../static/image/clear.svg')
	},
	{
		label: '撤回',
		action: btn_type.PREV,
		icon: require('../../static/image/prev.svg')
	},
	// {
	// 	label: '取消撤回',
	// 	action: btn_type.NEXT,
	// 	icon: '/uni_modules/v-sign/static/image/next.svg'
	// },
	{
		label: '保存',
		action: btn_type.SAVE,
		icon: require('../../static/image/save.svg')
	}
]
export default {
	name: 'v-sign-action',
	props: {
		// 按钮配置
		actions: {
			type: Array,
			default: () => all_action
		},
		// 按钮是否有边框
		border: {
			type: Boolean,
			default: true
		},
		// 按钮间隔
		space: {
			type: [String, Number],
			default: 12
		},
		// 根元素自定义样式
		customStyle: {
			type: Object,
			default: () => ({})
		}
	},
	inject: ['getSignInterface'],
	data() {
		return {
			formatSize
		}
	},
	computed: {
		btns() {
			return btnsConf.filter(item => this.actions.includes(item.action))
		}
	},
	mounted() {
		vSignInterface = this.getSignInterface()
	},
	methods: {
		async onBtnClick(btn) {
			let emit_result
			switch (btn.action) {
				case btn_type.CLEAR:
					vSignInterface.clear()
					break
				case btn_type.PREV:
					vSignInterface.revoke()
					break
				// case btn_type.NEXT:
				// 	console.log('next')
				// 	break
				case btn_type.SAVE:
					emit_result = await vSignInterface.saveImage()
					break
				default:
					break
			}
			// console.log(btn.action, emit_result);
			// 触发按钮对应类型事件
			this.$emit(btn.action, emit_result)
		}
	}
}
</script>

<style lang="scss" scoped>
.v-sign-action {
	display: flex;
	flex-wrap: wrap;
	.btn {
		display: flex;
		align-items: center;
		padding: 0 12rpx;
		min-width: 88rpx;
		white-space: nowrap;
		&:last-child {
			margin-right: 0;
		}
		&:active {
			transition: transform 0.3s;
			transform: scale(1.1);
		}
		&.border {
			border: 2rpx solid #333;
			border-radius: 12rpx;
		}
		.icon {
			width: 28rpx;
			height: 28rpx;
			&.icon-clear,
			&.icon-prev,
			&.icon-next {
				margin-right: 4rpx;
			}
			&.icon-save {
			}
		}
		.text {
			color: #333;
			font-size: 28rpx;
		}
	}
}
</style>
