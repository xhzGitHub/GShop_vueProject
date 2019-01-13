/*
包含n个接口请求函数的模块
函数的返回值：promise对象
 */
import ajax from './ajax'
// const base_url = 'http://localhost:4000'
const base_url = '/api'
// [1、根据经纬度获取位置详情](#1根据经纬度获取位置详情)<br/>
export const reqAddress = (geohash) => ajax(`${base_url}/position/${geohash}`)
// [2、获取食品分类列表](#2获取食品分类列表)<br/>
export const reqFoodCategorys = () => ajax(base_url + '/index_category')
// [3、根据经纬度获取商铺列表](#3根据经纬度获取商铺列表)<br/>
export const reqShopList = (longitude,latitude) => ajax(base_url + '/shops',{longitude,latitude})
// [4、根据经纬度和关键字搜索商铺列表](#4根据经纬度和关键字搜索商铺列表)<br/>
export const reqSearchShops = (geohash, keyword) => ajax(base_url + '/search_shops',{geohash, keyword})
// [5、获取一次性验证码](#5获取一次性验证码)<br/>
// [6、用户名密码登陆](#6用户名密码登陆)<br/>
export const reqPwdLogin = (name, pwd, captcha) => ajax(base_url + '/login_pwd', {name, pwd, captcha}, 'POST')
// [7、发送短信验证码](#7发送短信验证码)<br/>
export const reqSendCode = (phone) => ajax(base_url + '/sendcode', {phone})
// [8、手机号验证码登陆](#8手机号验证码登陆)<br/>
export const reqLoginSms = (phone, code) => ajax(base_url + '/login_sms', {phone, code}, 'POST')
// [9、根据会话获取用户信息](#9根据会话获取用户信息)<br/>
export const reqUserInfo = () => ajax(base_url + '/userinfo')
// [10、用户登出](#10用户登出)<br/>
export const reqLogout = () => ajax(base_url + '/logout')


