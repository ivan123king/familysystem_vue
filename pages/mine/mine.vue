<template>
	<view style="padding: 20rpx 10rpx;">
		<!--游戏-->
		<view>
			<button @click="toGamePage" style="margin-top: 20rpx;">游戏界面</button>
		</view>
		
		<view>
			<text>当前账户：{{loginName}}</text>
			<button @click="changeLoginNameDialog" style="margin-top: 20rpx;">切换账户</button>

			<uni-popup ref="popup" type="dialog">
				<uni-popup-dialog mode="input" message="成功" title="切换账户" :duration="2000" :before-close="true" @close="close"
					@confirm="changeLoginName"></uni-popup-dialog>
			</uni-popup>

		</view>

		<!--历史记录-->
		<view>
			<uni-list-item v-for="(history,index) in histories" :key="index" :title="history.videoPhysicsInfoVo.videoName"
				:note="history.videoInfoVo.videoName"
				:rightText="''+history.playTimeVis" clickable link
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
			toGamePage(){
				uni.navigateTo({
					url:"/pages/games/index"
				})
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

<style>

</style>
