import http from "./http.js";

// const root = "http://192.168.3.247:8083/";
const root = "/baseUrl/";

export default root;

//-------视频 start-----------------------
export function getRootDirectory(filePath) {
	var url = root + 'video/getRootDirectory?filePath='+filePath;
	return http.GET(url)
}

export function getVideoUrl(vId) {
	return root + 'video/playVideo/'+vId;
}

export function getAllVideoHistory(loginName) {
	var url = root + 'video/getAllVideoHistory?loginName='+loginName;
	return http.GET(url);
}

export function getVideoHistory(param) {
	var url = root + 'video/getVideoHistory?loginName='+param.loginName+"&videoId="+param.videoId;
	return http.GET(url);
}

export function savePlayHistory(param) {
	var url = root + 'video/savePlayHistory?loginName='+param.loginName+"&videoId="+param.videoId+"&range="+param.range;
	http.GET(url);
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