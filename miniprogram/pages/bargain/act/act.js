// pages/course/index/index.js
var utils = require('../../../utils/util.js');
var base = require('../../../conf.js');
var request = require('../../../request.js');
var app = getApp();
Page({
  data: {
    ShowType: false,
    imgUrl: base.imgUrl,
  },

  onLoad: function () {
    var that = this;
    that.setData({
      ShowType: wx.getStorageSync("ShowType") == 0 ? true : false,
    })
    that.getMyBargainItemList();
  },
  getMyBargainItemList: function () {
    let that = this;
    let userInfo = wx.getStorageSync(base.UserInfor);
    let obj = {
      url: base.getMyBargainItemListNew,
      data: {
        account: userInfo.account
      },
      success: (res) => {
        if (res.S == 1) {
          let list = res.V
          that.setData({
            list: list
          })
        }
      }
    }
    request.wxRequest(obj);
  },
  onReady: function () {
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;

    this.setData({
      isIphoneX: isX || isXS,
    });
  },
});