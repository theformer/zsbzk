var amapFile = require('../../../utils/amap-wx.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex:0,
    current: 0,
    photoUrl: '/static/images/icon/photo.png',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    imgUrl:app.base.imgUrl,
    loading:false,
    swiperListLoad:false,
    reportCount:{},//做题统计
    postList : [],
    pageConfig:{
      pageIndex:1,
      pageSize:20,
      refresher:false,
    },
    pullUp:true,
    messageShow:false,
    popoverShow:false,
    loadModal:!1,
    group_modal:!0,//底部加群状态
    red_radio: app.globalData.red_radio
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let pages = getCurrentPages();
    let height= wx.getSystemInfoSync().windowHeight,
    width= wx.getSystemInfoSync().windowWidth,
    padding,subcourse_width;
    console.log(height)
    console.log(width)
    if(height == 812){
      padding = 11
    } else if(height > 812) {
      padding = 10
    } else if(height >= 667 && height< 812) {
      padding = 8
    } else if(height >= 568 && height< 667) {
      padding = 7
    } else {
      padding = 5
    }

    if(width < 375){
      subcourse_width = 400
    } else {
      subcourse_width = 425
    }
    this.setData({
      padding: padding+"%",
      subcourse_width: subcourse_width+ "rpx"
    })
    if (pages.length == 1) {
      this.setData({
        pageIndex: !0
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  question_init(){
    const that = this;
    that.setData({
      loadModal:!0,
    })
  },
  article_init (){
    const that = this;
    that.setData({
      loadModal:!0,
    })
    that.data.pullUp = true;
    that.setData({
      ['pageConfig.refresher']:true,
      ['pageConfig.pageIndex']:1,
    })
    that.getNewsByType();
    that.getHotPosts();
  },

  /**
   * 获取题库统计数据
   */
  getUserReportCount : function(){
    const that = this;
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    let subCourse = wx.getStorageSync("subCourse");
    if(!that.data.subCourse){
      return ;
    }
    let param = {
      subcourseId : subCourse.subCourseId,
    }
    if(app.empty(userInfor)){
      param.userId =  userInfor.id;
    }
    let obj = {
      url: app.base.getUserReportCount,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ["reportCount"]:res.V,
          })
          that.setData({
            loadModal:!1,
          })
          
        }
      }
    }
    app.request.wxRequest(obj);
  },
  toCollection(){
    wx.navigateTo({
      url: '/pages/question/collection/page',
    })
  },
  toWrongReview(){
    wx.navigateTo({
      url: '/pages/question/wrongReview/page',
    })
  },
  toReport(){
    wx.navigateTo({
      url: '/pages/question/report/page',
    })
  },
  to_paper(e){
    wx.navigateTo({
      url: '/pages/question/paper/page?PaperTypeId='+ e.currentTarget.dataset.type,
    })
  },
  to_credit(e){
    wx.navigateTo({
      url: '/pages/credit_activity/course/page',
    })
  },
  to_singin(){
    wx.navigateTo({
      url: '/pages/member/singin/page',
    })
  },
  hotChange(e){
    let current = e.detail.current;
    this.hotIndex = current;
  },
  to_hotNews(){
    let that =this;
    wx.navigateTo({
      url: '/pages/home/article/page?id='+ that.data.hotNewsList[that.hotIndex].id,
    })
  },
  /**
   * 获取今日热榜
   */
  getNewsByType: function() {
    const that = this;
    if(that.data.province == undefined){
      return;
    }
    let param ={
      typeIds: 2,
      provinceId: that.data.province.id,
      pageIndex: 1,
      pageSize:5,
    }
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)){
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getNewsByType,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.hotIndex = 0;
          that.setData({
            hotNewsList : res.V[0].newsList,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 获取热榜帖子
   */
  getHotPosts(){
    let that = this;
    if(!that.data.pullUp){
      return
    }
    if(that.data.province == undefined){
      return;
    }
    that.data.pullUp = false;
    that.setData({
      ['pageConfig.refresher']: false ,
      pullUp:false,
    })
    let param = {
      provinceId: that.data.province.id,
      pageSize: that.data.pageConfig.pageSize,
      pageIndex: that.data.pageConfig.pageIndex,
    };
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getHotPosts,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.data.pullUp = true;
          that.setData({
            pullUp:true,
          })
          if (!that.data.pageConfig.refresher) {//分页加载
            that.setData({
              ['pageConfig.pageIndex']: that.data.pageConfig.pageIndex + 1,
              ["postList[" + (that.data.pageConfig.pageIndex - 1) + "]"]: res.V,
            })
          } else {//重新刷新
            that.setData({
              ['pageConfig.pageIndex']: that.data.pageConfig.pageIndex + 1,
              ["postList"]: [res.V],
            })
          }
        }
        that.setData({
          loadModal:!1,
        })
      },
    }
    app.request.wxRequest(obj);
  },
  /**
   * 发帖
   */
  release:function(){
    const that = this;
    wx.navigateTo({
      url: '/packageA/pages/community/release/page',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.on('reloading', function (data) {
          that.article_init();
        })
      }
    })
  },
  to_wechat(e){
    wx.navigateTo({
      url: '/packageA/pages/wechat/page?type='+ e.currentTarget.dataset.type,
    })
  },
  group_close(){
    this.setData({
      group_modal : !1,
    })
  },
  openCommunity:function(e){
    const that = this;
    let id = e.currentTarget.dataset.id;
    let video = e.currentTarget.dataset.video;
    let url = '/packageA/pages/community/article/page?id=' + id ;
    if(video){
      url += '&videoPlay=' + video;
    }
    wx.navigateTo({
      url: url,
      success: function (res) {
      },
    })
  },
  /**
   * 打开资讯
   */

  bindChange: function(e) {
    const that = this;
    var activeIndex = e.detail.current;
    that.setData({
      activeIndex: activeIndex,
    })
  },
  questionChange: function() {
    const that = this;
    wx.navigateTo({
      url: '/pages/home/course_options/page',
      events: {
        updateCourse: function(res) {
          that.setData({
            course:res.course,
            subCourse:res.subCourse,
          })
          that.getUserReportCount();
        }
      },
      success: function(res) {
        
      },
    })
  },
  //获取当前位置的经纬度
  loadInfo: function() {
    var that = this;
    let provinceName = wx.getStorageSync("provinceName");
    if (provinceName == undefined || provinceName == '') {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          console.info("LocationError", res);
          var latitude = res.latitude //维度
          var longitude = res.longitude //经度
          that.loadCity(latitude, longitude);
        },
        fail: function(res) {
          console.error("LocationError", res);
          provinceName = '广东省';
          that.getCollegeProvince(provinceName);
        }
      })
    } else {
      that.getCollegeProvince(provinceName);
    }
  },
  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function(latitude, longitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.base.mapKey
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function(data) {
        let provinceName = data[0].regeocodeData.addressComponent.province;
        wx.setStorageSync("provinceName", provinceName);
        that.getCollegeProvince(provinceName);
      },
      fail: function(info) {
        console.error("定位失败",info);
      }
    });
  },
  getCollegeProvince(provinceName) {
    let that = this;
    let obj = {
      url: app.base.getProvinceList,
      data: {
        course_id:5,
      },
      success: (res) => {
        if (res.S == 1) {
          console.log(res);
          let hotProvince = res.V.hotProvince;
          let provinceList = res.V.provinceList;
          let province = {};
          provinceList.map(item => {
            item.provinces.map(val => {
              if (val.name == provinceName) {
                province = val;
              }
            })
          })
          that.setData({
            province: province,
          })
          wx.setStorageSync('hotProvince', hotProvince);
          wx.setStorageSync('provinceList', provinceList);
          wx.setStorageSync('province', province);
          that.article_init();
        }
      },
      fail:(res)=>{
        console.error('getCollegeProvince', res);
      }
    }
    app.request.wxRequest(obj);
  },
  city_options(){
    let that = this;
    app.globalData.red_radio = false
    that.setData({
      red_radio: app.globalData.red_radio
    })
    wx.navigateTo({
      url: '/pages/home/province/page',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        eventCallback: function (data) {
         that.setData({
           province:data,
         })
         wx.setStorageSync('province', data);
         that.article_init();
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          province : that.data.province,
        })
      }
    })
  },
  /**
   * 播放视频
   */
  playVideo: function(e) {
    const that = this;
    let id = e.currentTarget.dataset.id;
    let url = '/pages/home/article/page?id=' + id ;
      url += '&videoPlay=1';
    wx.navigateTo({
      url: url,
      success: function (res) {
      },
    })
  },
  goCommunity:function(e){
    const that = this;
    let id = e.currentTarget.dataset.id;
    app.globalData.tabTun = true;
    wx.setStorageSync("tabIndex", id);
    console.log(that.data.province);
    // wx.navigateTo({
    //   url: '/packageA/pages/community/index/page',
    //   success(res){
        
    //   }
    // })
  },
  /**
   * 加载更多数据
   */
  loadData:function(e){
    console.log("触发加载",e);
  },

  /**
   * 打开评论框
   */
  openMessage:function(e){
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    that.setData({
      commentData: that.data.postList[indexA][indexB],
      messageShow:true,
    })
  },
  close_message:function(){
    const that = this;
    that.setData({
      messageShow: false,
    })
  },
  /**
   * 拉黑举报
   */
  openPorover:function(e){
    const that = this;
    let touches = e.detail;
    touches.type = 1;
    let poroverON = {
       a : e.currentTarget.dataset.indexa,
       b : e.currentTarget.dataset.indexb,
    }
    that.setData({
      popoverShow:true,
      touches : touches,
      poroverON: poroverON,
    })
  },
  popover_callback:function(e){
    const that = this;
    let mark = e.detail.result;
    if (mark != undefined){
      let param = {
        type: 1,
        markId: mark.id
      };
      let poroverON = that.data.poroverON;
      if (mark.name == '拉黑作者') {
        param.targetId = that.data.postList[poroverON.a][poroverON.b].userId
      }else{
        param.targetId = that.data.postList[poroverON.a][poroverON.b].id
      }
      let userInfor = wx.getStorageSync(app.base.UserInfor);
      if (app.empty(userInfor)) {
        param.userId = userInfor.id;
      }
      let obj = {
        url: app.base.addUserMark,
        data: param,
        success: (res) => {
          if (res.S == 1) {
            if (mark.name == "拉黑作者" || mark.name == "屏蔽此贴" || mark.id == 11 || mark.id == 13){
              that.setData({
                ["pageConfig.refresher"]: true,
              })
            }
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000,
            })
            that.setData({
              popoverShow:!1,
              poroverON: {},
            })
          }
        }
      }
      app.request.wxRequest(obj);
    }else{
      that.setData({
        popoverShow:!1,
        poroverON: {},
      })
    }
  },
  /**点赞 */
  userAddLikeCount:function(e){
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    let obj = {
      url: app.base.addLikeCount,
      data: {
        id: that.data.postList[indexA][indexB].id,
        userId: wx.getStorageSync(app.base.UserInfor).id,
        type:2,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ["postList[" + indexA + "][" + indexB + "].likeCount"]: that.data.postList[indexA][indexB].likeCount + res.V,
            ["postList[" + indexA + "][" + indexB + "].likeState"]: res.V,
          })
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  openEvent(e){
    this.setData({
      userAuth : e.detail.userAuth
    })
  },
  onShare(e){
    let that = this;
    let obj = that.data.postList[e.currentTarget.dataset.indexa][e.currentTarget.dataset.indexb];
    let shareParam = {
      title: obj.title,
      path: 'packageA/pages/community/article/page?id='+obj.id,
      imageUrl: "https://tel.360xkw.com/attachment/xcx_zkb_xf.png",
    }
    that.setData({
      shareShow : !0,
      shareParam : shareParam,
    })
  },
  closeShare(){
    this.setData({
      shareShow : !1,
    })
  },
  


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let t = this;
    let course = wx.getStorageSync('course');
    let subCourse = wx.getStorageSync('subCourse');
    if(!app.empty(course)){
      wx.redirectTo({
        url: '/pages/home/course_options/page',
      })
    }else{
      t.setData({
        course:course,
        subCourse:subCourse,
      })
    }
    let province = wx.getStorageSync('province');
    if (province.id == undefined) {
      t.loadInfo();
    } else {
      t.setData({
        province: province,
      })
      if(app.globalData.communityRefresh){
        t.article_init();
        app.globalData.communityRefresh  = !1;
      }
    }
    if(t.data.subCourse != undefined){
      t.getUserReportCount();
    }
    if(app.globalData.navItem != undefined){
      t.setData({
        navIndex:app.globalData.navItem,
        current:app.globalData.navItem,
      })
      app.globalData.navItem = undefined;
    }
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;
    t.setData({
      isIphoneX: isX || isXS,
    });
    if (typeof t.getTabBar === 'function' &&
      t.getTabBar()) {
      t.getTabBar().setData({
        customTabBarSelected: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    const that =this;
    // that.getNewsByType();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let shareinfo = res.target.dataset.shareinfo;
    console.log(shareinfo)
    if(shareinfo != undefined){
      app.common.addUserTaskRecord({id: shareinfo.id , subtype: 6 })
      app.common.addShareCount({id:shareinfo.id});
      return {
        title: shareinfo.title,
        path: 'packageA/pages/community/article/page?id=' + shareinfo.id,
        imageUrl: "https://tel.360xkw.com/attachment/xcx_zkb_xf.png",
      }
    }
  },
  to_myclass:function () {
    wx.navigateTo({
      url: '/pages/member/myCourse/list/page',
    })
  },
  toNextCurrent: function() {
    wx.navigateTo({
      url: '/pages/home/test-circle/page',
    })
  }
})