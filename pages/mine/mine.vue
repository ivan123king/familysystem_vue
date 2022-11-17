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
			<view v-for="(historiesInner,historyTimeFmt) in mapDataList" :key="historyTimeFmt">
				<view style="background-color: #F6F8FB;">
					<text style="font-size: 12px;font-weight: 400;color: #757575;">{{historyTimeFmt}}</text>
				</view>
				<uni-list-item v-for="(history,index) in historiesInner" :key="index" :title="history.videoInfoVo.name"
					:note="history.videoInfoVo.filePath" :rightText="''+history.range" clickable link
					@click="toPlayVideoPage(history.videoInfoVo.vid)">
				</uni-list-item>
			</view>
		</view>
	</view>
</template>

<script>
	import {getAllVideoHistory} from '@/apis/index.js'
	export default {
		data() {
			return {
				histories: [], //播放历史记录
				mapDataList: {},
				loginName: uni.getStorageSync("loginName"),
				showChangeLoginNameDialog: false,
			}
		},
		onLoad() {
			this.loginName = uni.getStorageSync("loginName");
			this.getAllVideoHistoryM()
		},
		onPullDownRefresh() {
			this.getAllVideoHistoryM()
		},
		methods: {
			toGamePage(){
				uni.navigateTo({
					url:"/pages/games/index"
				})
			},
			toPlayVideoPage(vId) { //前往播放视频页面
				uni.navigateTo({
					url: '/pages/video/play?vId=' + vId
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
				getAllVideoHistory(this.loginName).then(res=>{
					if (res?.result_code == "0") {
						if (res.data) {
							this.histories = res.data;
							this.mapDataList = this.handleListToMap(this.histories);
						}
					}
					uni.stopPullDownRefresh()
				});
			},
			handleListToMap(list) {
				//此处需要把数据分为 Map<时间，List<列表数据>>
				let map = {};
				list.forEach(item => {
					let key = item.historyTimeFmt;
					if (!map[key]) {
						let list = [];
						list.push(item);
						map[key] = list;
					} else {
						map[key].push(item);
					}
				});
				return map;
			}
		}
	}
</script>

<style>

</style>
