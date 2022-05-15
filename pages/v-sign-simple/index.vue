<template>
	<view>
		<button @click="flag = !flag">change</button>
		<v-sign
			cid="1"
			height="400"
			bgColor="orange"
			:customStyle="{ display: flag ? 'block' : 'none' }"
		></v-sign>
		<v-sign
			cid="2"
			height="400"
			bgColor="red"
			:customStyle="{ display: !flag ? 'block' : 'none' }"
		></v-sign>
	</view>
</template>

<script>
export default {
	name: 'v-sign-simple',
	data() {
		return {
			flag: false
		}
	}
}
</script>

<style lang="scss" scoped></style>
