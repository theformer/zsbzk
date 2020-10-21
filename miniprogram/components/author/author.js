// component/authorize.js
const app = getApp();
//api
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    parameter: {
      type: Object,
      value: {},
      observer: function (data) {
        console.log(data);
      }
    }
  },
  
  data: {
    isAuthor: false, //是否已授权
    showModel: false, //是否授权弹框
  },

  lifetimes: {
    attached() {
      var userInfor = wx.getStorageSync(app.base.UserInfor);
      if (app.empty(userInfor)){
        this.setData({
          isAuthor: true
        })
      }
    }
  },

  methods: {
    //已登陆
    goOn() {
      this.triggerEvent('flagEvent', { parameter: this.data.parameter});
    },
    cancelclick() {
      this.setData({
        modelShow: false
      })
      this.triggerEvent('openEvent', {userAuth:false});
      wx.showToast({
        title: '同意授权才可进一步操作哦',
        icon: 'none', 
        duration: 2000,
      });
    },
    openAuthor() {
      let _this = this;
      var userInfor = wx.getStorageSync(app.base.UserInfor);
      var GetUserInforState = wx.getStorageSync(app.base.GetUserInforState);
      // var GetUserPhoneNumBerState = wx.getStorageSync(app.base.GetUserPhoneNumBerState);
      if (!app.empty(userInfor.account)) {
        if (GetUserInforState) {
          _this.setData({
            modelShow: true,
            title: "操作提示",
            subtitle: "您需要同意授权，才能让更多人看到你哦！",
            author: "getUserInfo"
          })
        } else {
          _this.setData({
            modelShow: true,
            title: "操作提示",
            subtitle: "您需要同意授权，学分才能充值到账哦！",
            author: "getPhoneNumber"
          })
        }
        this.triggerEvent('openEvent', {userAuth:true});
      } else {
        this.triggerEvent('flagEvent', { parameter: this.data.parameter});
      }
    },
    //授权
    bindGetUserInfo(d) {
      var _this = this;
      if (d.detail.userInfo) {
        //用户按了允许授权按钮
        console.log(d.detail)
        app.request.getUserInforForButton({
          url: app.base.getUserInfor,
          data: {
            encryptedData: d.detail.encryptedData,
            iv: d.detail.iv
          },
          success: function (res) {
            //xkw后台解析用户信息正确
            if (res.statusCode == '200') {
              wx.setStorageSync(app.base.GetUserInforState, false);
              let userInfo = wx.getStorageSync(app.base.UserInfor);
              if (userInfo.account != undefined) {
                _this.setData({
                  modelShow: false,
                  isAuthor: true,
                }) 
                _this.triggerEvent('flagEvent', { parameter: this.data.parameter});
                _this.triggerEvent('openEvent', {userAuth:false});
              } else {
                _this.setData({
                  userInfo: res.data,
                  modelShow: true,
                  title: "操作提示",
                  subtitle: "您需要同意授权，学分才能充值到账哦！",
                  author: "getPhoneNumber"
                })
              }
            } else {
              wx.showToast({
                title: '请求授权失败',
                icon: 'none', 
                duration: 2000,
              });
            }
          }
        })
      } else {
        //用户拒绝了授权
        wx.showToast({
          title: '拒绝授权',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    /**
     * 获取用户手机号码
     */
    bindGetPhoneNumber: function(e) {
      var _this = this;
      console.log(e,app.base.UserInfor,'我肯定是个unde',app.base.getPhoneNumbe)
      if (e.detail.encryptedData) {
        app.request.getUserPhoneNumber({
          url: app.base.getPhoneNumber,
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          },
          success: function(res) {
            var userInfor = wx.getStorageSync(app.base.UserInfor);
            if (userInfor != undefined && userInfor.account != undefined) {
              //获取手机号成功,并返回用户信息
              _this.setData({
                modelShow: false,
                isAuthor: true,
              })
              _this.triggerEvent('flagEvent', { parameter: this.data.parameter});
              _this.triggerEvent('openEvent', {userAuth:false});
            } else {
              wx.showToast({
                title: '手机号码授权失败',
                icon: 'none',
                duration: 2000,
              });
            }
          },
          fail: function() {
            wx.showToast({
              title: '手机号码授权失败',
              icon: 'none',
              duration: 2000,
            });
          },
          complete :function(){
            _this.setData({
              modelShow: false,
              isAuthor: true,
            }) 
          }
        })
      } 
    },
    start(){},
  }
})