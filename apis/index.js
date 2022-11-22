import http from "./http.js";

// const root = "http://192.168.3.247:8083/";
const root = "/baseUrl/";

export default root;

//-------视频 start-----------------------
export function findAllCategories(){
	var url = root+'video/findAllCategories';
	return http.GET(url)
}

export function findVideoInfoByPage(paramObj,pageInfo){
	var url = root+'video/findVideoInfoByPage?page='+pageInfo.page+"&size="+pageInfo.size;
	return http.POSTJSON(url,paramObj)
}

export function findVideoPhysicsInfoByPage(paramObj,pageInfo){
	var url = root+'video/findVideoPhysicsInfoByPage?page='+pageInfo.page+"&size="+pageInfo.size;
	return http.POSTJSON(url,paramObj)
}



export function findQuarterInfo(infoId){
	var url = root + 'video/findQuarterInfo?infoId='+infoId;
	return http.GET(url)
}

export function getVideoUrl(videoId) {
	return root + 'video/playVideo/'+videoId;
}

export function downloadVideo(videoId,videoName) {
	var url = root + 'video/downloadVideo/'+videoId;
	var xhr = new XMLHttpRequest();
	    xhr.open('GET', url, true);
	    xhr.responseType = 'arraybuffer'; // 返回类型blob
	    xhr.onload = function() {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	            let blob = this.response;
	            // 转换一个blob链接
	            // 注: URL.createObjectURL() 静态方法会创建一个 DOMString(DOMString 是一个UTF-16字符串)，
	            // 其中包含一个表示参数中给出的对象的URL。这个URL的生命周期和创建它的窗口中的document绑定
	            let downLoadUrl = window.URL.createObjectURL(new Blob([blob], {
	                type: 'video/mp4'
	            }));
	            // 视频的type是video/mp4，图片是image/jpeg
	            // 01.创建a标签
	            let a = document.createElement('a');
	            // 02.给a标签的属性download设定名称
	            a.download = videoName;
	            // 03.设置下载的文件名
	            a.href = downLoadUrl;
	            // 04.对a标签做一个隐藏处理
	            a.style.display = 'none';
	            // 05.向文档中添加a标签
	            document.body.appendChild(a);
	            // 06.启动点击事件
	            a.click();
	            // 07.下载完毕删除此标签
	            a.remove();
	        }
	    };
	    xhr.send()
}

export function getAllVideoHistory(pageParam,pageInfo) {
	var url = root + 'video/getAllVideoHistory?accountName='+pageParam.accountName+'&page='+pageInfo.page+"&size="+pageInfo.size;;
	return http.GET(url);
}

export function getVideoHistory(param) {
	var url = root + 'video/getVideoHistory?accountName='+param.loginName+"&videoId="+param.videoId;
	return http.GET(url);
}

export function savePlayHistory(param) {
	var url = root + 'video/savePlayHistory?accountName='+param.loginName+"&videoId="+param.videoId+"&playTimeDouble="+param.range;
	http.POST(url);
}

export function addDanmu2Video(param) {
	var url = root + 'video/addDanmu2Video';
	return http.POSTJSON(url,{
		videoId:param.videoId,
		content:param.content,
		videoTime:param.videoTime
	})
}


export function getAllDanmu(vId) {
	var url = root + 'video/getAllDanmu/'+vId;
	return http.GET(url)
}
//-------视频 end-----------------------

export function getImages(imageTotal) {
	var url = root + 'games/getImages/'+imageTotal;
	return http.GET(url);
}