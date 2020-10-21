const request = require('request.js')
const base = require('conf.js');
const sysConfig = {}

sysConfig.getMarkList = function(){
  let obj = {
    url: base.getMarkList,
    data: {},
    success: (res) => {
      if (res.S == 1) {
        wx.setStorageSync('markList', res.V);
      }
    }
  }
  request.wxRequest(obj);
}

module.exports = sysConfig;