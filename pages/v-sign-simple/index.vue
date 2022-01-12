<template>
	<view>
		<v-sign cid="1" height="400" :customStyle="{ background: 'orange' }"></v-sign>
		<v-sign cid="2" height="400" :customStyle="{ background: 'red' }"></v-sign>
	</view>
</template>

<script>
export default {
	name: 'v-sign-simple',
	data() {
		return {}
	}
}
</script>

<style lang="scss" scoped></style>
