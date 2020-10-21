// components/popoverTab/popoverTab.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    touches: {
      type: Object,
      value: {},
      observer: function (data) {
        let markList = wx.getStorageSync('markList');
        let newList = [];
        markList.map(item=>{
          wx.getSystemInfo({
            success: (res) => {
              this.setData({
                windowHeight: res.windowHeight,
              })
            }
          })
          if (data.type == 1){
            if (item.name != "不想看此评论" && item.id != 14) {
              newList.push(item);
            }
          } else if (data.type == 2){
            if (item.name != "拉黑作者" && item.name != "屏蔽此贴" && item.id != 11 && item.id != 13) {
              newList.push(item);
            }
          }
        })
        this.setData({
          markList: newList,
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close: function () {
      const that = this;
      that.triggerEvent('callback', {});
    },
    feedback:function(e){
      const that = this;
      let result = that.data.markList[e.currentTarget.dataset.index];
      that.triggerEvent('callback', { result : result});
    },
  }
})
