// pages/home/article/page.js
const app = getApp();
var scrollTop = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentShow: false,
    inputLoading: false,
    commentReplyShow: false,
    photoUrl: '/static/images/icon/photo.png',
    imgUrl: app.base.imgUrl,
    dialogShow: false,
    commentReplyShow: false, //二级回复窗口
    comment_replys_pid: 0, //评论id
    device: app.globalData.device,
    userLogin: false,
    videoPlay:false,
    type: 1,
    noData: false,
    pageSize: 10,
    pageIndex: 1,
    CustomBar:app.globalData.CustomBar,
    currentTime:0,
    duration:0,
    pageIndexMy: !1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    if (options.id != undefined) {
      that.setData({
        id: options.id,
      })
      that.getArticle();
    } 
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      this.setData({
        userInfor: userInfor,
        userLogin: true,
      })
    }
    let pages = getCurrentPages();
    if (pages.length == 1) {
      that.setData({
        pageIndexMy: !0
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**获取帖子详情 */
  getArticle: function() {
    const that = this;
    let userInfo  = wx.getStorageSync(app.base.UserInfor);
    that.setData({
      loadModal:!0,
    })
    let param = {
      id: that.data.id ? that.data.id : that.data.article.id,
      channelName:1,
      
    }
    if(userInfo.id != undefined) {
      param.userId = userInfo.id;
    }
    let obj = {
      url: app.base.getNewsById,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          app.wxparse.wxParse('articleHtml', 'html', res.V.content, that, 5);
          that.setData({
            article: res.V
          })
          if(res.V.state===2){
            that.setData({
              videoPlay: true
            })
          }
          app.common.addUserHistory({ type: 1, recordId: res.V.id })
          app.common.addUserTaskRecord({id:res.V.id,type:2,subtype:4});
          that.getCommentList();
        } else {
          that.setData({
            noData: true,
          })
        }
        that.setData({
          loadModal:!1,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  copyWeixin(){
    let that = this;
    that.addStuInfoXKW();
    if(that.data.article.officialUrl.length>0){
      wx.navigateTo({
        url: '/pages/wechat/page?url='+that.data.article.officialUrl,
      })
    }else{
      wx.setClipboardData({
        data: that.data.article.wechat,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) // data
            }
          })
        }
      });
    }
    
  },
  /**
   * 分配信息海
   */
  addStuInfoXKW(){
    const that = this;
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if(!app.empty(userInfor) ) {
      return ;
    }
    let obj = {
      url: app.base.addStuInfoXKW,
      data: {
        sUserId:userInfor.id,
        wechat:that.data.article.wechat
      },
      success: (res) => {
      }
    }
    app.request.wxRequest(obj);
  },
  /**获取一级帖子评论 */
  getCommentList: function() {
    const that = this;
    let userInfor = wx.getStorageSync(app.base.UserInfor),
      param = {
        type: that.data.type,
        targetId: that.data.id ? that.data.id : that.data.article.id,
        pageIndex: 1,
        pageSize: that.data.pageSize,
      };
    if (app.empty(userInfor)) {
      param.userId = userInfor.id
    }
    let obj = {
      url: app.base.getCommentList,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          let data = res.V;
          that.setData({
            pageIndex: 2,
            commentList: data.commentList
          })
        } else {
          that.setData({
            commentList: []
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 加载更多评论列表
   */
  pushCommentList: function() {
    const that = this;
    that.setData({
      loading: true,
    })
    let userInfor = wx.getStorageSync(app.base.UserInfor),
      param = {
        type: that.data.type,
        targetId: that.data.id ? that.data.id : that.data.article.id,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
      };
    if (app.empty(userInfor)) {
      param.userId = userInfor.id
    }
    let obj = {
      url: app.base.getCommentList,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ['commentList']: that.data.commentList.concat(res.V.commentList),
            pageIndex: that.data.pageIndex + 1,
          })
        }
        that.setData({
          loading: false,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  pageBack:function () {
    let pages = getCurrentPages();
    if(pages.length == 1){
      wx.switchTab({
        url:"/pages/home/index/page",
      });
    }else{
      wx.navigateBack({
        delta: 0,
      })
    }
  },
  /**打开关闭一级评论 */
  changeComment: function () {
    let that  = this;
    if(that.data.article.state==2){
      this.setData({
        commentShow: !this.data.commentShow,
        dialogShow: !this.data.dialogShow,
      })
      return;
    }
    if(that.data.scrollChange){
      that.setData({
        scrollChange:!that.data.scrollChange,
        scrollTopId:"userComment",
      })
    }else{
      that.setData({
        scrollChange:!that.data.scrollChange,
        scrollTop:scrollTop,
      })
    }
    
  },
  /**
   * 发表评论
   */
  commentSubmit: function(e) {
    let that = this;
    let comment_content = e.detail.value.comment_content;
    if (!app.empty(comment_content)) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000,
      })
      return false;
    }
    let obj = {
      url: app.base.addComment,
      data: {
        type: that.data.type,
        userId: wx.getStorageSync(app.base.UserInfor).id,
        targetId: that.data.id ? that.data.id : that.data.article.id,
        pid: that.data.comment_replys_pid,
        content: comment_content,
      },
      success: (res) => {
        if (res.S == 1) {
          wx.showToast({
            title: '评论成功',
            icon: 'none',
            duration: 2000,
          })
          if (that.data.commentReplyShow){
            that.getCommentById();
          }else{
            that.getCommentList();
          }
          that.setData({
            "article.commentCount": that.data.article.commentCount + 1,
            comment_content: '',
          })
        } else if (res.S == -1) {
          wx.showToast({
            title: '内容非法，请更正!',
            icon: 'none',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '评论失败',
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: (res) => {

      },
      complete: (res) => {
        that.setData({
          showLoading: false,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 播放时加载
   * @param {*} e 
   */
  loadVideo(e){
    let that =this;
    // that.myVideo = wx.createVideoContext('videoId');
    // that.myVideo.requestFullScreen();
  },
  videoEnded(e){
    this.setData({
      videoPlayend : true,
    })
  },
  videotimeupdate(e){
    this.setData({
      duration : e.detail.duration,
      currentTime :  e.detail.currentTime,
    })
  },
  videoError(e){
    console.log(e);
  },
  to_wechat(e){
    wx.navigateTo({
      url: '/packageA/pages/wechat/page?type='+ e.currentTarget.dataset.type,
    })
  },
  /**
   * 评论框事件
   */
  inputFocus: function(e) {
    this.setData({
      inputLoading: true,
    })
  },
  inputBlur: function(e) {
    this.setData({
      inputLoading: false,
    })
  },
  /*** 帖子资讯点赞  */
  addLike: function(e) {
    const that = this;
    let indexA = e.currentTarget.dataset.indexa;
    let indexB = e.currentTarget.dataset.indexb;
    let obj = {
      url: app.base.addLikeCount,
      data: {
        type: that.data.type,
        userId: wx.getStorageSync(app.base.UserInfor).id,
        id: that.data.id ? that.data.id : that.data.article.id,
      },
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            ["article.likeCount"]:that.data.article.likeCount + res.V,
            ["article.likeState"]:res.V,
          })
        } 
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 3000,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 一级评论点赞
   * targetId:文章、课程ID
   * type:类型：1-资讯，2-社区，3-课程
   * id:评论ID
   */
  addCommentLikeCount: function(e) {
    const that = this;
    const userInfor = wx.getStorageSync(app.base.UserInfor);
    let index = e.currentTarget.dataset.index;
    let obj = {
      url: app.base.addCommentLikeCount,
      data: {
        userId: userInfor.id,
        targetId: that.data.article.id,
        type: that.data.type,
        id: that.data.commentList[index].id,
      },
      success: (res) => {
        that.setData({
          ["commentList[" + index + "].likeState"]: res.V,
          ["commentList[" + index + "].likeCount"]: that.data.commentList[index].likeCount + res.V,
        })
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 3000,
        })
      }
    }
    app.request.wxRequest(obj);
  },


  /**打开二级评论 */
  openCommentReplys: function(e) {
    const that = this;
    let index = e.currentTarget.dataset.index;
    let commentParent = that.data.commentList[index];
    that.setData({
      commentReplyUser: commentParent.nickName,
      comment_replys_pid: commentParent.id,
      commentReplyShow: true,
      commentParent: commentParent,
    })
    that.getCommentById();
  },
  closeCommentReplys: function(e) {
    this.setData({
      commentReplyShow: false,
      comment_replys_pid: 0,
      commentReplyUser: '',
      commentParent: false,
      commentReplysList: [],
    })
  },
  /*** 二级评论点赞  */
  addReplysCommentLikeCount: function(e) {
    const that = this;
    const userInfor = wx.getStorageSync(app.base.UserInfor);
    let index = e.currentTarget.dataset.index;
    let obj = {
      url: app.base.addCommentLikeCount,
      data: {
        userId: userInfor.id,
        targetId: that.data.article.id,
        type: that.data.type,
        id: that.data.commentReplysList[index].id,
      },
      success: (res) => {
        that.setData({
          ["commentReplysList[" + index + "].likeState"]: res.V,
          ["commentReplysList[" + index + "].likeCount"]: that.data.commentReplysList[index].likeCount + res.V,
        })
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  /** 二级评论回复 */
  replysComment: function(e) {
    const that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      commentReplyUser: that.data.commentReplysList[index].nickName,
      comment_replys_pid: that.data.commentReplysList[index].id,
    })
  },
  /**
   * 获取二级评论列表
   */
  getCommentById: function() {
    const that = this;
    if (!app.empty(that.data.commentParent)) {
      return;
    }
    let userInfor = wx.getStorageSync(app.base.UserInfor),
      param = {
        type: that.data.type,
        targetId: that.data.id ? that.data.id : that.data.article.id,
        id: that.data.commentParent.id,
      };
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.getCommentById,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.sortCommentReplys(res.V.commentReplys);
        }
      },
      fail: (res) => {},
      complete: (res) => {}
    }
    app.request.wxRequest(obj);
  },



  openPorover: function(e) {
    const that = this;
    let touches = e.detail;
    console.log(e);
    touches.type = 2;
    let poroverON = {
      a: e.currentTarget.dataset.a,
    }
    that.setData({
      touches: touches,
      poroverON: poroverON,
    })
  },
  popover_callback: function(e) {
    const that = this;
    let mark = e.detail.result;
    if (mark != undefined) {
      let param = {
        type: 3,
        markId: mark.id
      };
      let poroverON = that.data.poroverON;
      if (that.data.commentReplyShow) {
        param.targetId = that.data.commentReplysList[poroverON.a].id
      } else {
        param.targetId = that.data.commentList[poroverON.a].id
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
            if (mark.name == "不想看此评论" && mark.id == 14) {
              if (that.data.commentReplyShow) {
                that.getCommentById()
              } else {
                that.data.commentList.splice(poroverON.a, 1);
                that.setData({
                  ['commentList']: that.data.commentList,
                })
              }
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
        poroverON: {}
      })
    }
  },
  deleteComment: function(e) {
    const that = this;
    let a = e.currentTarget.dataset.a;
    let data = {}
    if (that.data.commentReplyShow) {
      data = that.data.commentReplysList[a];
    } else {
      data = that.data.commentList[a];
    }
    let obj = {
      url: app.base.deleteComment,
      data: {
        id: data.id,
        type: 1,
        pid: data.pid,
        targetId: that.data.article.id,
      },
      success: (res) => {
        if (res.S == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000,
          })
          if (that.data.commentReplyShow) {
            that.getCommentById()
          } else {
            that.data.commentList.splice(a, 1);
            that.setData({
              ['commentList']: that.data.commentList,
            })
          }
        }
      }
    }
    app.request.wxRequest(obj);
  },

  /**
   * 监听列表滚动事件
   */
  scrollEventh :function(e){
    // if(that.data.scrollChange){
    //   scrollTop = e.detail.scrollTop;
    // }
  },


  /**
   * 检查是否登录
   */
  checkLogin: function() {
    const that = this;
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      that.setData({
        userInfor: userInfor,
        userLogin: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  sortCommentReplys: function(data) {
    const that = this;
    if (data.length > 0) {
      let list = [];
      data.forEach((v, index, arr) => {
        if (v.commentReplys.length > 0) {
          v.commentReplys.forEach(item => {
            item.pName = v.nickName;
            list.push(item);
          })
        }
        list.push(v);
      })
      list.sort(that.sortDate('createTime'))
      that.setData({
        commentReplysList: list,
      })
    } else {
      that.setData({
        commentReplysList: [],
      })
    }
  },
  /**
   * 按照日期排序
   */
  sortDate: function(key) {
    return function(a, b) { // sort 默认接受a,b两个参数表示数组中的值
      let x = a[key],
        y = b[key];
      return x > y ? x < y ? 0 : 1 : -1;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    app.common.addUserTaskRecord({id: that.data.article.id , subtype: 7 })
    app.common.addShareCount({id:that.data.article.id});
    return {
      title: that.data.article.title,
      path: "/pages/home/article/page?id=" + that.data.article.id,
      // imageUrl: "https://tel.360xkw.com/attachment/xcx_zkb_xf.png",
      success: function(a) {

      },
      fail: function(a) {}
    };
  },
  screenArticle:function(){
    let that = this;
    let param = {
      type: 5,
      markId: 13,
      targetId :that.data.article.id,
    };
    let userInfor = wx.getStorageSync(app.base.UserInfor);
    if (app.empty(userInfor)) {
      param.userId = userInfor.id;
    }
    let obj = {
      url: app.base.addUserMark,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          })
          app.globalData.communityRefresh = !0;
        }
      }
    }
    app.request.wxRequest(obj);
  }
})