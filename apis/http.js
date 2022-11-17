import store from "@/store"
import qs from 'qs'

function HTTP(obj, config) {

	let defaultConfig = {
		isRes: true,
		loading: false
	}

	config = {
		...defaultConfig,
		...config
	}


	// 如果需要显示loading,mask防止点击穿透
	config.loading && uni.showLoading({
		title: 'loading...',
		mask: true
	});

	return new Promise((resolve, reject) => {

		let options = {
			url: "",
			method: "GET",
			data: {},
			dataType: "json",
			header: {
				"content-type": "application/x-www-form-urlencoded",
				"X-requested-With": "XMLHttpRequest"
			},
			success: (res) => {
				// 状态码为200
				if (res.statusCode == 200) {
					let data = res.data;
					//返回 { result_code:"0",result_msg:"消息",re_value:{} }
					if (config.isRes) {
						resolve(data)
					}
					// 返回 re_value:{}
					else {
						if (data.result_code == "0") {
							resolve(data.data)
						} else {
							wx.showToast({
								title: data.msg,
								icon: "none",
								duration: 2000
							})
							reject(data);
						}
					}
				} else {
					reject("HTTP:状态码异常！");
					setTimeout(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}, 2000);
				}
			},
			fail: (err) => {
				uni.hideLoading();
				uni.stopPullDownRefresh();
				uni.showToast({
					title: "网络异常，请稍后再试!",
					icon: "none",
					mask: true
				})
				reject("网络异常，请稍后再试!");
			},
			complete: () => {}
		}

		options = {
			...options,
			...obj
		};

		if (options.url && options.method) {
			uni.request(options);
		} else {
			uni.showToast({
				title: 'HTTP：缺失参数',
				icon: "none",
				duration: 2000
			})
		}
	})

}



export default {
	GET(url, data = {}, config) {
		return HTTP({
			url,
			data,
			method: "GET"
		}, config);
	},
	POST(url, data = {}, config) {
		return HTTP({
			url,
			data: qs.stringify(data),
			method: "POST"
		}, config);
	},
	
	POSTJSON(url,data={},config){
		return HTTP({
			url,
			data: JSON.stringify(data),
			method: "POST",
			header: {
				"content-type": "application/json",
			}
		}, config);
	},

	POSTformdata(url, formdata = {}, filePath) {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url,
				filePath: filePath,
				name: 'file',
				header: header,
				formData: {
					param: JSON.stringify(formdata)
				},
				success: (res) => {
					if (res.statusCode == 200) {
						let data = res.data;
						if (data.result_code == "0") {
							resolve(data.data)
						} else {
							wx.showToast({
								title: data.msg,
								icon: "none",
								duration: 2000
							})
							reject(data.msg);
						}
					} else {
						reject(res);
					}
				},
			});
		})
	}
}
