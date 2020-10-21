// miniprogram/pages/credit_activity/course/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"http://img.360xkw.com/",
    modalShow:!1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that =  this;
    let course = wx.getStorageSync('course');
    
    that.setData({
      course : course,
    })
    that.getCourseList();
  },
  /**
   * 获取兑换课程
   */
  getCourseList(){
    const that = this;
    let userInfo =  wx.getStorageSync(app.base.UserInfor);
    let param = {
      provinceId: wx.getStorageSync('province').id,
      majorIds : that.data.course.id,
    }
    if(userInfo.id != undefined) {
      param.userId = userInfo.id;
    }
    let obj = {
      url: app.base.getCourseList,
      data: param,
      success: (res) => {
        if (res.S == 1) {
          that.setData({
            list : res.V[0].courseList
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   * 立即兑换
   */
  exchange(e){
    let that = this;
    let userInfo = wx.getStorageSync(app.base.UserInfor);
    let curr_item = e.currentTarget.dataset.item;
    if(curr_item.exchangeState){
      wx.navigateTo({
        url: '/pages/member/myCourse/list/page',
      })
    }else{
      that.setData({
        curr_item : curr_item,
        modalShow : !0,
        user_credit_ample : userInfo.credit >=  curr_item.creditPrice,
      })
    }
  },
  /**
   * 关闭弹窗
   */
  closeModal(){
    this.setData({
      modalShow : !1,
    })
  },
  /**
   * 确定兑换
   */
  exchangeCourse(){
    const that = this;
    let userInfo  = wx.getStorageSync(app.base.UserInfor);
    that.setData({
      modalShow:!1,
    })
    if(!that.data.user_credit_ample){
      wx.navigateTo({
        url: '/pages/member/singin/page',
      })
      return;
    }
    let obj = {
      url: app.base.exchangeCourse,
      data: {
        provinceId: wx.getStorageSync('province').id,
        id: userInfo.id,
        itemsId : that.data.curr_item.itemsId,
        majorId: that.data.course.id,
      },
      success: (res) => {
        if (res.S == 1) {
          userInfo.credit =  userInfo.credit - that.data.curr_item.creditPrice;
          wx.setStorageSync(app.base.UserInfor, userInfo);
          that.getCourseList();
          wx.navigateTo({
            url: '/pages/member/myCourse/list/page',
          })
        }else{
          that.setData({
            modalShow:!0,
            user_credit_ample:false,
          })
        }
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
  to_singin(){
    wx.navigateTo({
      url: '/pages/member/singin/page',
    })
  },
  /**
   * 专业切换
   */
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
          that.getCourseList();
        }
      },
      success: function(res) {
        
      },
    })
  },
  to_wechat(e){
    wx.navigateTo({
      url: '/packageA/pages/wechat/page?type='+e.currentTarget.dataset.type,
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})