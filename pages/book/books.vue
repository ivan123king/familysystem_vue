<template>
	<view>
		
		<!--图书区-->
		<view style="text-align: center;">
			<view style="width: 20%;height: 100rpx;
				border: 1px solid lightgray;
				text-align: left;
				margin: 10rpx;vertical-align: middle;
				display: inline-block;padding: 20rpx;"
				v-for="(book,index) in books" :key="index"
				@click="toReadPage(book.book_id)">
				<label style="font-size: 12px;">{{book.book_name}}</label>
			</view>
			<uni-load-more :status="loadMoreStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import {findBookInfoByPage} from '@/apis/book.js'
	export default {
		data() {
			return {
				pageInfo:{
					page:0,
					size:30,
				},
				pageParam:{
					bookName:''
				},
				loadMoreStatus:"more",
				books:[],
			}
		},
		onLoad() {
			this.findBookInfoByPageM()
		},
		onPullDownRefresh() {
			this.pageInfo.page = 0;
			this.findBookInfoByPageM();
		},
		onReachBottom() {
			if(this.loadMoreStatus=="more"){
				this.pageInfo.page++;
				this.findBookInfoByPageM();
			}
		},
		watch:{
		},
		methods: {
			findBookInfoByPageM(){
				this.loadMoreStatus = "loading"
				findBookInfoByPage(this.pageParam,this.pageInfo).then(res=>{
					if (res?.result_code == "0") {
						if (res.data) {
							if(this.pageInfo.page=="0"){
								this.books = res.data.content;
							}else{
								this.books = [...this.books,...res.data.content];
							}
							this.pageInfo = res.data.pageRequest;
							var total = res.data.total;
							
							if(this.books.length>=total){
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
			toReadPage(bookId){
				uni.navigateTo({
					url:'/pages/book/read?bookId='+bookId
				})
			}
		}
	}
</script>

<style>

</style>
