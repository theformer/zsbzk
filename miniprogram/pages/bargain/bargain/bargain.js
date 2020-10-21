var utils = require('../../../utils/util.js');
var wxApi = require('../../../utils/wxApi.js');
var base = require('../../../conf.js');
var request = require('../../../request.js');
var parse = require("../../../utils/wxParse/wxParse.js");
import Poster from '../../../utils/poster';
var app = getApp();
var checkClick = !1;
var orderFromidClick = !1;

Page({
  data: {
    label: "/static/images/label.png",
    showtab: "family",
    bargainid: "",
    layer: !1,
    cutPrice: "",
    error_hint: !1,
    error_hint_title: "",
    list: {},
    bargain: {},
    bargain_set: {},
    istimeTitle: "剩余时间",
    bargain_record: {},
    bargain_actor: {},
    swi: "",
    trade_swi: "",
    myself_swi: "",
    mid: "",
    randomHint: {
      0: "大王，您即将触及我的价格底线，不要放弃继续砍价吧～",
      1: "主人，达到价格底线就可以带我回家啦！等你哦～",
      2: "加把劲，再砍一刀，马上就到底价了哦～",
      3: "砍到底价购买才划算哦，邀请小伙伴来帮忙吧！",
      4: "叫上您的小伙伴来砍价，我们的的目标是底价买买买！"
    },
    marked_words: "",
    arrived: "",
    timeout: 0,
    showidtype: 1,
    showModal: !1,
    imgUrl: base.imgUrl,
    showDialog: !1,
    pageIndex: !1,
    userInfoShow: !1,
    wechatShow: !1,
    isShowPosterModal: !1,//是否展示海报弹窗
    posterImageUrl: "",//海报地址
    shareModal:true,
    scene:app.globalData.scene,
  },
  getUserInfor: function(t) {
    var r = this;
    
    if(r.data.scene!=1154){
      r.setData({
        userInfoShow: !1
      });
      r.getUserForXKW(t);
    }
  },
  cancelclick: function() {
    if (this.data.bargainid != undefined) {
      this.setData({
        userInfoShow: false
      })
      wx.showToast({
        icon: 'none',
        title: '您拒绝了获取授权信息',
      })
    }
  },
  /**
   * 获取用户手机号码
   */
  getPhoneNumbercallback: function(e) {
    var that = this;
    if (e.detail.encryptedData) {
      that.setData({
        showDlg: false
      })
      app.request.getUserPhoneNumber({
        url: base.getUserPhoneNumber,
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          appTag: 1001,
        },
        success: function(res) {
          var userInfor = wx.getStorageSync(base.UserInfor);
          if (userInfor != undefined && userInfor.account != undefined) {
            //获取手机号成功,并返回用户信息
            that.openBargainItem();
          } else {
            wx.showToast({
              title: '手机号码授权失败',
              icon: 'none'
            });
          }
        },
        fail: function() {
          wx.showToast({
            title: '手机号码授权失败',
            icon: 'none'
          });
        }
      })
    } else {
      that.setData({
        showDlg: false
      })
    }
  },
  /**
   * 关闭弹框
   */
  dismissDlg: function() {
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
  /**
   * 获取用户信息
   */
  getUserForXKW: function(d) {
    var that = this;
    if (d.detail.userInfo) {
      //用户按了允许授权按钮
      console.log(d.detail)
      app.request.getUserInforForButton({
        url: base.getUserInfor,
        data: {
          encryptedData: d.detail.encryptedData,
          iv: d.detail.iv
        },
        success: function(res) {
          //xkw后台解析用户信息正确
          if (res.statusCode == '200') {
            wx.setStorageSync(base.GetUserInforState, false);
            let wxNickName = d.detail.userInfo.nickName;
            let wxImgUrl = d.detail.userInfo.avatarUrl;
            wx.setStorageSync(base.UserNickName, wxNickName);
            wx.setStorageSync(base.UserWximg, wxImgUrl);
            that.setData({
              wxNickName: wxNickName,
              wxImgUrl: wxImgUrl
            })
            if (that.data.itemId != undefined) {
              let userInfo = wx.getStorageSync(base.UserInfor);
              if (userInfo.account != undefined) {
                that.openBargainItem();
              } else {
                that.setData({
                  showContext: "我们需要您的绑定微信的手机号，用以同步App获取您的课程信息^_^",
                  showDlg: !0,
                })
              }
            }else{
              that.getBargainItemById();
            }
          } else {
            console.log('请求失败');
          }
        }
      })
    } else {
      //用户拒绝了授权
      wx.redirectTo({
        url: "/pages/message/auth/index"
      });
    }
  },

  onLoad: function(options) {
    var that = this;
    const scene = decodeURIComponent(options.scene);
    if(this.data.scene==1154){
      this.setData({
        shareModal:!1,
      })
    }
    if (scene !== 'undefined'){
      console.info("scene", scene);
      that.setData({
        bargainid: scene
      })
      that.getBargainItemById();
      console.info(scene);
    }else
    if (options.itemId != undefined) {
      that.setData({
        itemId: options.itemId
      })
      setTimeout(that.openBargainItem,1e3);
    } else
    if (options.bargainid != undefined) {
      that.setData({
        bargainid: options.bargainid
      })
      that.getBargainItemById();
    }
    let pages = getCurrentPages();
    if (pages.length == 1) {
      that.setData({
        pageIndex: !0
      })
    }
    
  },
  /**
   * 获取砍价信息
   */
  getBargainItemById: function() {
    let that = this;
    let userInfor = wx.getStorageSync(base.UserInfor);
    let obj = {
      url: base.getBargainItemById,
      data: {
        id: that.data.bargainid,
        openId: wx.getStorageSync(base.UserOpenId) != "" ? wx.getStorageSync(base.UserOpenId) : userInfor.openId,
      },
      success: (res) => {
        if (res.S == 1) {
          let bargainItem = res.V.bargainItem;
          let bargainItemUserList = res.V.bargainItemUserList.map(item => {
            item.bargainTime = that.getLocalTime(item.bargainTime);
            return item;
          });
          let bargainSwi = res.V.bargainSwi;
          let bargain_price = (bargainItem.total_price - bargainItem.current_price).toFixed(2);
          that.setData({
            bargainItem: bargainItem,
            bargainItemUserList: bargainItemUserList,
            bargain_price: bargain_price,
            istime: 1,
            state: 0,
            myself_swi: bargainSwi.myself_swi,
          })
          parse.wxParse("wxParseData", "html", bargainItem.item.description, that, "0");
          let doetime = parseInt(res.V.bargainItem.create_time / 1e3) + (86400 * bargainItem.itemExercise.bargainValid);
          let today = parseInt(Date.now() / 1e3);
          if(that.data.scene!=1154){ 
            that.getBargainQRCodeById();
          }
          /**
           * status=>0:未完成，1:已成功 , 2：已过期
           * receive_status=> 0：未领取。1：已领取
           * state=>1:未领取，2：已领取，3：不是本人
           */
          if (bargainItem.status == 2) {
            that.setData({
              istime: 2
            })
          } else
          if (bargainItem.status == 0) {
            if (today > doetime) {
              that.setData({
                istime: 2
              })
            } else {
              that.setAnswerTime(today, doetime);
            }
            if (bargainItem.openId != wx.getStorageSync(base.UserOpenId)) {
              that.setData({
                state: 3
              })
            }
          } else if (bargainItem.status == 1) {
            if (bargainItem.openId == wx.getStorageSync(base.UserOpenId)) {
              if (bargainItem.receive_status == 1) {
                that.setData({
                  state: 2,
                })
              } else
              if (bargainItem.itemExercise.itemNum == 0) {
                that.setData({
                  istime: 3
                })
              } else
              if (bargainItem.receive_status == 0) {
                that.setData({
                  state: 1,
                })
              }
            } else {
              that.setData({
                state: 3,
              })
            }
          }
        }
      }
    }
    request.wxRequest(obj);
  },
  getBargainQRCodeById : async function() {
    let that = this;
    if (that.data.bargainItem.status === 0) {
      let bargain = await wxApi.getBargainQRCodeById(that.data.bargainItem.id);
      if (bargain.data.length === 0){
        let timestamp = new Date().getTime();
        let bargainQRCode = await wxApi.addBargainQrCode(that.data.bargainItem.id, timestamp);
        that.setData({
          qrCode: bargainQRCode
        })
      }else{
        let file = await wxApi.getReportQrCodeUrl(bargain.data[0].qrCode);
        let qrCode = file.fileList[0]
        that.setData({
          qrCode: qrCode
        })
      }
    }
  },
  /**
   * 开启砍价
   */
  openBargainItem: function() {
    let that = this;
    var userInfor = wx.getStorageSync(base.UserInfor);
    if(userInfor.account != undefined){
      let obj = {
        url: base.openBargainItem,
        data: {
          account: userInfor.account,
          wxNickName: wx.getStorageSync(base.UserNickName) != "" ? wx.getStorageSync(base.UserNickName) : userInfor.wxNickName,
          wxImgUrl: wx.getStorageSync(base.UserWximg) != "" ? wx.getStorageSync(base.UserWximg) : userInfor.wxImgUrl,
          openId: wx.getStorageSync(base.UserOpenId) != "" ? wx.getStorageSync(base.UserOpenId) : userInfor.openId,
          itemId: that.data.itemId,
        },
        success: (res) => {
          /**
           * res.S
           * 1:开团成功，1003:该课程已开启砍价，1002:该课程已领取
           */
          if (res.S == 1 || res.S == 1003) {
            that.setData({
              bargainid: res.V.id,
            })
            that.getBargainItemById();
          }
        },
        complete: (res) => {}
      }
      request.wxRequest(obj);
    }else{

    }
      
    },
    
    /**
   * 设置砍价倒计时时间
   */
  setAnswerTime(start, end) {
    let r = this;
    clearInterval(r.data.timer);
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    var i = setInterval(function() {
      r.countDown(start, end, "istime");
    }, 1e3);
    r.setData({
      timer: i
    });
  },
  getLocalTime: function(nS) {
    var time = new Date(parseInt(nS)); //先将时间戳转为Date对象，然后才能使用Date的方法
    var year = time.getFullYear(),
      month = time.getMonth() + 1, //月份是从0开始的
      day = time.getDate();
    //add0()方法在后面定义
    return year + '-' + this.add0(month) + '-' + this.add0(day);
  },
  add0: function(m) {
    return m < 10 ? '0' + m : m;
  },
  countDown: function(a, i, t) {
    var e = parseInt(Date.now() / 1e3),
      r = (a > e ? a : i) - e,
      s = parseInt(r),
      n = Math.floor(s / 86400),
      o = Math.floor((s - 24 * n * 60 * 60) / 3600),
      g = Math.floor((s - 24 * n * 60 * 60 - 3600 * o) / 60),
      d = [n, o, g, Math.floor(s - 24 * n * 60 * 60 - 3600 * o - 60 * g)];
    if (this.setData({
        time: d
      }), "istime") {
      var l = "";
      a > e ? (l = "未开始", this.setData({
        istime: 0
      })) : a <= e && i > e ? (l = "剩余时间", this.setData({
        istime: 1
      })) : (l = "活动已经结束，下次早点来~", this.setData({
        istime: 2
      })), this.setData({
        istimeTitle: l
      });
    }
  },
  goodsTab: function(a) {
    this.setData({
      showtab: a.currentTarget.dataset.tap
    });
  },
  cutPrice: function() {
    let that = this;
    if (checkClick==true) {
      return !1;
    }
    checkClick = !0;
    
    let userInfo = wx.getStorageSync(base.UserInfor);
    let getUserInforState = wx.getStorageSync(base.GetUserInforState);
    if (userInfo.account != undefined || !getUserInforState && that.data.scene != 1154) { //授权获取用户信息.
      that.putBargainItem();
    } else {
      that.setData({
        userInfoShow: !0
      })
    }
    setTimeout(function() {
      checkClick = !1;
    }, 2000);
    return !0;
  },
  /**
   * 砍价请求
   */
  putBargainItem: function() {
    let that = this;
    let userInfo = wx.getStorageSync(base.UserInfor);
    let obj = {
      url: base.putBargainItem,
      data: {
        wxNickName: wx.getStorageSync(base.UserNickName) != "" ? wx.getStorageSync(base.UserNickName) : userInfo.wxNickName,
        wxImgUrl: wx.getStorageSync(base.UserWximg) != "" ? wx.getStorageSync(base.UserWximg) : userInfo.wxImgUrl,
        openId: wx.getStorageSync(base.UserOpenId) != "" ? wx.getStorageSync(base.UserOpenId) : userInfo.openId,
        bargainId: that.data.bargainid,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            layer: !0,
            cutPrice: res.V.bargainItemUser.bargainPrice
          });
          if (that.data.myself_swi == 0 && that.data.state == 0) {
            that.subscribeMessage();
          }
          if (res.V.bargainItem.status == 1) {
            that.sendSubscribeMessage();
          }
          that.getBargainItemById();
        } else {
          that.setData({
            error_hint: !0,
            error_hint_title: (res.V.msg || '您已经砍过!')
          })
        }
      }
    }
    request.wxRequest(obj);
  },
  closeLayer: function() {
    this.setData({
      layer: !1
    });
    var a = this.data.bargainid,
      i = this.data.mid;
    this.onLoad({
      id: a,
      mid: i
    });
  },
  closeError: function() {
    this.setData({
      error_hint: !1
    });
  },
  seekHelp: function() {
    
    this.setData({
      wechatShow: !this.data.wechatShow,
    })
    
  },
  /**
   * 领取课程
   */
  receiveBargain: function() {
    let that = this;
    let obj = {
      url: base.receiveBargainItemNew,
      data: {
        bargainId: that.data.bargainid,
        appTag: 1
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            showDialog: !0
          })
        }
      }
    }
    request.wxRequest(obj);
  },
  gotoMycourse() {
    this.setData({
      showDialog: !1,
    })
    wx.navigateTo({
      url: '/pages/course/mycourselist/mycourselist',
    })
  },
  onShareAppMessage: function(a) {
    var that = this;
    that.setData({
      wechatShow:!1,
    })
    return {
      title: "@我 就差你一刀了！成考课程一起来砍价，砍到0元免费拿！",
      path: "/pages/bargain/bargain/bargain?bargainid=" + that.data.bargainid,
      success: function(a) {},
      fail: function(a) {}
    };
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline : function(res){
    console.log(res);
    var that = this;
    return {
      title: "@我 就差你一刀了！成考课程一起来砍价，砍到0元免费拿！",
      query: "bargainid=" + that.data.bargainid,
      success: function(a) {},
      fail: function(a) {}
    };
  },

  /**
   * 生成海报成功-回调
   * @param {} e 
   */
  onPosterSuccess(e) {
    const { detail } = e;
    this.setData({
      posterImageUrl: detail,
      isShowPosterModal: !0,
      wechatShow:!1,
    })
    console.info(detail)
  },
  /**
   * 生成海报失败-回调
   * @param {*} err 
   */
  onPosterFail(err) {
    console.info(err)
  },
  /**
   * 生成海报
   */
  onCreatePoster: async function(){
    console.log("生成海报开始");
    let that = this;
    if (that.data.posterImageUrl !== "") {
      that.setData({
        isShowPosterModal: !0
      })
      return;
    }
    let posterConfig = {
      width: 738,
      height: 1120,
      backgroundColor: '#fff',
      debug: !1
    }
    let blocks = [
      {
        width: 230,
        height: 230,
        x: 245,
        y: 695,
        borderWidth: 10,
        borderColor: '#f43c2e',
        borderRadius: 20,
      },
    ];
    let texts  = [];
    let images = [
      {
        width: 730,
        height: 1120,
        x: 0,
        y: 0,
        url: '/static/images/share/sharebg.jpg',//海报主图
      },
      {
        width: 220,
        height: 220,
        x: 250,
        y: 700,
        url: that.data.qrCode.tempFileURL,//二维码的图
        borderRadius: 10,
      },
    ];
    posterConfig.blocks = blocks;//海报内图片的外框
    posterConfig.texts = texts; //海报的文字
    posterConfig.images = images;

    that.setData({ posterConfig: posterConfig }, () => {
      Poster.create(!0);    //生成海报图片
    });

  },
  /**
   * 隐藏海报弹窗
   * @param {*} e 
   */
  hideModal(e) {
    this.setData({
      isShowPosterModal: !1
    })
  },
  /**
  * 保存海报图片
  */
  savePosterImage: function () {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.posterImageUrl,
      success(result) {
        wx.showModal({
          title: '提示',
          content: '二维码海报已存入手机相册，赶快分享到朋友圈吧',
          showCancel: !1,
          success: function (res) {
            that.setData({
              isShowPosterModal: !1,
              isShow: !1
            })
          }
        })
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("再次发起授权");
          wx.showModal({
            title: '用户未授权',
            content: '如需保存海报图片到相册，需获取授权.是否在授权管理中选中“保存到相册”?',
            showCancel: !0,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    console.log('打开设置', res.authSetting);
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取保存到相册权限成功');
                        } else {
                          console.log('获取保存到相册权限失败');
                        }
                      }
                    })

                  }
                });
              }
            }
          })
        }
      }
    });
  },
  // 免费资料弹框
  showFreeState: function() {
    wx.navigateTo({
      url: '/pages/appDlg/index',
    })
  },
  // 报名入口
  gotoSingup: function() {
    wx.navigateTo({
      url: '/pages/exercise/singup/index/index',
    })
  },
  closeShareTips:function(){
    this.setData({
      shareModal:!1,
    })
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
  /**
   * 订阅消息
   */
  subscribeMessage() {
    var obj = {
      tmplIds: [base.SubscribeMessageBargain],
      orderid: this.data.bargainid,
    }
    request.subscribeMessage(obj);
  },
  /**
   * 发送订阅消息
   */
  sendSubscribeMessage: function() {
    var obj = {
      template_id: base.SubscribeMessageBargain,
      orderid: this.data.bargainid,
    }
    request.sendWechatSubscribeMessage(obj);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.answerTime);
  },
  onReady: function() {
    let that= this;
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;
    let userInfor = wx.getStorageSync(base.UserInfor);
    let getUserInforState = wx.getStorageSync(base.GetUserInforState);
    if (userInfor.account == undefined || getUserInforState) { //授权获取用户信息
      if(that.data.scene == 1154){
        return;
      }
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function(){
        let userInfor = wx.getStorageSync(base.UserInfor);
        let getUserInforState = wx.getStorageSync(base.GetUserInforState);
        
        if(userInfor.account == undefined || getUserInforState){
          that.setData({
            userInfoShow: !0
          })
        }else{
          if(that.itemId == undefined) that.getBargainItemById()
        }
        wx.hideLoading();
      },1e3)
    }
    that.setData({
      isIphoneX: isX || isXS,
    });
  },
});