// miniprogram/pages/home/province/page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLetter: "",
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    province_name: "广东省",
    searchLetter :["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.eventChannel = that.getOpenerEventChannel();
    that.eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log('acceptDataFromOpenerPage',data)
      that.setData({
        province: data.province,
      })
    })
    that._init();
  },
  _init(){
    let that = this;
    let searchLetter = that.data.searchLetter;
    let cityList = wx.getStorageSync('provinceList'); 
    let hotProvince = wx.getStorageSync('hotProvince');
    let sysInfo = wx.getSystemInfoSync();
    let winHeight = sysInfo.windowHeight;
    let itemH = winHeight / searchLetter.length;
    let tempObj = [];
    for (let i = 0; i < searchLetter.length; i++) {
      let temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      search: tempObj,
      hotProvince:hotProvince,
      cityList: cityList,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  clickLetter: function (e) {
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    let that = this;
    let province = e.currentTarget.dataset.province;
    wx.navigateBack({
      success:function(res){
        that.eventChannel.emit('eventCallback', province);
      }
    })
  },
  //选择热门城市
  bindHotCity: function (e) {
    console.log("bindHotCity")
    this.setData({
      province_name: e.currentTarget.dataset.province_name
    })
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  getInfoCity:function(){
    this.triggerEvent('getInfoCity', {

    })
    console.log('getInfoCity','start');
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