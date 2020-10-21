//app.js
var request = require('request.js')
var base = require('conf.js');
var amapFile = require('utils/amap-wx.js');
var wxparse = require('utils/wxParse/wxParse.js');
var common = require('utils/common.js');
var sysConfig = require('systemConfig.js');
var utils = require('utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: "base.env"
      })
      var openid = wx.getStorageSync('openid');
      if (openid) {
        this.globalData.openid = openid
      } else {
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            this.globalData.openid = res.result.openid;
            wx.setStorageSync('openid', res.result.openid)
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    }
    this.isMoblie();
    request.versionCodeUpDate();
    request.login();
    sysConfig.getMarkList();
    wx.getSystemInfo({
      success: (res) => {
        console.info(res);
        this.globalData.systemInfo=res;
        this.globalData.height = res.statusBarHeight;
        console.info(res.statusBarHeight);
      }
    })
    wx.getSystemInfo({
      success: (e) => {
        let info = wx.getMenuButtonBoundingClientRect()  // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
        let CustomBar = info.bottom + info.top - e.statusBarHeight;
        this.globalData.CustomBar = CustomBar;
      },
    })
  },
  
  globalData: {
    userInfo: null,
    device: null,
    uploadImageSize:{
      width:750,
      height:1334,
    },
    navItem:0,
    communityRefresh:true,//用户有操作，刷新帖子数据
    red_radio: true,
    release_show_text: true
  },
  isMoblie() {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "devtools") {
          that.globalData.device = "devtools"
        } else if (res.platform == "ios") {
          that.globalData.device = "ios"
        } else if (res.platform == "android") {
          that.globalData.device = "android"
        }
      }
    })
  },
  empty(object){
    if(object === undefined || object === null || object === '' || object === 0 || !object){
      return false;
    }else{
      return true;
    }
  },
  request: request,
  base: base,
  wxparse: wxparse,
  common: common,
  utils: utils
})