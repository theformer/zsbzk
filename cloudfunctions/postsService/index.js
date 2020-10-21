// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  console.log("event", event)
  switch (event.action) {
    case 'addShareQRCode': {
      return await addShareQrCode(event);
    }
    default: break
  }
}
/**
 * 新增文章二维码
 * @param {} event 
 */
async function addShareQrCode(event) {
  console.log("event", event)
  let result = await cloud.openapi.wxacode.getUnlimited({
    scene: event.scene,
    page: event.page,
  })

  if (result.errCode === 0) {
    let upload = await cloud.uploadFile({
      cloudPath: event.timestamp + '.png',
      fileContent: result.buffer,
    })

    await db.collection("share_QRCode").add({
      data: {
        path: event.page + "?" + event.scene,
        timestamp : event.timestamp,
        qrCode: upload.fileID
      }
    });

    let fileList = [upload.fileID]
    let resultUrl = await cloud.getTempFileURL({
      fileList,
    })
    return resultUrl.fileList
  }

  return result;

}
