// components/fullscreen-video/component.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    video:{
      type: Object,
      value: {},
      observer: function (res) {
        // console.log(res);
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    fullscreen:false,
    imgUrl:app.base.imgUrl,
  },
  lifetimes: {
    attached() {
      this.videoContext = wx.createVideoContext('videoId',this);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    videoPlay(event){
      
    },
    videofullscreenchange(event){
      let that = this;
      that.setData({
        fullscreen : event.detail.fullscreen
      })
      if(event.detail.fullscreen){
        that.videoContext.play()
      }else{
        that.videoContext.pause();
      }
    },
    fullscreen_play(event){
      let that = this;
      that.videoContext.requestFullScreen();
    },
  }
})
