<template>
	<view>
		<view>
			<text>耗时：{{spendTime}}秒</text>
		</view>
		
		<uni-grid :column="3" :square="false">
			<uni-grid-item v-for="(image,index) in images" :key="index">
				<view style="width: 100%;height: 10vh;text-align: center;vertical-align: middle;" @click="showImage(image)">
					<image :src="image.imageSrc" style="width: 100rpx;height:50%;" v-show="image.show"/>
				</view>
			</uni-grid-item>
		</uni-grid>
		<view>
			<button @click="refresh">刷新</button>
			<button @click="nextLevel" v-if="hasWin">下一关</button>
		</view>
	</view>
</template>

<script>
	import {getImages} from '@/apis/game.js'; 
	export default {
		data() {
			return {
				images:[],
				imageTotal:9,//图片数量
				loginName:uni.getStorageSync("loginName"),
				hasWin:false,//判断是否已经赢了
				spendTime:0,//耗时
				timeInterval:null,//计时器
			}
		},
		onLoad() {
			this.getImagesM();
		},
		methods: {
			initData(){
				this.hasWin = false;
				this.hasWin = false;
				this.spendTime = 0;
				if(this.timeInterval){
					clearInterval(this.timeInterval)
				}
				this.timeInterval = null;
			},
			nextLevel(){
				this.initData();
				this.imageTotal += 9;
				
				this.refresh();
			},
			refresh(){
				this.initData();
				this.getImagesM();
			},
			showImage(imageInfo){
				if(!this.timeInterval){
					this.startTime();
				}
				
				imageInfo.show = true;
				
				if(this.hasWin){
					return;
				}
				
				this.images.forEach(image=>{
					if(imageInfo.imageIndex!=image.imageIndex){
						if(image.show&&!image.match){
							if(image.imageCode!=imageInfo.imageCode){
								image.show = false;
							}else{
								image.match = true;
								imageInfo.match = true;
							}
						}
					}
				})
				
				this.judgeWin();
			},
			startTime(){
				this.timeInterval = setInterval(res=>{
					this.spendTime+=1;
				},1000);
			},
			judgeWin(){
				for(var i=0;i<this.images.length;i++){
					var image = this.images[i];
					for(var j=0;j<this.images.length;j++){
						if(i==j) continue;
						var imageInner = this.images[j];
						if(!image.match&&!imageInner.match){
							if(image.imageCode==imageInner.imageCode){
								this.hasWin = false;
								return;
							}
						}
					}
				}
				this.hasWin = true;
				clearInterval(this.timeInterval);
			},
			getImagesM(){
				getImages(this.imageTotal).then(res=>{
					if(res?.result_code=="0"){
						this.images = [];
						if(res.data){
							var imageInfos = res.data;
							
							var index = 0;
							imageInfos.forEach(imageInfo=>{
								imageInfo.imageBase64 = imageInfo.imageBase64.replace(/[\r\n]/g, "");
								var imageSrc = "data:Image/PNG;base64," + imageInfo.imageBase64;
								this.images.push({
									imageSrc:imageSrc,
									show:false,
									imageCode:imageInfo.imageCode,
									imageIndex:index
								});
								index++;
							})
							
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	uni-image{
		display: inline;
	}
</style>
