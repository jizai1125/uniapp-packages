<template>
	<view class="g-container">
		<cus-card title="v-sign">
			<v-sign height="600" :customStyle="{ background: 'orange' }">
				<v-sign-action
					:border="false"
					:customStyle="{ 'margin-top': '20rpx' }"
					@save="save"
				></v-sign-action>
				<v-sign-pen></v-sign-pen>
			</v-sign>
		</cus-card>
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

<style>
.g-container {
	padding: 10px 20px;
}
</style>
