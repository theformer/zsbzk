const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoUrl:"/static/images/icon/photo.png",
    tabIndex:1,
    current:1,
    pageSize:20,//分页总数
    swiperPage:[
      {
        pageIndex: 1,
        title: "精选推荐",
        loadState:false
      },
      {
        pageIndex: 1,
        title: "热榜",
        loadState: false
      },
      {
        pageIndex: 1,
        title: "视频社区",
        loadState: false
      },
    ],
    messageShow:false,//评论框
    release_show:true,
    pullUp:true,
    postList:[[],[],[]],
    imgUrl: app.base.imgUrl,
    systemInfo: app.globalData.systemInfo,
    GAPBOTTOM:64,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.init();
    setTimeout(function () {
      that.setData({
        release_show:false,
      })
    }, 2000);
    
  },
  init(){
    const that = this;
    that.setData({
      ['swiperPage[0].pageIndex']: 1,//精选分页
      ['swiperPage[1].pageIndex']: 1,//热榜分页
      ['swiperPage[2].pageIndex']: 1,//视频分页
    })
    that.getPostByLabel();//1
    that.getModules();
    that.getHotPosts();//2
    console.log('init')
    that.getVideoPost();//3
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * 获取精选帖子
   */
  getPostByLabel(){
    let that = this;
    that.setData({
      pullUp:false,
    })
    let param = {
      provinceId: wx.getStorageSync('province').id,
      labelId: 1,
      pageSize: that.data.pageSize,
      pageIndex: that.data.swiperPage[0].pageIndex,
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
          if (!that.data.swiperPage[0].refresher) {
            that.setData({
              ['swiperPage[0].pageIndex']: that.data.swiperPage[0].pageIndex + 1,
              ["postList[0][" + (that.data.swiperPage[0].pageIndex - 1) + "]"]: res.V,
              ['swiperPage[0].loadState']: true
            })
          } else {
            that.setData({
              ['swiperPage[0].pageIndex']: that.data.swiperPage[0].pageIndex + 1,
              ["postList[0]"]: [res.V],
              ['swiperPage[0].loadState']: true
            })
          }
        } else {
          if(that.data.swiperPage[0].pageIndex===1){
            that.setData({
              ["postList[0]"]: [],
              ['swiperPage[0].loadState']: false
            })
          }else{
            that.setData({
              ["postList[0][" + (that.data.swiperPage[0].pageIndex - 1) + "]"]: [],
              ['swiperPage[0].loadState']: false
            })
          }
        }
        if (that.data.swiperPage[0].refresher){
          setTimeout(() => {
            that.setData({
              ["swiperPage[0].refresher"]: false,
            })
            wx.hideLoading();
            wx.showToast({
              title: '刷新成功',
              icon: 'success'
            })
          }, 1000);
        }
        that.setData({
          pullUp: true
        })
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 获取社区版块
   */
  getModules(){
    let that = this;
    let obj = {
      url: app.base.getModules,
      data: {},
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            modules:res.V,
          })
          wx.setStorageSync('modules',res.V);
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
    that.setData({
      pullUp:false,
    })
    let param = {
      provinceId: wx.getStorageSync('province').id,
      pageSize: that.data.pageSize,
      pageIndex: that.data.swiperPage[1].pageIndex,
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
          that.getHotTopics();
          if (!that.data.swiperPage[1].refresher) {
            that.setData({
              ['swiperPage[1].pageIndex']: that.data.swiperPage[1].pageIndex + 1,
              ["postList[1][" + (that.data.swiperPage[1].pageIndex - 1) + "]"]: res.V,
              ['swiperPage[1].loadState']: true
            })
          } else {
            that.setData({
              ['swiperPage[1].pageIndex']: that.data.swiperPage[1].pageIndex + 1,
              ["postList[1]"]: [res.V],
              ['swiperPage[1].loadState']: true
            })
          }
        } else {
          if(that.data.swiperPage[1].pageIndex===1){
            that.setData({
              ["postList[1]"]: [],
              ['swiperPage[1].loadState']: false
            })
          }else{
            that.setData({
              ["postList[1][" + (that.data.swiperPage[1].pageIndex - 1) + "]"]: [],
              ['swiperPage[1].loadState']: false
            })
          }
        }
        if (that.data.swiperPage[1].refresher) {
          setTimeout(() => {
            that.setData({
              ["swiperPage[1].refresher"]: false,
            })
            wx.hideLoading();
            wx.showToast({
              title: '刷新成功',
              icon: 'success'
            })
          }, 1000);
        }
        that.setData({
          pullUp: true,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  getHotTopics() {
    let that = this;
    let obj = {
      url: app.base.getHotTopics,
      data: {
        provinceId: wx.getStorageSync('province').id,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            hotTopics: res.V
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 获取视频帖子
   */
  getVideoPost(){
    let that = this;
    that.setData({
      pullUp: false,
    })
    let param = {
      provinceId: wx.getStorageSync('province').id,
      pageSize: that.data.pageSize,
      pageIndex: that.data.swiperPage[2].pageIndex,
    };

    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getVideoPost,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          if (!that.data.swiperPage[2].refresher){
            that.setData({
              ['swiperPage[2].pageIndex']: that.data.swiperPage[2].pageIndex + 1,
              ["postList[2][" + (that.data.swiperPage[2].pageIndex - 1) + "]"]: res.V,
              ['swiperPage[2].loadState']: true
            })
          }else{
            that.setData({
              ['swiperPage[2].pageIndex']: that.data.swiperPage[2].pageIndex + 1,
              ["postList[2]"]: [res.V],
              ['swiperPage[2].loadState']: true
            })
          }
        }else{
          if(that.data.swiperPage[2].pageIndex===1){
            that.setData({
              ["postList[2]"]: [],
              ['swiperPage[2].loadState']: false
            })
          }else{
            that.setData({
              ["postList[2][" + (that.data.swiperPage[2].pageIndex - 1) + "]"]: [],
              ['swiperPage[2].loadState']: false
            })
          }
        }
        if (that.data.swiperPage[2].refresher) {
          setTimeout(() => {
            that.setData({
              ["swiperPage[2].refresher"]: false,
            })
            wx.hideLoading();
            wx.showToast({
              title: '刷新成功',
              icon: 'success'
            })
          }, 1000);
        }
        that.setData({
          pullUp: true,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 加载更多数据
   */
  pushNewData:function(){
    const that = this;
    if (that.data.pullUp){
      console.log("加载更多")
      if (that.data.tabIndex == 0 && that.data.swiperPage[0].loadState){
        that.getPostByLabel();
      } else if (that.data.tabIndex == 1 && that.data.swiperPage[1].loadState){
        that.getHotPosts();
      } else if (that.data.tabIndex == 2 && that.data.swiperPage[2].loadState){
        that.getVideoPost();
      }
    }
  },
  /**
   * 刷新数据
   */
  getPostNewDate:function(){
    let that = this;
    that.setData({
      ["swiperPage[" + that.data.tabIndex + "].refresher"]: true,
    })
    wx.showLoading({
      title: "刷新数据",
    });
    if (that.data.tabIndex == 0) {
      that.setData({
        ["swiperPage[" + that.data.tabIndex + "].pageIndex"]: 1,
      })
      that.getPostByLabel();//1
    } else if (that.data.tabIndex == 1) {
      that.setData({
        ["swiperPage[" + that.data.tabIndex + "].pageIndex"]: 1,
      })
      that.getHotPosts();
    } else if (that.data.tabIndex == 2) {
      that.setData({
        ["swiperPage[" + that.data.tabIndex + "].pageIndex"]: 1,
      })
      that.getVideoPost();
    }
    
  },
  tabChange:function(e){
    const that= this;
    that.setData({
      tabIndex :e.currentTarget.dataset.id,
      current : e.currentTarget.dataset.id,
    })
  },
  swiperChange:function(e){
    const that = this;
    that.setData({
      tabIndex: e.detail.current
    })
  },
  /**
   * 播放视频
   */
  playVideo:function(e){
    const that = this;
    that.data.postList.forEach((v, i, arr) => {
      v.forEach((x, y, arrA) => {
        x.forEach((item, index, arrB) => {
          if (item.state == 2) {
            if (item.play) {
              that.setData({
                ["postList[" + i + "][" + y + "][" + index + "].play"]: false
              })
            }
          }
        })
      })
    })
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    that.setData({
      ["postList[" + that.data.tabIndex + "][" + indexA + "][" + indexB + "].play"]: true
    })
    var playVideoId = that.data.postList[that.data.tabIndex][indexA][indexB].id;
    this.observerObj = this.observerObj = wx.createIntersectionObserver().relativeToViewport();
    console.log('listen ' + playVideoId);
    // 监听目标视频跟viewport相交区域的变化
    this.observerObj.observe(`#video${playVideoId}`, this.controlVideos);
  },
  controlVideos: function (res) {
    let that =this;
    if (res && res.intersectionRatio > 0) {
      
    }else{
      that.data.postList.forEach((v, i, arr) => {
        v.forEach((x, y, arrA) => {
          x.forEach((item, index, arrB) => {
            if (item.state == 2) {
              if (item.play) {
                that.setData({
                  ["postList[" + i + "][" + y + "][" + index + "].play"]: false
                })
              }
            }
          })
        })
      })
    }
    
  },
  /**点赞 */
  userAddLikeCount:function(e){
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    if (that.data.postList[that.data.tabIndex][indexA][indexB].likeState == 1){
      wx.showToast({
        title: '已点赞',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    let obj = {
      url: app.base.addLikeCount,
      data: {
        id: that.data.postList[that.data.tabIndex][indexA][indexB].id,
        userId: wx.getStorageSync(app.base.UserInfor).id,
        type:2,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ["postList[" + that.data.tabIndex + "][" + indexA + "][" + indexB + "].likeCount"]: that.data.postList[that.data.tabIndex][indexA][indexB].likeCount + 1,
            ["postList[" + that.data.tabIndex + "][" + indexA + "][" + indexB + "].likeState"]:1,
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 打开图片
   */
  openImage:function(e){
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    let indexC = e.currentTarget.dataset.indexc;
    let oldUrls = that.data.postList[that.data.tabIndex][indexA][indexB].urls;
    let urls = [];
    oldUrls.forEach(v=>{
      urls.push(that.data.imgUrl+v.url);
    })
    wx.previewImage({
      current: urls[indexC], // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },
  openModule:function(e){
    const that =this;
    let index =  e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/packageA/pages/community/module/page?activeIndex='+index,
    })
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
        res.eventChannel.emit('articleData', that.data.postList[that.data.tabIndex][indexA][indexB]);
        app.common.addUserTaskRecord({ id: that.data.postList[that.data.tabIndex][indexA][indexB].id,type:2,subtype:3});
        app.common.addUserHistory({
          type: 2,
          recordId: that.data.postList[that.data.tabIndex][indexA][indexB].id
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 打开评论框
   */
  openMessage:function(e){
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    that.setData({
      commentData: that.data.postList[that.data.tabIndex][indexA][indexB],
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
   * 发帖
   */
  release:function(){
    const that = this;
    wx.navigateTo({
      url: '/packageA/pages/community/release/page',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.on('reloading', function (data) {
          that.init();
        })
      }
    })
  },
  mutual:function(){

  },
  openPorover:function(e){
    const that = this;
    let touches = e.detail;
    console.log(e);
    touches.type = 1;
    let poroverON = {
       a : e.currentTarget.dataset.a,
       b : e.currentTarget.dataset.b,
       c : e.currentTarget.dataset.c,
    }
    that.setData({
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
        param.targetId = that.data.postList[poroverON.a][poroverON.b][poroverON.c].userId
      }else{
        param.targetId = that.data.postList[poroverON.a][poroverON.b][poroverON.c].id
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
                ["swiperPage[" + that.data.tabIndex + "].refresher"]: true,
              })
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
    }else{
      that.setData({
        poroverON: {},
      })
    }
  },
  openHot:function(e){
    const that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/community/article/page?id='+id,
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let t = this;
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;
    t.setData({
      isIphoneX: isX || isXS,
    });
    let tabIndex = wx.getStorageSync("tabIndex");
    if (tabIndex != undefined && app.globalData.tabTun) {
      t.setData({
        tabIndex: tabIndex,
        current: tabIndex,
      })
      app.globalData.tabTun = false;
    }
    if (typeof t.getTabBar === 'function' &&
      t.getTabBar()) {
      t.getTabBar().setData({
        customTabBarSelected: 1
      })
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
    console.log("触发上拉");
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const that = this;
    let indexA = e.target.dataset.indexa;
    let indexB = e.target.dataset.indexb;
    let obj = that.data.postList[that.data.tabIndex][indexA][indexB];
    app.common.addUserTaskRecord({ type: 2, subtype: 6 })
    return {
      title: obj.title,
      path: 'packageA/pages/community/article/page?id='+obj.id,
      imageUrl: "https://tel.360xkw.com/attachment/xcx_zkb_xf.png",
      success: (res) => {
        
      }
    }
  }
})