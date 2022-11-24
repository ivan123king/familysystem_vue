<template>
	<view>
		<view class="status_bar"></view>
		<view style="padding: 20rpx;">
			<input v-model="loginName" type="text" placeholder="输入登录名" style="border: 1px solid;border-radius: 15rpx;  height: 80rpx;padding: 10rpx;"/>
			<button @click="login" style="margin-top: 20rpx;">登录</button>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				loginName:'',
				showContent:false,
			}
		},
		onLoad() {
			var loginName = uni.getStorageSync("loginName");
			if(loginName){
				this.loginName = loginName;
			}
		},
		computed: {
			winHeight() {
				return uni.getSystemInfoSync().windowHeight + 'px';
			}
		},
		methods: {
			login(){
				if(this.loginName){
					uni.setStorageSync("loginName", this.loginName);
					
					uni.switchTab({
						url:'/pages/video/index'
					})
				}
			},
		},
		components: {}
	}
</script>

<style scoped lang="less">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
