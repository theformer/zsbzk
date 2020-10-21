var utils = require('../../../utils/util.js');
var base = require('../../../conf.js');
var request = require('../../../request.js');
var wxparse = require("../../../utils/wxParse/wxParse.js");
var app = getApp();

Page({
  data: {
    ShowType: false,
    imgUrl: base.imgUrl,
    showDlg:false,
    showDialog: false,
    loading:false,
  },
  /**
   * 关闭弹框
  */
  dismissDlg: function () {
    var that = this;
    if (that.data.getPhoneStatus) {
      that.setData({
        DefaultValue: "课程信息同步异常"
      })
    }
    that.setData({
      showDlg: false
    })
  },
  onLoad: function(options) {
    let that = this;
    
    if (options.id != undefined) {
      that.setData({
        id: options.id
      })
    }
    if (app.globalData.device == "ios") {
      that.setData({
        ShowType: false,
      })
    }else{
      that.setData({
        ShowType: wx.getStorageSync("ShowType") == 0 ? true : false,
      })
    }
    this.getItembyId();
  },

  getItembyId: function() {
    let that = this;
    that.setloading(true);
    let obj = {
      url: base.getItembyId,
      data: {id:that.data.id},
      success: (res) => {
        if (res.S == 1) {
          let goods = res.V
          that.setData({
            goods: goods
          })
          clearInterval(that.data.timer);
          var dateStr = goods.itemExercise.start_time || '';
          var dateEnd = goods.itemExercise.exerciseTime || '';
          var start_time = Date.parse(dateStr.replace(/-/g, '/'));
          var end_time = Date.parse(dateEnd.replace(/-/g, '/'));
          if (this.data.goods.itemExercise.itemNum == 0) {
            this.setData({
              istimeTitle: '本次活动已抢光，下次早点来~',
              istime: 2
            })
          }else{
            var i = setInterval(function () {
              that.countDown(parseInt(start_time / 1e3), parseInt(end_time / 1e3), "istime");
            }, 1e3);
            that.setData({
              timer: i
            });
          }
          that.putWxparse();
        }
      },
      complete: (res) =>{
        that.setloading(false);
      }
    }
    request.wxRequest(obj);
  },
  putWxparse: function () {
    wxparse.wxParse('wxParseData', 'html', this.data.goods.description, this, "0");
  },
  countDown: function(t, i, e) {
    var a = parseInt(Date.now() / 1e3),
      r = (t > a ? t : i) - a,
      s = parseInt(r),
      n = Math.floor(s / 86400),
      o = Math.floor((s - 24 * n * 60 * 60) / 3600),
      l = Math.floor((s - 24 * n * 60 * 60 - 3600 * o) / 60),
      c = [n, o, l, Math.floor(s - 24 * n * 60 * 60 - 3600 * o - 60 * l)];
    if (this.setData({
        time: c
      }), "istime") {
      var u = "";
      t > a ? (u = "活动开始倒计时", this.setData({
        istime: 0
      })) : t <= a && i > a ? (u = "活动结束剩余", this.setData({
        istime: 1
      })) : (u = "活动已经结束，下次早点来~", this.setData({
        istime: 2
      })), this.setData({
        istimeTitle: u
      });
    }
    
  },
  backhome: function() {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  gotoBuy:function(){
    let that = this;
    wx.navigateTo({
      url: '/pages/order/create/index?id=' + that.data.goods.id,
    })
  },
  /**
   * 开启砍价
   */
  openBargainItem:function(){
    let that = this;
    that.setloading(true);
    var userInfor = wx.getStorageSync(base.UserInfor);
    let obj = {
      url: base.openBargainItem,
      data: {
        account: userInfor.account,
        wxNickName: wx.getStorageSync(base.UserNickName) != "" ? wx.getStorageSync(base.UserNickName) : userInfor.wxNickName,
        wxImgUrl: wx.getStorageSync(base.UserWximg) != "" ? wx.getStorageSync(base.UserWximg) : userInfor.wxImgUrl,
        openId: wx.getStorageSync(base.UserOpenId) != "" ? wx.getStorageSync(base.UserOpenId) : userInfor.openId,
        itemId: that.data.id,
      },
      success: (res) => {
        console.log(res);
        /**
         * res.S
         * 1:开团成功，1003:该课程已开启砍价，1002:该课程已领取
         */
        if (res.S == 1) {
          wx.navigateTo({
            url: "/pages/bargain/bargain/bargain?bargainid=" + res.V.id
          });
        } else if(res.S == 1003){
          wx.navigateTo({
            url: "/pages/bargain/bargain/bargain?bargainid=" + res.V.id
          });
        }
      },
      complete: (res) => {
        that.setloading(false);
      }
    }
    request.wxRequest(obj);
  },
  
  /**
  * 控制 pop 的打开关闭
  * 该方法作用有2:
  * 1：点击弹窗以外的位置可消失弹窗
  * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
  */
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });

  },
  onReady: function () {
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;

    this.setData({
      isIphoneX: isX || isXS,
    });
  },
  /**
   * 加载状态
   */
  setloading(boolean) {
    let that = this;
    that.setData({
      loading: boolean
    })
  },
});