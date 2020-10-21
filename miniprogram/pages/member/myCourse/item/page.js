const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    to_video: function (e) {
        var subcourseId = e.currentTarget.dataset.subcourseid;
        var materiaProper = e.currentTarget.dataset.materiaproper;
        wx.navigateTo({
            url: `/pages/member/myCourse/video/page?itemsId=${this.data.item.itemsId}&subCourseId=${subcourseId}&materiaProper=${materiaProper}&itemsName=${this.data.item.itemsName}`
        });
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let that = this;
      that.eventChannel = that.getOpenerEventChannel();
      that.eventChannel.on('courseDataFromOpenerPage', function (res) {
        console.log('acceptDataFromOpenerPage',res)
        that.setData({
          item : res.item,
          courses: res.item.courses,
        })
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    initData: function () {

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