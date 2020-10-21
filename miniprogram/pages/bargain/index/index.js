 // pages/course/index/index.js
var utils = require('../../../utils/util.js');
var base = require('../../../conf.js');
var request = require('../../../request.js');
var app = getApp();
Page({
  data: {
    list: {},
    emptyHint: !1,
    label: "/static/images/label.png",
    showFree: false,
    scenes: true,
    device: app.globalData.device,
    ShowType: false,
    imgUrl: base.imgUrl,
    modelShow:false,
    loading:false,
  },

  onLoad: function() {
    let that = this;
    that.setData({
      ShowType: wx.getStorageSync("ShowType") == 0 ? true : false,
    })
    that.getBargainItemList();
  },
  getBargainItemList: function() {
    let that = this;
    that.setData({
      loading:true,
    })
    let obj = {
      url: base.getBargainItemList,
      data: {
        courseId: base.courseId
      },
      success: (res) => {
        console.log(res);
        if (res.S == 1) {
          let list = res.V
          that.setData({
            list: list
          })
        }
      },
      complete:(res)=>{
        that.setData({
          loading: false,
        })
      }
    }
    request.wxRequest(obj);
  },

  showFreedismissDlg: function() {
    //免费资料弹框取消
    this.setData({
      showFree: false
    })
  },
  showFreeState: function() {
    // 免费资料弹框
    var that = this;
    that.setData({
      showFree: !that.data.showFree
    })
  },
  onReady:function(){
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;
    this.setData({
      isIphoneX: isX || isXS,
    });
  },

});