import http from "./http.js";

// const root = "http://192.168.3.247:8083/";
const root = "/baseUrl/";

export default root;

export function getImages(imageTotal) {
	var url = root + 'games/getImages/'+imageTotal;
	return http.GET(url);
}