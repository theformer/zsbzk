// packageA/pages/community/module/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoUrl: "/static/images/icon/photo.png",
    activeIndex:0,
    current: 0,
    pageSize:10,
    dataList:[],
    messageShow:false,
    pullUp:true,
    imgUrl:app.base.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let modules = wx.getStorageSync("modules");
    if (!app.empty(modules)){
      that.getModules();
    }else{
      modules.forEach(item=>{
        item.pageIndex = 1;
      });
      that.setData({
        modules: modules
      })
      that.getModuleData();
    }
    if(options.activeIndex != undefined){
      that.setData({
        activeIndex: options.activeIndex,
        current: options.activeIndex,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 获取社区版块
   */
  getModules() {
    let that = this;
    let obj = {
      url: app.base.getModules,
      data: {},
      success: (res) => {
        if (res.S == 1) {
          let modules = res.V;
          wx.setStorageSync('modules', res.V);
          modules.forEach(item => {
            item.pageIndex = 1;
            item.loadState = false;
          });
          that.setData({
            modules: modules,
          })
          that.getModuleData();
        }
      }
    }
    app.request.wxRequest(obj);
  },

  getModuleData(){
    const that= this;
    let modules = that.data.modules;
    modules.forEach((item,index)=>{
      that.getPostByModule(index);
    })
  },

  getPostByModule(index){
    let that = this;
    that.setData({
      pullUp: false,
    })
    let param = {
      provinceId: wx.getStorageSync('province').id,
      moduleId: that.data.modules[index].id,
      pageSize: that.data.pageSize,
      pageIndex: that.data.modules[index].pageIndex,
    }
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if(app.empty(userInfor)){
      param.userId=userInfor.id;
    }
    let obj = {
      url: app.base.getPostByModule,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ["modules[" + index + "].pageIndex"]: that.data.modules[index].pageIndex + 1,
            ["dataList[" + index + "][" + (that.data.modules[index].pageIndex - 1) + "]"]: res.V,
            ["modules[" + index + "].loadState"]: true
          })
        }else{
          that.setData({
            ["modules[" + index + "].loadState"]: false
          })
        }
        that.setData({
          pullUp: true,
        })
      }
    }
    app.request.wxRequest(obj);
  },

  getPostNewDate : function(){
    let that = this;
    that.setData({
      ["modules[" + that.data.activeIndex + "].refresher"]: true,
    })
    wx.showLoading({
      title: "刷新数据",
    });
    let param = {
      provinceId: wx.getStorageSync('province').id,
      moduleId: that.data.modules[that.data.activeIndex].id,
      pageSize: that.data.pageSize,
      pageIndex: 1,
    };
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getPostByModule,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ["modules[" + that.data.activeIndex + "].pageIndex"]: 2,
            ["dataList[" + that.data.activeIndex + "]"]: [res.V],
            ["modules[" + that.data.activeIndex + "].loadState"]: true
          })
        } else {
          that.setData({
            ["dataList[" + that.data.activeIndex + "]"]: [],
            ["modules[" + that.data.activeIndex + "].loadState"]: false
          })
        }
        setTimeout(() => {
          that.setData({
            ["modules[" + that.data.activeIndex + "].refresher"]: false,
          })
          wx.hideLoading();
          wx.showToast({
            title: '刷新成功',
            icon: 'success'
          })
        }, 1000);
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 加载更多数据
   */
  pushNewData:function(e){
    const that = this;
    if (that.data.modules[that.data.activeIndex].loadState && that.data.pullUp) {
      that.getPostByModule(that.data.activeIndex);
    }
  },

  /**
   * 打开帖子
   */
  openArticle: function (e) {
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    wx.navigateTo({
      url: '/packageA/pages/community/article/page',
      success: function (res) {
        res.eventChannel.emit('articleData', that.data.dataList[that.data.activeIndex][indexA][indexB]);
        app.common.addUserTaskRecord({ id: that.data.dataList[that.data.activeIndex][indexA][indexB].id, type: 2, subtype: 3 });
        app.common.addUserHistory({
          type: 2,
          recordId: that.data.dataList[that.data.activeIndex][indexA][indexB].id
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**点赞 */
  userAddLikeCount: function (e) {
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    if (that.data.dataList[that.data.activeIndex][indexA][indexB].likeState == 1){
      wx.showToast({
        title: '已点赞，请勿重复点赞',
        icon:'none',
        duration:2000,
      })
      return;
    }
    let obj = {
      url: app.base.addLikeCount,
      data: {
        id: that.data.dataList[that.data.activeIndex][indexA][indexB].id,
        userId: wx.getStorageSync(app.base.UserInfor).id,
        type: 2,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ["dataList[" + that.data.activeIndex + "][" + indexA + "][" + indexB + "].likeCount"]: that.data.dataList[that.data.activeIndex][indexA][indexB].likeCount + 1,
            ["dataList[" + that.data.activeIndex + "][" + indexA + "][" + indexB + "].likeState"]:1,
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000,
          })
        }else{
          wx.showToast({
            title: '已点赞，请勿重复点赞',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  scrollClick: function (e) {
    const that = this;
    var current = e.detail.selectedIndex;
    that.setData({
      current: current,
      activeIndex: current,
    })
  },
  bindChange: function (e) {
    const that = this;
    var activeIndex = e.detail.current;
    that.setData({
      activeIndex: activeIndex,
    })
  },
  /**
   * 播放视频
   */
  playVideo: function (e) {
    const that = this;
    that.data.dataList.forEach((v, i, arr) => {
      v.forEach((x, y, arrA) => {
        x.forEach((item, index, arrB) => {
          if (item.state == 2) {
            if (item.play) {
              that.setData({
                ["dataList[" + i + "][" + y + "][" + index + "].play"]: false
              })
            }
          }
        })
      })
    })
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    that.setData({
      ["dataList[" + that.data.activeIndex + "][" + indexA + "][" + indexB + "].play"]: true
    })
  },
  /**
   * 打开评论框
   */
  openMessage: function (e) {
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    that.setData({
      commentData: that.data.dataList[that.data.activeIndex][indexA][indexB],
      messageShow: true,
    })
  },
  close_message: function () {
    const that = this;
    that.setData({
      messageShow: false,
    })
  },
  /**
   * 打开图片
   */
  openImage: function (e) {
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    let indexC = e.currentTarget.dataset.indexc;
    let oldUrls = that.data.dataList[that.data.activeIndex][indexA][indexB].urls;
    let urls = [];
    oldUrls.forEach(v => {
      urls.push(that.data.imgUrl + v.url);
    })
    wx.previewImage({
      current: urls[indexC], // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },

  openPorover: function (e) {
    const that = this;
    let touches = e.detail;
    touches.type=1;
    console.log(e);
    let poroverON = {
      a: e.currentTarget.dataset.a,
      b: e.currentTarget.dataset.b,
      c: e.currentTarget.dataset.c,
    }
    that.setData({
      touches: touches,
      poroverON: poroverON,
    })
  },
  popover_callback: function (e) {
    const that = this;
    let mark = e.detail.result;
    if (mark != undefined) {
      let param = {
        type: 1,
        markId: mark.id
      };
      let poroverON = that.data.poroverON;
      if (mark.name == '拉黑作者') {
        param.targetId = that.data.dataList[poroverON.a][poroverON.b][poroverON.c].userId
      } else {
        param.targetId = that.data.dataList[poroverON.a][poroverON.b][poroverON.c].id
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
            if (mark.name =='拉黑作者' || mark.name=='屏蔽此贴') {
              that.data.modules[poroverON.a].pageIndex=1;
              that.getPostByModule(poroverON.a);
            }
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000,
            })
            that.setData({
              poroverON: {},
            })
          }
        }
      }
      app.request.wxRequest(obj);
    } else {
      that.setData({
        poroverON: {},
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    const that = this;
    if (!that.data.messageShow) {
      that.getPostByModule(that.data.activeIndex);
    } else {
      return false;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const that = this;
    let indexA = e.target.dataset.indexa;
    let indexB = e.target.dataset.indexb;
    let obj = that.data.dataList[that.data.activeIndex][indexA][indexB];
    app.common.addUserTaskRecord({ type: 2, subtype: 6 });
    return {
      title: obj.title,
      path: 'packageA/pages/community/article/page?id=' + obj.id,
      imageUrl: "https://tel.360xkw.com/attachment/xcx_zkb_xf.png",
    }
  }
})