<template>
	<view style="padding: 20rpx 10rpx;">
		<view>
			<text>Hi! {{loginName}}</text>
		</view>
		
		<view style="margin-top: 20rpx;">
			<button @click="getRootDirectoryM">恢复</button>
			<button @click="reback">回退</button>
		</view>

		<view style="margin-top: 20rpx;">
			<view v-for="(item,index) in directories.childDirList" :key="item.filePath">
				<view style="padding:20rpx 10rpx;" @click="toNext(item,index)">
					<view style="display: flex;flex-direction: column;align-items:flex-start;">
						<label>{{item.name}}</label>
						<label style="font-size: 12px;color: lightgrey;">目录</label>
					</view>
				</view>
			</view>
			<view style="border-bottom: 1px solid lightgrey;"/>
			
			<view v-for="(item,index) in directories.videoInfoList" :key="item.filePath">
				<view style="padding:20rpx 10rpx;display: flex;align-items: center;" @click="toPlay(item)">
					<image src="/static/video/Cover.jpg"
						style="width:200rpx;height: 140rpx;margin-right: 20rpx;vertical-align: middle;"
						mode="aspectFit" />
					<view style="display: inline-block;width:500rpx;vertical-align: middle;">
						<label>{{item.name}}</label>
					</view>
				</view>
			</view>
					
		</view>

	</view>
</template>

<script>
	import {
		getRootDirectory
	} from '@/apis/index.js';

	export default {
		data() {
			return {
				directories: {},
				parentDir: [],
				nowFilePath: '',
				loginName:uni.getStorageSync("loginName")
			}
		},
		onLoad() {
			this.getRootDirectoryM()
		},
		onShow() {
			this.loginName=uni.getStorageSync("loginName")
		},
		computed: {
			winHeight() {
				return uni.getSystemInfoSync().windowHeight + 'px';
			}
		},
		methods: {
			toPlay(video) {
				uni.navigateTo({
					url: '/pages/video/play?vId=' + video.vid
				})
			},
			reback() {
				this.directories = this.parentDir.pop();
			},
			toNext(dirInfo, index) {
				var nowParentDir = this.deepClone(this.directories);
				this.parentDir.push(nowParentDir);
				this.directories = dirInfo;
			},
			getRootDirectoryM() {
				this.nowFilePath = encodeURIComponent(this.nowFilePath);
				getRootDirectory(this.nowFilePath).then(res => {
					if (res?.result_code == "0") {
						if (res.data) {
							this.directories = res.data;
							this.parentDir.push(res.data);
						}
					}
				});
			},
			deepClone(obj) {
				//判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
				var objClone = Array.isArray(obj) ? [] : {};
				//进行深拷贝的不能为空，并且是对象或者是
				if (obj && typeof obj === "object") {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							if (obj[key] && typeof obj[key] === "object") {
								objClone[key] = this.deepClone(obj[key]);
							} else {
								objClone[key] = obj[key];
							}
						}
					}
				}
				return objClone;
			}
		},
		components: {}
	}
</script>

<style scoped lang="less">

</style>
