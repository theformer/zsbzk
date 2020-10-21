// components/share/component.js
const app = getApp();
var cloudAPI = require('../../cloudAPI.js');
import Poster from '../../utils/poster';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * shareParam参数说明
     * @title 分享标题
     * @content 分享内容
     * @imageUrl 分享封面图
     * @path  分享路径
     */
    shareParam:{
      type: Object,
      value: {},
      observer: function (data) {
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 分享微信好友
     */
    share(){
      let that = this;
      that.triggerEvent('callback',{});
    },
    /**
     * 分享微信朋友圈
     */
    onWechatCircle: async function(){
      let that = this;
      // wx.showLoading({
      //   title: '加载中,请稍等...',
      // })
      let qrCode = await that.getShareQRCodeByPath();
      if(qrCode != undefined){
        await that.onCreatePoster();
      }
    },
    close(){
      let that = this;
      that.triggerEvent('callback',{});
    },
    /**
     * 生成海报
     */
    onCreatePoster: async function(){
      let that = this;
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
    
    /**
     * 获取二维码
     */
    getShareQRCodeByPath : async function() {
      let that = this;
      let result = await cloudAPI.getShareQRCodeByPath(that.data.shareParam.path);
      console.log(result);
      if (result.data.length === 0){
        let timestamp = new Date().getTime();
        let cloud_data = await cloudAPI.addShareQRCode(that.data.shareParam.path, timestamp);
        let qrCode = cloud_data.result[0];
        that.setData({
          qrCode: qrCode,
        })
        console.log(qrCode);
        return qrCode;
      }else{
        let file = await cloudAPI.getReportQrCodeUrl(result.data[0].qrCode);
        let qrCode = file.fileList[0];
        that.setData({
          qrCode: qrCode
        })
        console.log("qrcode",qrCode)
        return qrCode;
      }
    },
  }
})
