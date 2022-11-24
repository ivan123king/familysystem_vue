<template>
	<view style="padding: 20rpx 10rpx;">
		<view>
			<text>Hi! {{loginName}}</text>
			<uni-search-bar @confirm="searchVideo" v-model="pageParam.videoName" placeholder="输入视频名称"></uni-search-bar>
		</view>

		<!--类别-->
		<view>
			<view v-for="(category,index) in categories" :key="index" class="category_view" 
			:style="{'background-color': category.categoryId==pageParam.categoryId? 'lightgrey':''}">
				<text @click="toVideoListPage(category)">
					{{category.categoryName}}
				</text>
			</view>
		</view>
		
		<hr/>
		
		<!--视频-->
		<view>
			<view v-for="(video,index) in videos" :key="index" class="video_view" style="" @click="toPlay(video)">
				<text>{{video.videoName}}</text>
				<text style="font-size: 12px;color: lightgrey">{{video.videoType}}</text>
			</view>
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</view>

	</view>
</template>

<script>
	import {
		findAllCategories,findVideoInfoByPage
	} from '@/apis/video.js';

	export default {
		data() {
			return {
				categories: [], //类别
				videos:[],//视频
				loginName: uni.getStorageSync("loginName"),
				pageInfo:{
					page:0,
					size:10,
				},
				pageParam:{
					videoName:''
				},
				loadMoreStatus:"more",
				nowChooseCategoryId:'',
			}
		},
		onLoad() {
			this.findAllCategoriesM();
			this.findVideoInfoByPageM();
		},
		onShow() {
			this.loginName = uni.getStorageSync("loginName")
		},
		onReachBottom() {
			if(this.loadMoreStatus=="more"){
				this.pageInfo.page++;
				this.findVideoInfoByPageM();
			}
		},
		onPullDownRefresh() {
			this.pageInfo.page = 0;
			this.findVideoInfoByPageM();
		},
		computed: {
			winHeight() {
				return uni.getSystemInfoSync().windowHeight + 'px';
			}
		},
		methods: {
			toPlay(video) {
				uni.navigateTo({
					url: '/pages/video/play?infoId=' + video.infoId
				})
			},
			searchVideo(){
				this.pageInfo.page = 0;
				this.findVideoInfoByPageM();
			},
			toVideoListPage(category) {
				this.pageInfo.page = 0;
				this.pageParam.categoryId = this.pageParam.categoryId==category.categoryId? '':category.categoryId;
				this.findVideoInfoByPageM()
			},
			findAllCategoriesM() {
				findAllCategories().then(res => {
					if (res?.result_code == "0") {
						if (res.data) {
							this.categories = res.data;
						}
					}
				});
			},
			findVideoInfoByPageM(){
				this.loadMoreStatus = "loading"
				findVideoInfoByPage(this.pageParam,this.pageInfo).then(res=>{
					if (res?.result_code == "0") {
						if (res.data) {
							if(this.pageInfo.page=="0"){
								this.videos = res.data.content;
							}else{
								this.videos = [...this.videos,...res.data.content];
							}
							this.pageInfo = res.data.pageRequest;
							var total = res.data.total;
							
							if(this.videos.length>=total){
								this.loadMoreStatus = "noMore"
							}
						}
					}
					if(this.loadMoreStatus!="noMore"){
						this.loadMoreStatus = "more";
					}
					
					uni.stopPullDownRefresh();//下拉刷新时
				});
			},
		},
		components: {}
	}
</script>

<style scoped lang="less">
	.click_active{
		opacity: 0.7;
		background-color: lightblue;
	}
	
	.category_view {
		display: inline-block;
		padding: 20rpx;
		margin: 10rpx;
		border: 1px solid lightgray;
		border-radius: 15rpx;
	}
	
	.category_view:active{
		.click_active()
	}
	
	
	.video_view{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		
		padding: 20rpx;
		margin: 10rpx;
		
		border-bottom: 1px solid lightgrey;
	}
	
	.video_view:active{
		.click_active()
	}
	
</style>
