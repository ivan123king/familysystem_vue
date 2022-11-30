<template>
	<view>
		<view v-for="(title,index) in titles" :key="index"
			@click="chooseTitle(title)"
			style="padding: 20rpx;border-bottom: 1px solid lightgray;text-align: left;">
			<text style="display: inline-block;">{{title.title_name}}</text>
		</view>
	</view>
</template>

<script>
	import {findBookTitlesByPage} from '@/apis/book.js'; 
	export default {
		data() {
			return {
				pageInfo:{
					page:0,
					size:30,
				},
				pageParam:{
					bookId:''
				},
				loadMoreStatus:"more",
				titles:[],
			}
		},
		onReachBottom() {
			if(this.loadMoreStatus=="more"){
				this.pageInfo.page++;
				this.findBookTitlesByPageM();
			}
		},
		onLoad(e) {
			// e.bookId = 6;
			this.pageParam.bookId = e.bookId
			this.findBookTitlesByPageM()
		},
		methods: {
			chooseTitle(title){
				uni.$emit("chooseTitleF",title);
				uni.navigateBack()
			},
			findBookTitlesByPageM(){
				this.loadMoreStatus = "loading"
				findBookTitlesByPage(this.pageParam,this.pageInfo).then(res=>{
					if (res?.result_code == "0") {
						if (res.data) {
							if(this.pageInfo.page=="0"){
								this.titles = res.data.content;
							}else{
								this.titles = [...this.titles,...res.data.content];
							}
							this.pageInfo = res.data.pageRequest;
							var total = res.data.total;
							
							if(this.titles.length>=total){
								this.loadMoreStatus = "noMore"
							}
						}
					}
					if(this.loadMoreStatus!="noMore"){
						this.loadMoreStatus = "more";
					}
				});
			},
		}
	}
</script>

<style>

</style>
