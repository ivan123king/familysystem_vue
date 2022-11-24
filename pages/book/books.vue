<template>
	<view>
		<view style="padding: 20rpx 40rpx;" 
			@longpress="showSettingM"
			@click="clickContentView"
			@touchstart="touchStart" 
			@touchend="touchEnd">
			<textarea v-model="bookContent"  
			style="width: 100%;line-height: 35px;"
			:style="{height:screenInfo.screenHeight+'px',
			opacity:bookConfig.opacity,
			'font-size':bookConfig.fontSize+'px'}">
			</textarea>
		</view>
		<view style="position: fixed;bottom: 20px;width: 100%;">
			<!--#ifdef H5-->
			<view style="display: flex;justify-content: space-between;">
				<button @click="prev" size="mini">上一页</button>
				<button @click="next" size="mini">下一页</button>
			</view>
			<!-- #endif -->
			
			<uni-collapse ref="collapse" style="margin-top: 10px;" v-if="showSetting">
				<uni-collapse-item title="其他设置" >
					<view style="margin-top: 20rpx;padding: 20rpx;">
						<label>透明度</label>
						<slider :value="bookConfig.opacity" @change="changeBookConfig('opacity',$event)" show-value step="0.1" min="0" max="1" />
					</view>
					<view style="margin-top: 20rpx;padding: 20rpx;">
						<label>字体</label>
						<slider :value="bookConfig.fontSize" @change="changeBookConfig('fontSize',$event)" show-value step="1" min="10" max="20" />
					</view>
					<view style="margin-top: 20rpx;padding: 20rpx;">
						<label>进度</label>
						<slider :value="bookConfig.nowBookLength" @change="changeBookConfig('bookLength',$event)" step="8" min="0" :max="bookLength" />
					</view>
				</uni-collapse-item>
				
			</uni-collapse>
			
		</view>
	</view>
</template>

<script>
	import {getBookContent} from '@/apis/book.js'; 
	export default {
		data() {
			return {
				bookContent:'',
				bookLength:'',//书籍总进度
				bookConfig:{
					fontSize:13,//单位px
					color:'#000000',//颜色
					backgroundColor:'#ffffff',//背景色
					opacity:1,//透明度
					nowBookLength:'',//当前进度
				},
				pageInfo:{
					page:0,
					size:120,//多少字
					range:0,//偏移量
				},
				pageParam:{
					videoName:''
				},
				screenInfo:{
					screenWidth:200,
					screenHeight:400,
				},
				touchStartInfo:{
					x:0,
					y:0,
				},
				showSetting:true,//展示配置
			}
		},
		onLoad() {
			var systemInfo = uni.getSystemInfoSync();
			this.screenInfo.screenWidth = systemInfo.screenWidth;
		    this.screenInfo.screenHeight = systemInfo.screenHeight-100;
			this.getBookContentM();
		},
		methods: {
			clickContentView(){
				// this.showSetting = false;
			},
			showSettingM(){
				this.showSetting = true;
			},
			touchStart(e){
				this.touchStartInfo.x = e.changedTouches[0].clientX;
				this.touchStartInfo.y = e.changedTouches[0].clientY;
			},
			touchEnd(e){
				const subX = e.changedTouches[0].clientX - this.touchStartInfo.x;
				const subY = e.changedTouches[0].clientY - this.touchStartInfo.y;
				if (subY < -50) {
					// console.log('下滑')
				} else if (subY > 50) {
					// console.log('上滑')
				} else if (subX > 50) {
					// console.log('左滑')
					this.prev()
				} else if (subX < -50) {
					// console.log('右滑')
					this.next()
				} else {
					// console.log('无效')
				}
			},
			next(){
				this.getBookContentM();
			},
			prev(){
				var contentLength = this.bookContent.length;
				this.pageInfo.range -= contentLength*8;
				if(this.pageInfo.range<0){
					this.pageInfo.range = 0;
				}
				this.getBookContentM();
			},
			getBookContentM(){
				getBookContent(this.pageParam,this.pageInfo).then(res=>{
					if(res?.result_code=="0"){
						if(res.data){
							if(!res.data.content){
								uni.showToast({
									content:"没有更多内容了"
								})
								return;
							}
							this.bookContent = res.data.content;
							this.pageInfo.range = res.data.range;
							var contentLength = this.bookContent.length;
							if(!this.bookLength){
								this.bookLength = res.data.bookLength-8*this.pageInfo.size/2;
							}
							// this.screenInfo.screenHeight = contentLength+200;
						}
					}
				});
			},
			changeBookConfig(type,e){
				const {value} = e.detail;
				switch(type){
					case "opacity":
						this.bookConfig.opacity = value;
						break;
					case "fontSize":
						this.bookConfig.fontSize = value;
						break;
					case "bookLength":
						this.bookConfig.nowBookLength = value;
						this.pageInfo.range = this.bookConfig.nowBookLength;
						this.getBookContentM();
						break;
				}
			}
			
		}
	}
</script>

<style>

</style>
