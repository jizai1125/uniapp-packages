<template>
	<view class="cus-card">
		<view class="title">{{ title }}</view>
		<view class="content"><slot /></view>
	</view>
</template>

<script>
export default {
	name: 'cus-card',
	props: {
		title: {
			type: String,
			default: ''
		}
	},
	data() {
		return {}
	}
}
</script>

<style lang="scss" scoped>
.cus-card {
	padding: 10px;
	margin: 20px 4%;
	border-radius: 10px;
	box-shadow: 0 6px 12px 0px rgba(0, 188, 212, 0.4);
}
.title {
	color: #8f8f94;
}
.content {
	padding: 10px 20px;
}
</style>
