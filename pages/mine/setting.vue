<template>
	<view style="padding: 20rpx 40rpx;">
		<view>
			<label style="font-size: 16px;font-weight: 600">播放设置</label>
			<view style="margin-top: 20rpx;">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoConfig:{
					playRate:1,//播放速率
					isAutoPlay:false,//自动播放
					isLoop:false,//循环播放
					isSaveHistory:true,//保存播放历史记录
				}
			}
		},
		onLoad() {
			var videoConfig = uni.getStorageSync("videoConfig");
			if(videoConfig){
				this.videoConfig = videoConfig;
			}
		},
		methods: {
			playRateChange(e){
				const {value} = e.detail;
				this.videoConfig.playRate = parseFloat(value);
				uni.setStorageSync("videoConfig",this.videoConfig);
			},
			changeSwitch(type,event){//调整switch
				if(type=="autoplay"){
					this.videoConfig.isAutoPlay = event.detail.value;
				}else if(type=="loop"){
					this.videoConfig.isLoop = event.detail.value;
				}else if(type=="history"){
					this.videoConfig.isSaveHistory = event.detail.value;
				}
				uni.setStorageSync("videoConfig",this.videoConfig);
			},
		}
	}
</script>

<style>

</style>
