// miniprogram/pages/home/course_options/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course:{},
    subCourse:{},
    siv: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    that.eventChannel = that.getOpenerEventChannel();
    that.getCourseLevel();
  },
  /**
   * 得到所有科目列表
   */
  getCourseLevel() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    let obj = {
      url: app.base.getCourseLevel,
      data: {
        courseId: app.base.courseId
      },
      success: (res) => {
        wx.hideLoading();
        if (res.S == 1) {
          let course = wx.getStorageSync('course');
          let subCourse  = wx.getStorageSync('subCourse');
          let courseList = res.V;
          if(!app.empty(course)){
            course = {...courseList[0]};
            delete course.subCourses;
          }
          that.setData({
            course:course,
            subCourse:subCourse,
            courseList: courseList,
            siv: wx.getStorageSync('change_course_id')
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  /**
   *  科目点击事件 
   */
  manuCatchtp(e){
    let that = this;
    let course = {...that.data.courseList[e.currentTarget.dataset.index]}
    wx.setStorageSync('change_course_id', e.currentTarget.id)
    delete course.subCourses;
    that.setData({
      course : course,
      siv : false
    })
  },
  /**
   * 章节点击事件
   */
  subCourseCatchtp(e){
    let that = this;
    let subCourse = {...that.data.courseList[e.currentTarget.dataset.cindex].subCourses[e.currentTarget.dataset.sindex]}
    that.setData({
      subCourse : subCourse,
    })
    wx.setStorageSync('course', that.data.course);
    wx.setStorageSync('subCourse', subCourse);
    if(getCurrentPages().length>1){
      wx.navigateBack({
        complete: (res) => {
          that.eventChannel.emit('updateCourse', {
            course:that.data.course,
            subCourse:subCourse,
          });
        },
      })
    }else{
      wx.switchTab({
        url: '/pages/home/index/page',
      })
    }
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
    wx.hideHomeButton();
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