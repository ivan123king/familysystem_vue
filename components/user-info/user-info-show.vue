<template>
	<view v-if="userInfos">
		<!--用户信息列表-->
		<uni-list>
			<uni-list-item v-for="(userInfo,index) in userInfos" :key="index">
				<view slot="body" @click="sendData(userInfo)">
					<uni-row>
						<uni-col :span="12">
							<text>姓名：</text>
						</uni-col>
						<uni-col :span="12">
							<text>{{userInfo.emp_name}}</text>
						</uni-col>
					</uni-row>
					<uni-row>
						<uni-col :span="12">
							<text>工号：</text>
						</uni-col>
						<uni-col :span="12">
							<text>{{userInfo.emp_code}}</text>
						</uni-col>
					</uni-row>
					<uni-row>
						<uni-col :span="12">
							<text>工牌：</text>
						</uni-col>
						<uni-col :span="12">
							<text>{{userInfo.emp_badge_mac}}</text>
						</uni-col>
					</uni-row>
					<uni-row>
						<uni-col :span="12">
							<text>绑定状态：</text>
						</uni-col>
						<uni-col :span="12">
							<text>{{userInfo.bind_status_name}}</text>
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		props:{
			userInfos:Array
		},
		methods:{
			sendData(param){
				this.$emit('userData',param);
			}
		}
	}
</script>

<style scoped lang="less">

</style>

