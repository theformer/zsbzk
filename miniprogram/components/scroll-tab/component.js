// components/scroll-tab/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollData: {
      type: Object,
      value: {},
      observer: function (data) {
        // console.log(data);
      }
    },
    selectedIndex:{
      type:Number,
      value: 0,
    }
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
    selectedClick:function(e){
      const that =this;
      var selectedIndex = e.currentTarget.dataset.index;
      that.triggerEvent('callbackFunc', { selectedIndex: selectedIndex});
      that.setData({
        selectedIndex: selectedIndex,
      })
    }
  }
})
