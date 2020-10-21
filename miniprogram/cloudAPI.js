const db = wx.cloud.database()
const _ = db.command
const cloudAPI = {
  /**
   * 上传文件
   */
  uploadFile(cloudPath, filePath) {

  },
  /**
   * 根据砍价id获取小程序QRCode
   * @param {*} page 
   */
  async getShareQRCodeByPath(path) {
    return db.collection('share_QRCode')
      .where({
        path : path
      })
      .get()
  },
  /**
   * 新增砍价二维码并返回临时url
   * @param {*} id 
   * @param {*} comments 
   */
  async addShareQRCode(path, timestamp) {
    var data = path.split("?");
    return wx.cloud.callFunction({
      name: 'postsService',
      data: {
        action: "addShareQRCode",
        timestamp: timestamp,
        page : data[0],
        scene : data[1],
      }
    })
  },
  /**
 * 获取海报的二维码url
 * @param {*} id 
 */
  async getReportQrCodeUrl(id) {
    return wx.cloud.getTempFileURL({
      fileList: [{
        fileID: id,
        maxAge: 60 * 60, // one hour
      }]
    })
  }
};

module.exports = cloudAPI;