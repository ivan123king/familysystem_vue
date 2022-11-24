<template>
	<view>
		<!--视频区-->
		<video id="myVideo" :src="videoUrl" @error="videoErrorCallback"
			@timeupdate="timeUpdate" 
			@loadedmetadata="loadedMetaData" 
			@progress="onProgressVideo"
			@play="play"
			@pause="pause"
			:autoplay="videoConfig.isAutoPlay"
			:initial-time="videoConfig.startTime"
			:loop="videoConfig.isLoop"
			controls style="width: 100%;" :style="{opacity:imageOpicaty}"></video>
		
		<view style="z-index: -1;position: fixed;top: 0;" :style="{opacity:imageOpicaty}" v-if="videoConfig.isMoYu">
			<image src="/static/video/Cover.jpg" style="width: 420px;height: 270px;"></image>
		</view>
		
		<!--操作按钮-->
		<view style="padding:20rpx;margin-bottom: 10rpx;">
			<view style="display: flex;justify-content: space-around;margin-bottom: 10rpx;">
				<image class="btn_img" src="/static/video/play.png" mode="aspectFit" @click="play"v-if="!playing"/>
				<image class="btn_img" src="/static/video//pause.png" mode="aspectFit" @click="pause" v-else/>
				<image class="btn_img" src="/static/video//dowload.png" mode="aspectFit" @click="downloadVideoM"/>
				<image class="btn_img" src="/static/video//next.png" mode="aspectFit" @click="next"/>
			</view>
			
			<uni-collapse ref="collapse" style="margin-top: 10px;">
				<uni-collapse-item title="播放设置" >
					<view style="border-bottom: 1px solid;">
						<view class="video_switch_view" style="border: none;">
							<label>广告模式</label>
							<switch :checked="videoConfig.isMoYu" @change="changeSwitch('moyu',$event)" color="#FFCC33" style="transform:scale(0.7)"/>
						</view>
						<view style="margin-top: 20rpx;padding: 20rpx;" v-if="videoConfig.isMoYu">
							<label>透明度</label>
							<slider :value="imageOpicaty" @change="imageOpicatyChange" show-value step="0.1" min="0" max="1" />
						</view>
					</view>
					
					<view v-show="!videoConfig.isMoYu">
						<view style="margin-top: 20rpx;padding: 20rpx;">
							<label>播放速率</label>
							<slider :value="videoConfig.playRate" @change="playRateChange" show-value step="0.5" min="0.5" max="1.5" />
						</view>
						<view class="video_switch_view">
							<label>自动播放</label>
							<switch :checked="videoConfig.isAutoPlay" @change="changeSwitch('autoplay',$event)" color="#FFCC33" style="transform:scale(0.7)"/>
						</view>
						<view class="video_switch_view">
							<label>循环播放</label>
							<switch :checked="videoConfig.isLoop" @change="changeSwitch('loop',$event)" color="#FFCC33" style="transform:scale(0.7)"/>
						</view>
						<view class="video_switch_view">
							<label>保存播放历史</label>
							<switch :checked="videoConfig.isSaveHistory" @change="changeSwitch('history',$event)" color="#FFCC33" style="transform:scale(0.7)"/>
						</view>
					</view>
					
				</uni-collapse-item>
				
			</uni-collapse>
			
			
		</view>

		<!--合集列表-->
		<view v-show="!videoConfig.isMoYu">
			<!--季度信息-->
			<view style="display: flex;padding: 20rpx;" v-if="quarterInfos.length>0">
				<text v-for="(quarterInfo,index) in quarterInfos" :key="index"
					@click="changeQuarter(index)"
					:style="{'background-color': nowQuarterIndex==index? 'lightblue':''}"
					style="margin-left: 20rpx;border: 1px solid lightgray;border-radius: 15rpx;display: inline-block;padding: 20rpx;">{{quarterInfo}}</text>
			</view>
			
			<!--视频信息-->
			<view v-for="(video,index) in videos" :key="index" class="video_view" @click="playVideo(video,index)"
				:style="{'background-color': nowPlayIndex==index? 'lightblue':''}">
				<text>{{video.videoName}}</text>
				<text style="font-size: 12px;color: lightgrey">{{video.relativePath}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		playVideo,
		getVideoUrl,
		addDanmu2Video,
		getAllDanmu,
		savePlayHistory,
		getVideoHistory,
		findQuarterInfo,
		findVideoPhysicsInfoByPage,
		downloadVideo
	} from '@/apis/video.js'
	export default {
		data() {
			return {
				videoConfig:{//视频配置信息
					isAutoPlay:false,
					isLoop:false,
					isSaveHistory:true,//是否保存历史记录
					startTime:0,//开始时间,
					playRate:1,//播放速率 0.5,1,1.5
					isMoYu:false,//是否开启摸鱼模式
				},
				loginName: uni.getStorageSync("loginName"),
				videoUrl: '',
				currentPlayTime: 0, //当前播放时长
				duration: 0,// 总时间
				showVideo: false, //如果弹幕还没加载，先加载video组件，后续的弹幕就不会展示了

				nowPlayIndex:0,//当前播放的视频索引
				nowQuarterIndex:0,//当前季度索引
				pageInfo: {
					page: 0,
					size: 10,
				},
				pageParam: {
					infoId: '',
					quarterInfo:'',//季度信息
				},
				quarterInfos:[],//季度列表
				videos: [],
				loadMoreStatus: "more",
				videoContext:null,//用来手动控制视频播放和暂停等
				firstVideo:true,//第一个视频，不自动播放，后续的自动播放
				playing:false,//
				autoPlaying:false,//代码设置自动播放，true正在播放
				videoId:'',//从历史记录跳进来的才有值
				imageOpicaty:0.5,//图片透明度
			}
		},
		onLoad(e) {
			var videoConfig = uni.getStorageSync("videoConfig");
			if(videoConfig){
				this.videoConfig.isAutoPlay = videoConfig.isAutoPlay;
				this.videoConfig.isLoop = videoConfig.isLoop;
				this.videoConfig.isSaveHistory = videoConfig.isSaveHistory;
			}
			
			this.pageParam.infoId = e.infoId;
			this.videoId = e.videoId;
			this.findQuarterInfoM();
		},
		onShow() {
			if(!this.videoContext){
				this.videoContext = uni.createVideoContext('myVideo');
			}
		},
		destroyed() {
			this.savePlayHistoryM()
		},
		onHide() {
			this.savePlayHistoryM()
		},
		onReachBottom() {
			this.nextVideoPage()
		},
		watch:{
			'videoConfig.playRate'(){
				this.videoContext.playbackRate(this.videoConfig.playRate);
			}
		},
		methods: {
			enterKey(e){
				console.log(e)
			},
			downloadVideoM(){//视频下载
				var video = this.videos[this.nowPlayIndex];
				downloadVideo(video.videoId,video.videoName);
			},
			changeQuarter(index){//季度切换
				this.nowQuarterIndex = index;
				this.pageParam.quarterInfo = this.quarterInfos[index];
				this.findVideoPhysicsInfoByPageM();
			},
			findQuarterInfoM(){//查询季度信息
				findQuarterInfo(this.pageParam.infoId).then(res=>{
					if (res?.result_code == "0") {
						if (res.data) {
							this.quarterInfos = res.data;
							if(this.quarterInfos){
								this.pageParam.quarterInfo = this.quarterInfos[0];
							}
						}
						this.findVideoPhysicsInfoByPageM();
					}
				});
			},
			imageOpicatyChange(e){
				const {value} = e.detail;
				this.imageOpicaty = value;
			},
			playRateChange(e){
				const {value} = e.detail;
				this.videoConfig.playRate = value;
			},
			nextVideoPage(){
				if(this.loadMoreStatus=="more"){
					this.pageInfo.page++;
					this.findVideoPhysicsInfoByPageM();
				}
			},
			findVideoPhysicsInfoByPageM() {//查询视频信息
				findVideoPhysicsInfoByPage(this.pageParam, this.pageInfo).then(res => {
					if (res?.result_code == "0") {
						if (res.data) {
							if (this.pageInfo.page == "0") {
								this.videos = res.data.content;
								this.playVideo(this.videos[0],0);
							} else {
								this.videos = [...this.videos, ...res.data.content];
							}
							this.pageInfo = res.data.pageRequest;
							var total = res.data.total;

							if (this.videos.length >= total) {
								this.loadMoreStatus = "noMore"
							}
						}
					}
					if (this.loadMoreStatus != "noMore") {
						this.loadMoreStatus = "more";
					}
					this.location2VideoId();
				});
			},
			location2VideoId(){//定位到指定videoId的视频
				if(this.videoId){
					var hasVideo = false;
					for(var i=0;i<this.videos.length;i++){
						var video = this.videos[i];
						if(video.videoId==this.videoId){
							hasVideo = true;
							this.playVideo(video,i);
							break;
						}
					}
					if(!hasVideo&&this.loadMoreStatus!="noMore"){
						this.nextVideoPage()
					}
				}
			},
			playVideo(video,index){//视频播放
				this.getVideoHistoryM();
			
				this.nowPlayIndex = index;
				var videoUrl = getVideoUrl(video.videoId);
				this.videoUrl =  encodeURI(videoUrl) 
			},
			play(){//播放按钮
				this.playing = true;
				this.autoPlaying = true;
				this.videoContext.playbackRate(this.videoConfig.playRate);
				this.videoContext.play();
			},
			pause(){//暂停按钮
				this.playing = false;
				this.videoContext.pause();
			},
			next(){//下一集
				this.savePlayHistoryM();//保存历史记录
				this.nextVideoPlay()
			},

			savePlayHistoryM() {
				if(!this.videoConfig.isSaveHistory) return;
				var mathDuration = Math.trunc(this.duration);
				var mathCurrent = Math.trunc(this.currentPlayTime);
				//播放完成后
				if (mathDuration === mathCurrent&&mathDuration!=0) {
					this.currentPlayTime = 0;//如果播放结束了，那么就将当前时间重置为0，防止下次跳过了此视频
				}
				var param = {
					loginName: this.loginName,
					videoId: this.videos[this.nowPlayIndex].videoId,
					range: this.currentPlayTime
				}
				savePlayHistory(param);
			},
			getVideoHistoryM() {
				//如果不启用播放历史记录，那么也没必要获取历史记录
				if(!this.videoConfig.isSaveHistory) return;
				
				var param = {
					loginName: this.loginName,
					videoId: this.videos[this.nowPlayIndex].videoId
				}
				getVideoHistory(param).then(res => {
					if (res?.result_code == "0") {
						if (res.data) {
							var history = res.data;
							this.videoConfig.startTime = history.playTime;
							this.videoContext.seek(this.videoConfig.startTime); //跳转到指定秒		
						}
					}
				});
			},
			loadedMetaData(e) {//视频加载完毕
				const {
					duration
				} = e.detail
				// 记录视频总时间
				this.duration = duration
				if(!this.autoPlaying){
					if(!this.firstVideo&&this.videoConfig.isAutoPlay){//非第一个视频，自动播放
						this.play();
					}
				}
			},
			onProgressVideo(e){
				const {buffered} = e.detail;
				if(buffered>4){//视频加载了百分之 就自动播放
					if(!this.firstVideo&&this.videoConfig.isAutoPlay){//非第一个视频，自动播放
						this.play();
					}
				}
			},
			timeUpdate(e) { //播放进度发生变化时
				// 更新进度
				const {
					currentTime,duration
				} = e.detail
				this.currentPlayTime = currentTime;
				
				var mathDuration = Math.trunc(this.duration);
				var mathCurrent = Math.trunc(currentTime);
				//播放完成后
				if (mathDuration === mathCurrent&&mathDuration!=0) {
					//播放结束后保存历史记录
					this.savePlayHistoryM()
					if(!this.videoConfig.isLoop){//没有设置单集循环播放，则自动播放下一集
						this.nextVideoPlay();
					}
				}
			},
			nextVideoPlay(){//下一集播放
				this.nowPlayIndex ++;
				this.nowPlayIndex = this.nowPlayIndex%this.videos.length;
				this.firstVideo = false;//第一个视频
				this.playing = false;//正在自动播放,false不是
				this.playVideo(this.videos[this.nowPlayIndex],this.nowPlayIndex);
			},
			sendDanmu: function() {//发送弹幕
				this.videoContext.sendDanmu({
					text: this.danmuValue,
					color: this.getRandomColor()
				});

				var param = {
					videoId: this.videoId,
					content: this.danmuValue,
					videoTime: this.currentPlayTime
				}
				addDanmu2Video(param).then();

				this.danmuValue = '';
			},
			videoErrorCallback: function(e) {
				// uni.showToast({
				// 	title:"加载失败"
				// })
				// uni.showModal({
				// 	content: "加载失败",
				// 	showCancel: false
				// })
			},
			changeSwitch(type,event){//调整switch
				switch(type){
					case "autoplay":
						this.videoConfig.isAutoPlay = event.detail.value;
					break;
					case "loop":
						this.videoConfig.isLoop = event.detail.value;
					break;
					case "history":
						this.videoConfig.isSaveHistory = event.detail.value;
					break;
					case "moyu":
						this.videoConfig.isMoYu = event.detail.value;
						this.moyu()
					break;
				}
			},
			moyu(){
				if(this.videoConfig.isMoYu){//开始摸鱼
					uni.setNavigationBarTitle({
						title:"Java 多线程详解"
					})
				}else{//结束摸鱼，将参数还原
					uni.setNavigationBarTitle({
						title:"视频播放"
					})
				}
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
	
	.click_active{
		opacity: 0.7;
		background-color: lightblue;
	}
	
	.video_view {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		margin: 10rpx;
		
		border-bottom: 1px solid lightgrey;
	}
	
	.video_view:active{
		.click_active()
	}
	
	.btn_img{
		width: 40rpx;
		height: 40rpx;
	}
	
	.video_switch_view{
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		padding-left: 30rpx;
		border-bottom: 1px solid lightgray;
	}
</style>
