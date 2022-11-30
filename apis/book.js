import http from "./http.js";

// const root = "http://192.168.3.247:8083/";
const root = "/baseUrl/";

export default root;

export function getBookContent(paramObj,pageInfo){
	var url = root+'book/getBookContent/'+paramObj.bookId+'?page='+pageInfo.page+"&size="+pageInfo.size+"&range="+pageInfo.range;
	return http.GET(url)
}

export function findBookInfoByPage(paramObj,pageInfo){
	var url = root+'book/findBookInfoByPage?bookName='+paramObj.bookName+'&page='+pageInfo.page+"&size="+pageInfo.size;
	return http.GET(url)
}

export function findBookTitlesByPage(paramObj,pageInfo){
	var url = root+'book/findBookTitlesByPage/'+paramObj.bookId+'?page='+pageInfo.page+"&size="+pageInfo.size;
	return http.GET(url)
}