<template>
	<view class="g-container">
		<!-- <cus-card title="v-sign"> -->
		<v-sign :customStyle="{ background: 'orange' }">
			<view class="control-area">
				<view>按钮组件：</view>
				<view class="section">
					<v-sign-action :border="false" @save="save"></v-sign-action>
				</view>
				<view>画笔组件：</view>
				<view class="section">
					<v-sign-pen label="默认样式"></v-sign-pen>
					<v-sign-pen label="样式2" active-color="orange" :border="false"></v-sign-pen>
					<v-sign-pen label="样式3" type="line"></v-sign-pen>
					<v-sign-pen
						label="样式4"
						type="line"
						:border="false"
						active-color="orange"
					></v-sign-pen>
				</view>
			</view>
		</v-sign>
		<!-- </cus-card> -->
	</view>
</template>

<script>
import vSignAction from '@/components/v-sign/v-sign-action'
import vSignPen from '@/components/v-sign/v-sign-pen'
export default {
	components: {
		vSignAction,
		vSignPen
	},
	data() {
		return {}
	},
	methods: {
		save(tempFilePath) {
			console.log(tempFilePath)
		}
	}
}
</script>

<style lang="scss" scoped>
.g-container {
	width: 100vh;
	height: 100vh;
	.control-area {
	}
	.section {
		padding: 10rpx;
		background-color: lightblue;
	}
}
</style>
