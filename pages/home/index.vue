<template>
	<view class="home-container">
		<cus-card>
			<button type="primary" @click="goto('/pages/v-sign-simple/index')">简单示例</button>
		</cus-card>
		<cus-card>
			<button type="primary" @click="goto('/pages/v-sign-sub-comp/index')">子组件示例</button>
		</cus-card>
	</view>
</template>

<script>
export default {
	name: 'home',
	data() {
		return {}
	},
	methods: {
		goto(url) {
			uni.navigateTo({
				url: url
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.home-container {
}
</style>
