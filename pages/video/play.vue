<template>
	<view>
		<video id="myVideo" ref="video1" :src="videoUrl"
		v-if="showVideo"
		 @error="videoErrorCallback" 
		 @timeupdate="timeUpdate"
		 @loadedmetadata="loadedMetaData"
		 loop=true
		 :initial-time="startTime"
		:danmu-list="danmuList" enable-danmu danmu-btn controls
		style="width: 100%;"></video>
		<!-- #ifndef MP-ALIPAY -->
		<view style="padding: 20rpx;">
			<view style="margin-top: 20rpx;display: flex;align-items: center;justify-content: space-between;">
				<input v-model="danmuValue" type="text" placeholder="在此处输入弹幕内容" style="width: 50%;"/>
				<button @click="sendDanmu" style="font-size: 15px;background-color: cornflowerblue;color: #fff;">发送弹幕</button>
			</view>
		</view>
		<!-- #endif -->

	</view>
</template>

<script>
	import {
		playVideo,
		getVideoUrl,
		addDanmu2Video,
		getAllDanmu,
		savePlayHistory,
		getVideoHistory
	} from '@/apis/index.js'
	export default {
		data() {
			return {
				loginName:uni.getStorageSync("loginName"),
				videoId:'',
				videoUrl: '',
				danmuList: [],
				danmuValue: '',
				currentPlayTime: 0, //当前播放时长
				// 总时间
				duration: 0.1,
				// 是否正在拖拽进度
				isDrag: false,
				showVideo:false,//如果弹幕还没加载，先加载video组件，后续的弹幕就不会展示了
				startTime:0,//开始时间
			}
		},
		onLoad(e) {
			// e.vId = "1337781752"
			this.videoId = e.vId;
			
			this.videoUrl = getVideoUrl(this.videoId);
			this.videoUrl += "/"+this.loginName
			this.videoUrl =  encodeURI(this.videoUrl) 
			
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo',this)
			// #endif

		},
		onShow() {
			this.getVideoHistoryM();
			getAllDanmu(this.videoId).then(res => {
				if (res?.result_code == "0") {
					if (res.data) {
						res.data.forEach(item => {
							var temp = {
								text: item.content,
								color:this.getRandomColor(),
								time: item.videoTime
							}
							this.danmuList.push(temp);
						});
					}
				}
			});
			this.showVideo = true;
		},
		destroyed() {
			this.savePlayHistoryM()
		},
		onHide() {
			this.savePlayHistoryM()
		},
		methods: {
			savePlayHistoryM(){
				var param = {
					loginName:this.loginName,
					videoId:this.videoId,
					range:this.currentPlayTime
				}
				savePlayHistory(param);
			},
			getVideoHistoryM(){
				var param = {
					loginName:this.loginName,
					videoId:this.videoId
				}
				getVideoHistory(param).then(res=>{
					if (res?.result_code == "0") {
						if (res.data) {
							var history = res.data;
							this.startTime = history.range;
						}
					}
					// console.log(this.startTime)
				});
			},
			loadedMetaData(e){
				const { duration } = e.detail
				// 记录视频总时间
				this.duration = duration
				// 回调
				this.$emit('loadcomplete')
			},
			timeUpdate(e) { //播放进度发生变化时
				// 拖拽时不需要进行更新
				if (!this.isDrag) {
					// 更新进度
					const {
						currentTime
					} = e.detail
					this.currentPlayTime = currentTime
					// 播放完成
					if (Math.trunc(currentTime) === Math.trunc(this.duration)) {
						// this.currentPlayTime = 0;//播放完成，将时间重置，以便下次从头开始播放
						this.$emit('playcomplete', e)
					}
					// 返回当前播放时间
					this.$emit('timeupdate', e)
				}
			},
			sendDanmu: function() {
				this.videoContext.sendDanmu({
					text: this.danmuValue,
					color: this.getRandomColor()
				});
				
				var param = {
					videoId:this.videoId,
					content:this.danmuValue,
					videoTime:this.currentPlayTime
				}
				addDanmu2Video(param).then();
				
				this.danmuValue = '';
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: "加载失败",
					showCancel: false
				})
			},
			getRandomColor: function() {
				const rgb = []
				for (let i = 0; i < 3; ++i) {
					let color = Math.floor(Math.random() * 256).toString(16)
					color = color.length == 1 ? '0' + color : color
					rgb.push(color)
				}
				return '#' + rgb.join('')
			}
		}
	}
</script>

<style lang="less" scoped>
	

</style>
