<template>
	<view>
		<uni-grid :column="3" :square="false">
			<uni-grid-item v-for="(image,index) in images" :key="index">
				<view style="width: 100%;height: 10vh;text-align: center;vertical-align: middle;" @click="showImage(image)">
					<image :src="image.imageSrc" style="width: 100rpx;height:50%;" v-show="image.show"/>
				</view>
			</uni-grid-item>
		</uni-grid>
		<view style="text-align: center;margin-top: 20rpx;">
			<uni-section title="好运指数" subTitle="测一测你今天的好运指数吧" padding>
				<uni-rate allow-half :readonly="true" :is-fill="false" :value="luckLevel" activeColor="#00bfff"/>
			</uni-section>
		</view>
		<view>
			<button @click="refresh">刷新</button>
		</view>
	</view>
</template>

<script>
	import {getImages} from '@/apis/index.js'; 
	export default {
		data() {
			return {
				images:[],
				imageTotal:9,//图片数量
				luckLevel:0,
				loginName:uni.getStorageSync("loginName")
			}
		},
		onLoad() {
			this.getImagesM();
		},
		methods: {
			refresh(){
				this.luckLevel = 0;
				this.getImagesM();
			},
			showImage(imageInfo){
				imageInfo.show = true;
				
				this.images.forEach(image=>{
					if(imageInfo.imageIndex!=image.imageIndex){
						if(image.show&&!image.match){
							if(image.imageCode!=imageInfo.imageCode){
								image.show = false;
							}else{
								image.match = true;
								imageInfo.match = true;
								this.luckLevel++;
							}
						}
					}
				})
				
				// setTimeout(fun=>{
				// 	this.images.forEach(image=>{
				// 		if(imageInfo.imageIndex!=image.imageIndex){
				// 			if(image.show&&!image.match){
				// 				if(image.imageCode!=imageInfo.imageCode){
				// 					image.show = false;
				// 					imageInfo.show = false;
				// 				}else{
				// 					image.match = true;
				// 					imageInfo.match = true;
				// 					this.luckLevel++;
				// 				}
				// 			}
				// 		}
				// 	})
				// },500)
				
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
