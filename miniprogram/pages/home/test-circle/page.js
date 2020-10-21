// pages/home/test-circle/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pullUp:true,
    loadModal:!1,
    group_modal:!0,//底部加群状态
    pageConfig:{
      pageIndex:1,
      pageSize:20,
      refresher:false,
    },
    postList : [],
    photoUrl: '/static/images/icon/photo.png',
    imgUrl:app.base.imgUrl,
    popoverShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;
    that.setData({
      release_show_text: app.globalData.release_show_text
    })
    that.setData({
      loadModal:!0,
    })
    that.data.pullUp = true;
    that.setData({
      ['pageConfig.refresher']:true,
      ['pageConfig.pageIndex']:1,
      province: wx.getStorageSync('province')
    })
    that.getNewsByType();
    that.getHotPosts();
    let pages = getCurrentPages();
    if (pages.length == 1) {
      this.setData({
        pageIndex: !0
      })
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    if(that.data.delete){
      that.setData({
        delete:false
      })
      that.onLoad()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getHotPosts()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let shareinfo = res.target.dataset.shareinfo;
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
  openEvent(e){
    this.setData({
      userAuth : e.detail.userAuth
    })
  },
  to_hotNews(){
    let that =this;
    wx.navigateTo({
      url: '/pages/home/article/page?id='+ that.data.hotNewsList[that.hotIndex].id,
    })
  },  
  hotChange(e){
    let current = e.detail.current;
    this.hotIndex = current;
  },
    /**
   * 获取今日热榜
   */
  getNewsByType: function() {
    const that = this;
    console.log(that.data.province)
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
    console.log(userInfor)
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
      url: app.base.getPostByLabel,
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
  * 打开评论框
  */
 openMessage:function(e){
   /* const that = this;
   let indexA = e.currentTarget.dataset.indexa;
   let indexB = e.currentTarget.dataset.indexb;
   that.setData({
     commentData: that.data.postList[indexA][indexB],
     messageShow:true,
   }) */
  let type = e.currentTarget.dataset.num ? 1 : 0; 
  let id = e.currentTarget.dataset.id, url = '/packageA/pages/community/article/page?id=' + id + '&type='+ type;
  wx.navigateTo({
    url: url
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
  /**
   * 发帖
   */
  release:function(){
    const that = this;
    app.globalData.release_show_text = false
    console.log(app.globalData.release_show_text)
    that.setData({
      release_show_text: app.globalData.release_show_text
    })
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
})