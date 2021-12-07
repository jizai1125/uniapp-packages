<template>
	<view class="g-container">
		<cus-card title="v-sign">
			<v-sign height="600" :customStyle="{ background: 'orange' }">
				<v-sign-control
					:border="false"
					:customStyle="{ 'margin-top': '20rpx' }"
					@save="save"
				></v-sign-control>
			</v-sign>
		</cus-card>
	</view>
</template>

<script>
import vSignControl from '@/components/v-sign/v-sign-control'
export default {
	components: {
		vSignControl
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
