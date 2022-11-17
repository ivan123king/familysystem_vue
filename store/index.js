import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// uni.setStorageSync("token", "oVG1b1Bgrb");
// uni.setStorageSync("openId", "oVG1b1Bgrb-l6jNYCUr6sYpQ5F-U");

const TOKEN = uni.getStorageSync("token") || "";
const OPENID = uni.getStorageSync("openId") || "openId";
const EMP_INFO = uni.getStorageSync("empInfo") || {};
const VISITOR_INFO = uni.getStorageSync("visitorInfo") || {};
const STAFF_INFO = uni.getStorageSync("staffInfo") || {};
const i18n = uni.getStorageSync("i18n") || "zh-CN";
const ROLE = uni.getStorageSync("role") || "visitor";

const store = new Vuex.Store({
	state: {
		role: ROLE,
		// 是否強制登录
		forcedLogin: true,
		// 前端token
		token: TOKEN,
		// 用户openid
		openId: OPENID,
		// 员工信息 头像 昵称
		empInfo: EMP_INFO,
		// 系统用户信息
		staffInfo: STAFF_INFO,
		// 游客信息
		visitorInfo: VISITOR_INFO,
		// 国际化
		i18n: i18n
	},
	getters: {
		// 用户是否登录
		hasLogin: state => {
			if (state.token) {
				return true;
			} else {
				return false
			}
		}
	},
	mutations: {
		SET_ROLE(state, role) {
			state.role = role;
			uni.setStorageSync("role", role);
		},
		SET_TOKEN(state, token) {
			state.token = token;
			uni.setStorageSync("token", token);
		},
		SET_OPENID(state, openId) {
			state.openId = openId;
			uni.setStorageSync("openId", openId);
		},
		SET_EMPINFO(state, empInfo) {
			state.empInfo = empInfo;
			uni.setStorageSync("empInfo", empInfo);
		},
		SET_STAFFINFO(state, staffInfo) {
			state.staffInfo = staffInfo;
			uni.setStorageSync("staffInfo", staffInfo);
		},
		SET_VISITORINFO(state, visitorInfo) {
			state.visitorInfo = visitorInfo;
			uni.setStorageSync("visitorInfo", visitorInfo);
		},
		SET_I18N(state, i18n) {
			state.i18n = i18n;
			uni.setStorageSync("i18n", i18n);
		},
		SET_LOGOUT(state) {
			state.token = "";
			uni.setStorageSync("token", "");
		}
	},
	actions: {
		// 登录过期 重新登录
		reLogin({
			commit
		}, info) {
			commit("SET_TOKEN", "");
			commit("SET_ROLE", "");
			commit("SET_STAFFINFO",{});
			commit("SET_EMPINFO",{});
			commit("SET_VISITORINFO",{});
			uni.reLaunch({
				url:"/pages/login-ats"
			})
		}
	}
})

export default store
