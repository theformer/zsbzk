// miniprogram/pages/question/subjectSubmit/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = that.getOpenerEventChannel()
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(res) {
      that.setData({
        paperReport:res.paperReport,
        CustomBar:res.CustomBar,
      })
      that.init();
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
      }
    })
  },
  /**
   * 数据初始化
   */
  init(){
    let that = this;
    let paperReport = that.data.paperReport;
    let accuracy = (paperReport.answerCorrectNum / paperReport.didQuestionIds * 100).toFixed(0);
    let submitTime  = that.countDown(0, paperReport.usedTime);
    let commentary='';
    if (accuracy >= 90) {
      commentary = "你真的太棒了！嘤嘤嘤";
    } else if (accuracy >= 60 && accuracy < 90) {
      commentary = "一般一般世界第三";
    } else if (accuracy < 60) {
      commentary = "您好我是渣渣辉,成绩太差快去刷题吧！";
    }
    that.setData({
      accuracy:accuracy,
      submitTime:submitTime,
      commentary:commentary,
    })
  },
  countDown(start, end) {
    if (end <= start) {
      return '00:00:00'
    }
    let h = Math.floor((end - start) / 3600)
    if (h < 10) {
      h = '0' + h
    }
    let m = Math.floor(((end - start) % 3600) / 60)
    if (m < 10) {
      m = '0' + m
    }
    let s = Math.floor((end - start) % 60)
    if (s < 10) {
      s = '0' + s
    }
    if (Number(h) < 24) {
      return `${h}:${m}:${s}`
    }
  },
  pageBack(){
    let that = this;
    wx.navigateBack({
      delta: 2,
    })
  },
  restart(){
    let that = this;
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.emit('restart', {});
    wx.navigateBack();
  },
  look_answer(){
    let that = this;
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.emit('look_answer', {});
    wx.navigateBack();
  },
  to_wechat(){
    wx.navigateTo({
      url: '/packageA/pages/wechat/page',
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
    return {
      title: "课程视频免费学",
      path: 'pages/home/index/page',
      imageUrl: "/static/images/share/item-share.png",
    }
  }
})