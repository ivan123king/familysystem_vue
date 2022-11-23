<template>
	<view style="padding: 20rpx 20rpx;">
		<!--游戏-->
		<!-- <view>
			<button @click="toGamePage" style="margin-top: 20rpx;">游戏界面</button>
		</view> -->
		
		<!--账户信息-->
		<view style="margin-bottom: 10rpx;border-bottom: 1px solid lightgray">
			<view style="display: flex;justify-content: space-between;padding: 10rpx 0rpx;">
				<text>当前账户：{{loginName}}</text>
				<text @click="changeLoginNameDialog" style="font-size: 13px;color: grey">切换账户</text>
			</view>

			<uni-popup ref="popup" type="dialog">
				<uni-popup-dialog mode="input" message="成功" title="切换账户" :duration="2000" :before-close="true" @close="close"
					@confirm="changeLoginName"></uni-popup-dialog>
			</uni-popup>

		</view>
		
		<!--通用设置-->
		<view style="padding: 20rpx 60rpx;display: flex;justify-content: space-around;">
			<view class="oper_view" @click="toPage('setting')">
				<image src="/static/mine/setting.png" class="oper_img" mode="aspectFit"/>
				<label class="oper_label">设置</label>
			</view>
			<view class="oper_view" @click="toPage('game')">
				<image src="/static/mine/game.png" class="oper_img"  mode="aspectFit"/>
				<label class="oper_label">游戏</label>
			</view>
			
		</view>

		<!--历史记录-->
		<view style="">
			<view style="margin-bottom: 10rpx;">
				<label style="font-size: 17px;font-weight: 600;">历史记录</label>
			</view>
			<uni-list-item v-for="(history,index) in histories" :key="index" :title="history.videoPhysicsInfoVo.videoName"
				:note="history.videoInfoVo.videoName"
				:rightText="''+history.playTimeVis+'/'+history.videoPhysicsInfoVo.videoLongTimeVis" clickable link
				@click="toPlayVideoPage(history.videoPhysicsInfoVo.infoId,history.videoPhysicsInfoVo.videoId)">
			</uni-list-item>
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {getAllVideoHistory} from '@/apis/index.js'
	export default {
		data() {
			return {
				histories: [], //播放历史记录
				loginName: uni.getStorageSync("loginName"),
				showChangeLoginNameDialog: false,
				pageInfo:{
					page:0,
					size:10,
				},
				pageParam:{
					accountName:''
				},
				loadMoreStatus:'more',//noMore,loading
			}
		},
		onLoad() {
			this.loginName = uni.getStorageSync("loginName");
			this.getAllVideoHistoryM()
		},
		onPullDownRefresh() {
			this.pageInfo.page = 0;
			this.getAllVideoHistoryM()
		},
		onReachBottom() {
			if(this.loadMoreStatus=="more"){
				this.pageInfo.page++;
				this.getAllVideoHistoryM();
			}
		},
		methods: {
			toPage(type){//前往设置页面
				if(type=="setting"){
					uni.navigateTo({
						url:'/pages/mine/setting'
					})
				}else if(type=="game"){
					uni.navigateTo({
						url:"/pages/games/index"
					})
				}
				
			},
			toPlayVideoPage(infoId,videoId) { //前往播放视频页面
				uni.navigateTo({
					url: '/pages/video/play?infoId=' + infoId+"&videoId="+videoId
				})
			},
			changeLoginNameDialog() {
				this.$refs.popup.open();
			},
			close() {
				this.$refs.popup.close()
			},
			changeLoginName(value) { //切换账号
				if(value){
					this.loginName = value;
					uni.setStorageSync("loginName",this.loginName);
				}
				this.$refs.popup.close();
			},
			getAllVideoHistoryM(){
				this.pageParam.accountName = this.loginName;
				getAllVideoHistory(this.pageParam,this.pageInfo).then(res=>{
					if (res?.result_code == "0") {
						if (res.data) {
							if(this.pageInfo.page=="0"){
								this.histories = res.data.content;
							}else{
								this.histories = [...this.histories,...res.data.content];
							}
							this.pageInfo = res.data.pageRequest;
							var total = res.data.total;
							
							if(this.histories.length>=total){
								this.loadMoreStatus = "noMore"
							}
							
						}
					}
					if(this.loadMoreStatus!="noMore"){
						this.loadMoreStatus = "more";
					}
					uni.stopPullDownRefresh()
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	.oper_view{
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		.oper_img{
			width: 30px;
			height: 30px;
			margin-bottom: 10rpx;
		}
		
		.oper_label{
			font-size: 12px;
			color: gray;
		}
	}
	
	.oper_view:active{
		opacity: 0.5;
	}
</style>
