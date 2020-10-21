// components/chatting/component.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentData: {
      type: Object,
      value: {},
      observer: function (data,old) {
        if(data != undefined){
          let userInfor = wx.getStorageSync(app.base.UserInfor);
          if (app.empty(userInfor)){
            this.setData({
              userInfor: userInfor,
              userLogin:true,
            })
          }
          if (data.id != (old ? old.id: 0)){
            this.data.pageSize = 20;
            this.data.pageIndex = 1;
            this.getCommentList();
          }
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    photoUrl: "/static/images/icon/photo.png",
    pageSize:20,
    pageIndex:1,
    type:2,
    commentList:[],
    inputLoading:false,
    userLogin :  false,
    device: app.globalData.device,
    commentReplyShow: false,
    comment_replys_pid:0,
    device: app.globalData.device
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取评论列表
     */
    getCommentList:function(){
      const that = this;
      let  userInfor = wx.getStorageSync(app.base.UserInfor),
      param = {
        type: that.data.type,
        targetId: that.data.commentData.id,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
      };
      wx.showLoading({
        title: '加载中',
      })
      if(app.empty(userInfor)){
        param.userId = userInfor.id
      }
      let obj = {
        url: app.base.getCommentList,
        data: param ,
        success: (res) => {
          wx.hideLoading({
            success: (res) => {},
          })
          if (res.S == 1) {
            that.setData({
              commentList: res.V.commentList,
              commentTotal:res.V.commentTotal,
              pageIndex : that.data.pageIndex + 1
            })
            if (that.data.comment_replys_Index!=undefined){
              that.setData({
                commentParent:res.V[that.data.comment_replys_Index],
              })
            }
          }else{
            that.setData({
              commentList: [],
            })
          }
        }
      }
      app.request.wxRequest(obj);
    },
    /**
     * 加载更多评论列表
     */
    pushCommentList:function(){
      const that = this;
      that.setData({
        loading : true,
      })
      let userInfor = wx.getStorageSync(app.base.UserInfor),
        param = {
          type: that.data.type,
          targetId: that.data.commentData.id,
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
              pageIndex: that.data.pageIndex+1,
            })
          }
          that.setData({
            loading: false,
          })
        }
      }
      app.request.wxRequest(obj);
    },
    close:function(){
      const that =this;
      that.triggerEvent('close_comment', {});
    },
    /**
     * 评论框事件
     */
    inputFocus: function (e) {

      this.setData({
        inputLoading: true,
      })
    },
    inputBlur: function (e) {
      this.setData({
        inputLoading: false,
      })
    },
    
    /**
     * 发表评论
     */
    commentSubmit:function(e){
      let  that =this;
      let comment_content = e.detail.value.comment_content;
      if (!app.empty(comment_content)){
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
          userId:wx.getStorageSync(app.base.UserInfor).id,
          targetId: that.data.commentData.id,
          pid: that.data.comment_replys_pid,
          content: comment_content,
        },
        success: (res) => {
          if (res.S == 1) {
            if (that.data.commentReplyShow){
              that.getCommentById();
            }else{
              that.setData({
                pageIndex : 1
              })
              that.getCommentList();
            }
            wx.showToast({
              title: '评论成功',
              icon: 'none',
              duration: 2000,
            })
            that.setData({
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
     * 帖子点赞
     */
    addLike:function(){
      const that = this;

      let obj = {
        url: app.base.addLikeCount,
        data: {
          id: that.data.commentData.id,
          userId: wx.getStorageSync(app.base.UserInfor).id,
          type: that.data.type,
        },
        success: (res) => {
          if (res.S == 1) {
            that.setData({
              ["commentData.likeState"] : res.V,
            })
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000,
            })
          } else {
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
     * 评论点赞
     * targetId:文章、课程ID
     * type:类型：1-资讯，2-社区，3-课程
     * id:评论ID
     */
    addCommentLikeCount: function (e) {
      const that = this;
      const userInfor = wx.getStorageSync(app.base.UserInfor);
      let index = e.currentTarget.dataset.index;
      let obj = {
        url: app.base.addCommentLikeCount,
        data: {
          userId: userInfor.id,
          targetId: that.data.commentData.id,
          type: that.data.type,
          id: that.data.commentList[index].id,
        },
        success: (res) => {
          that.setData({
            ["commentList[" + index + "].likeState"]: res.V,
            ["commentList[" + index + "].likeCount"]: that.data.commentList[index].likeCount + res.V,
          })
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      }
      app.request.wxRequest(obj);
    },

    /**打开二级评论 */
    openCommentReplys: function (e) {
      const that = this;
      let index = e.currentTarget.dataset.index;
      let commentParent = that.data.commentList[index];
      that.setData({
        commentReplyUser: commentParent.nickName,
        comment_replys_pid: commentParent.id,
        commentParent: commentParent,
      })
      that.getCommentById();
    },

    closeCommentReplys: function (e) {
      this.setData({
        commentReplyShow: false,
        comment_replys_pid: 0,
        commentReplyUser: '',
        commentParent: false,
        commentReplysList: [],
      })
    },

    /** 二级评论回复 */
    replysComment: function (e) {
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
    getCommentById: function () {
      const that = this;
      if (!app.empty(that.data.commentParent)) {
        return;
      }
      let userInfor = wx.getStorageSync(app.base.UserInfor),
        param = {
          type: that.data.type,
          targetId: that.data.commentData.id,
          id: that.data.commentParent.id,
        };
      if (app.empty(userInfor)) {
        param.userId = userInfor.id;
      }
      that.setData({
        userInfor : userInfor,
      })
      let obj = {
        url: app.base.getCommentById,
        data: param,
        success: (res) => {
          if (res.S == 1) {
            that.sortCommentReplys(res.V.commentReplys);
            that.setData({
              commentReplyShow: true,
            })
          }
        },
        fail: (res) => { },
        complete: (res) => { }
      }
      app.request.wxRequest(obj);
    },
    /**
     * 检查是否登录
     */
    checkLogin:function(){
      const that = this;
      let userInfor = wx.getStorageSync(app.base.UserInfor);
      if (app.empty(userInfor)){
        that.setData({
          userInfor: userInfor,
          userLogin:true,
        })
      }
    },
    openPorover: function (e) {
      const that = this;
      let touches = e.detail;
      touches.type = 2;
      let poroverON = {
        a: e.currentTarget.dataset.a,
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
          type: 2,
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
    deleteComment: function (e) {
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
          type: 2,
          pid: data.pid,
          targetId: that.data.commentData.id,
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
              that.data.commentList.splice(a,1);
              that.setData({
                ['commentList']: that.data.commentList,
              })
            }
          }
        }
      }
      app.request.wxRequest(obj);
    },
    /*** 二级评论点赞  */
    addReplysCommentLikeCount: function (e) {
      const that = this;
      const userInfor = wx.getStorageSync(app.base.UserInfor);
      let index = e.currentTarget.dataset.index;
      let obj = {
        url: app.base.addCommentLikeCount,
        data: {
          userId: userInfor.id,
          targetId: that.data.commentData.id,
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
    sortCommentReplys: function (data) {
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
      }else{
        that.setData({
          commentReplysList: [],
        })
      }
    },
    /**
         * 按照日期排序
         */
    sortDate: function (key) {
      return function (a, b) { // sort 默认接受a,b两个参数表示数组中的值
        let x = a[key],
          y = b[key];
        return x > y ? x < y ? 0 : 1 : -1;
      }
    },
  }
})
