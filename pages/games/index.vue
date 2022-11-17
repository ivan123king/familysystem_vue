<template>
	<view>
		<button @click="toPage('/pages/games/luck/luckTest')" style="margin-top: 20rpx;">运气测试</button>
		<button @click="toPage('/pages/games/luck/memeory01')" style="margin-top: 20rpx;">记忆大闯关</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toPage(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style>

</style>
