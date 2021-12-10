<template>
	<view class="cus-card">
		<view class="title">{{ title }}</view>
		<view class="content"><slot /></view>
	</view>
</template>

<script>
export default {
	name: 'cus-card',
	props: ['title'],
	data() {
		return {}
	}
}
</script>

<style lang="scss" scoped>
.cus-card {
	padding: 10px;
	box-shadow: 0 6px 26px 2px rgba(0, 188, 212, 0.4);
}
.title {
	font-size: 20px;
	color: #8f8f94;
}
.content {
	padding: 10px 20px;
}
</style>
