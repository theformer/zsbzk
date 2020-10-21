var base = require('../conf.js');
var request = require('../request.js');

var common = {};

/**
 * 添加用户分享、浏览任务记录
 * subtype： 3-浏览帖子，4-浏览资讯，6-分享帖子，7-分享资讯，8-分享视频
 */
common.addUserTaskRecord = function({ id=0,type = 2, subtype = 3 }) {
  const userInfor = wx.getStorageSync(base.UserInfor);
  if (userInfor === undefined || userInfor === "") {
    return;
  }
  let param = {
    userId: userInfor.id,
    type: type,
    subtype: subtype
  }
  if (id){
    param.id=id;
  }
  let obj = {
    url: base.addUserTaskRecord,
    data: param,
    success: (res) => {
      
    }
  }
  request.wxRequest(obj);
}
/**
 * 添加分享计数
 * @param {
 *  type: 1: 资讯:2:帖子
 *  id:资讯帖子id
 * } param 
 * 
 */
common.addShareCount = function({ id=0,type = 2 }) {
  let param = {
    id: id,
    type: type,
  }
  let obj = {
    url: base.addShareCount,
    data: param,
    success: (res) => {
      console.log(res);
    }
  }
  request.wxRequest(obj);
}

/**
 * 添加用户浏览记录
 * type：类型：1-资讯，2-社区，3-课程
 * recordId：帖子ID（type为课程时，传入获取课程的id，而不是itemsId）
 */
common.addUserHistory = function({  type = 1,  recordId = 0 }) {
  const userInfor = wx.getStorageSync(base.UserInfor);
  if (userInfor === undefined || userInfor === "") {
    return;
  }
  let obj = {
    url: base.addUserHistory,
    data: {
      userId: userInfor.id,
      type: type,
      recordId: recordId
    },
    success: (res) => {

    }
  }
  request.wxRequest(obj);
}

common.addCommentLikeCount = function ({ targetId = 0, type = 1, id = 1 }) {
  const userInfor = wx.getStorageSync(base.UserInfor);
  if (userInfor === undefined || userInfor === "") {
    return;
  }
  let obj = {
    url: base.addCommentLikeCount,
    data: {
      userId: userInfor.id,
      targetId: targetId,
      type: type,
      id:id,
    },
    success: (res) => {

    }
  }
  request.wxRequest(obj);
}
/**
 * 添加用户观看视频、做题任务记录
 * @param {
 *  type: 每天
 *  subtype 详细类型： 9-观看学习视频，10-做题
 *  count 观看视频时长（分钟）或做题数量
 * } param
 */
common.addUserCountTaskRecord = function({type = 2 ,subtype = 9,count = 0,}){
  const userInfor = wx.getStorageSync(base.UserInfor);
  if (userInfor === undefined || userInfor === "") {
    return;
  }
  let obj = {
    url: base.addUserCountTaskRecord,
    data: {
      userId: userInfor.id,
      subtype: subtype,
      type: type,
      count:count,
    },
    success: (res) => {
      console.log(res);
    }
  }
  request.wxRequest(obj);
}


module.exports = common;