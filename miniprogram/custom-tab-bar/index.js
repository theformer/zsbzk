/**
 * 自定义底部tabbar
 */

Component({
  data: {
    customTabBarSelected: 0,
    redCount: { 'index': 0, 'question_bank': 0, 'my': 0 },
    onHide:false
  },
  ready() {
    let model = wx.getSystemInfoSync().model;
    let isX = model.indexOf('iPhone X') > -1;
    let isXS = model.indexOf('iPhone XS') > -1;

    this.setData({
      isIphoneX: isX || isXS,
    });
  },
  methods: {
    bindToggle(e) {
      let that = this;
      let type = parseInt(e.currentTarget.dataset.type);
      let index = type;
      let classfiy = [
        {
          url: "/pages/home/index/page",
        },
        {
          url:"/pages/credit_activity/assist/page",
        },
        {
          url: "/pages/member/index/page"
        }
      ][index];
      wx.switchTab(classfiy);
    },


    /**
     * 设置小红点
     */
    __setRedcount(opts) {
      let redCount = this.data.redCount;
      redCount[opts.name] = opts.count || 0;
      this.setData({
        redCount
      });
    }

  }
});
