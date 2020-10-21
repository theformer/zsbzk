const db = wx.cloud.database()
const _ = db.command
const cloudApi = {
  /**
   * 上传文件
   */
  uploadFile(cloudPath, filePath) {

  },
  /**
   * 根据砍价id获取小程序QRCode
   * @param {*} page 
   */
  getBargainQRCodeById(id) {
    return db.collection('crgk_bargain')
      .where({
        bargainId: id
      })
      .get()
  },
  /**
   * 新增砍价二维码并返回临时url
   * @param {*} id 
   * @param {*} comments 
   */
  addBargainQrCode(id, timestamp) {
    return wx.cloud.callFunction({
      name: 'postsService',
      data: {
        action: "addBargainQrCode",
        timestamp: timestamp,
        bargainId: id
      }
    })
  },
  /**
 * 获取海报的二维码url
 * @param {*} id 
 */
  getReportQrCodeUrl(id) {
    return wx.cloud.getTempFileURL({
      fileList: [{
        fileID: id,
        maxAge: 60 * 60, // one hour
      }]
    })
  }
};

module.exports = cloudApi;