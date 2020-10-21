var Base = require('conf.js')
var utils = require('utils/util.js');
var request = new Object();
var loginNum = 0; //限制登录请求次数
var isSuccess = true;



/**
 * 处理返回转态，返回实体信息
 */
request.wxRequest = function(obj) {
  var header = request.getHeader();
  if (request.getRequestCallback != undefined) {
    request.getRequestCallback(true);
  }
  wx.request({
    url: Base.url + obj.url,
    data: obj.data,
    header: header,
    success: function(res) {
      if (wx.getStorageSync("consolelog")) {
        console.log("request.wxRequest" + obj.url)
        console.log(res)
      }

      if (res.statusCode == 200) {
        //判断obj.success是不是函数类型同时将一个参数传入名为obj.success的函数下
        if (res.data.S == 1001) {
          request.login();
        }
        typeof(obj.success) == 'function' && obj.success(res.data);
      } else {
        wx.showToast({
          title: '请求异常，请检查网络后重试！',
        })
      }
    },
    fail: function(res) {
      utils.ShowToast("网络异常，请链接网络~")
      typeof(obj.fail) == 'function' && obj.fail(res.data);
    },
    complete: function(res) {
      if (request.getRequestCallback != undefined) {
        request.getRequestCallback(false)
      }
      typeof(obj.complete) == 'function' && obj.complete(res.data);
    }
  })
}

request.wxPromise = function(obj){
  var header = request.getHeader();
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${Base.url}${obj.url}`,
      method: 'POST',
      data: obj.data,
      header: header,
      success: function (res) {
        if (res.statusCode != 200) {
          reject({ error: '服务器忙，请稍后重试', code: 500 });
          return;
        }
        resolve(res.data);
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
      },
      complete: function (res) {
        // complete
      }
    })
  })
}

/**
 * 用户登录接口解密信息返回
 */
request.login = function() {
  var header = request.getHeader();
  wx.login({
    success: function(res) {
      console.log(res,'我是调用微信login接口后的')
      if (res.code) {
        var code = res.code
        wx.request({
          url: Base.url + Base.getUserforLogin,
          data: {
            code: res.code
          },
          header: header,
          success: function(res) {
            /**
             * 返回状态码：
              |0       |此时code为空 |
              |1       |此时没有获取到用户信息，但是拿到了用户 微信 openid  sessionKey   unionID |
              |1000    |此时返回用户信息 |
              |1002    |此时获取了用户微信 openid  sessionKey，但是没有获取unionID |
              |1003    |此时code值失效 |
              |2000    |此时获取用户微信  openid  sessionKey  失败 |
             */
            if (res.statusCode == 200) {
              if (res.data.V.sessionId != undefined ) {
                wx.setStorageSync(Base.UserInforSesstion, res.data.V.sessionId);
              }else{
                if (res.header["Set-Cookie"] != undefined && res.header["Set-Cookie"].length > 0) {
                  let Sesstion = res.header["Set-Cookie"].match(/=(\S*);/)[1];
                  wx.setStorageSync(Base.UserInforSesstion, Sesstion);
                }
              }
              if (res.data.S == 1000) {
                if (res.data.V != undefined) {
                  //返回用户信息
                  wx.setStorageSync(Base.GetUserInforState, false);
                  wx.setStorageSync(Base.GetUserPhoneNumBerState, false);
                  wx.setStorageSync(Base.UserInfor, res.data.V);
                } else {
                  //成功但是用户信息为空处理
                  wx.setStorageSync(Base.GetUserInforState, false);
                  wx.setStorageSync(Base.GetUserPhoneNumBerState, true);
                }
              }  else {
                wx.setStorageSync(Base.GetUserInforState, true)
                wx.setStorageSync(Base.GetUserPhoneNumBerState, true)
              }
            } else {
              wx.setStorageSync(Base.GetUserInforState, true)
              wx.setStorageSync(Base.GetUserPhoneNumBerState, true)
              utils.ShowToast("网络异常,请重试……")
            }
          },

          fail: function() {
            wx.setStorageSync(Base.GetUserInforState, true)
            wx.setStorageSync(Base.GetUserPhoneNumBerState, true)
            loginNum = loginNum + 1;
            if (loginNum < 3) {
              request.login();
            } else {
              utils.ShowToast("网络异常,请重试……")
            }
          },
          complete: function(res) {
            //刷新页面数据存储状态
            if (request.userInfoReadyCallback != undefined) {
              request.userInfoReadyCallback(res, Base.EventBusForLogin)
            }
          }
        })
      } else {
        console.log("用户授权登录失败")
      }
    }
  })
}

request.smsRegist = function() {
  var header = request.getHeader();
  wx.request({
    url: Base.url + Base.smsRegist,
    data: {
      account: 15179161933,
      smsCode: 666666,
      registrationId: 'test',
    },
    header: header,
    success: function(res) {

      if (res.statusCode == 200) {
        if (res.cookies.length > 0) {
          let Sesstion = res.cookies[0].match(/=(\S*);/)[1];
          wx.setStorageSync(Base.UserInforSesstion, Sesstion);
        }
        if (res.data.S == 1000) {
          if (res.data.V != undefined) {
            //返回用户信息
            wx.setStorageSync(Base.GetUserInforState, false);
            wx.setStorageSync(Base.GetUserPhoneNumBerState, false);
            wx.setStorageSync(Base.UserInfor, res.data.V);

            wx.setStorageSync(Base.UserInforData, utils.formatTimeMinu(new Date()));
            if (res.data.V.orderDetial != undefined && res.data.V.orderDetial.config != undefined) {
              let config = res.data.V.orderDetial.config.split('|');
              wx.setStorageSync(Base.Config, config);
            }
            if (res.data.V.wxImgUrl == undefined) {
            }
          }
        } else if (res.data.S == 2000 || res.data.S == 1003 || res.data.S == 0) {

        }
      } else {
        utils.ShowToast("服务器维护中……")
      }
    },

    fail: function() {
      wx.setStorageSync(Base.GetUserInforState, true)
      wx.setStorageSync(Base.GetUserPhoneNumBerState, true)
      loginNum = loginNum + 1;
      if (loginNum < 3) {
        request.login();
      } else {
        utils.ShowToast("网络异常,请重试……")
      }
    },
    complete: function(res) {
      //刷新页面数据存储状态
      if (request.userInfoReadyCallback != undefined) {
        request.userInfoReadyCallback(res, Base.EventBusForLogin)
      }
    }
  })
}


function checkSession() {
  wx.checkSession({
    success() {
      //session_key 未过期，并且在本生命周期一直有效

    },
    fail() {
      // session_key 已经失效，需要重新执行登录流程
      wx.login() //重新登录
    }
  })
}
/**
 *  用户手机号解密数据返回
 */
request.getUserPhoneNumber = function(obj) {
  utils.ShowLoading();
  checkSession();
  var header = request.getHeader();
  wx.request({
    url: Base.url + obj.url,
    data: obj.data,
    method: obj.method,
    header: header,
    success: function(res) {
      if (res.statusCode == 200) {
        /**
         * 返回状态码：
        |-1      |获取用户信息失败 |
        |0       |解密手机号失败 |
        |1       |解密手机号成功，但注册用户失败 |
        |1000       |登录成功 |
         */
        if (res.data.S == 1000) { //获取手机号成功,并返回用户信息
          wx.setStorageSync(Base.GetUserPhoneNumBerState, false);
          if (res.data.V != undefined) {
            wx.setStorageSync(Base.UserInfor, res.data.V);
          } else { //获取手机号成功,但没有用户信息
            request.login();
          }
        } else if (res.data.S == 1) { //获取手机号成功，但没有用户信息返回
          request.login();
        } else {
          //获取手机号时sessionKey没有获取到
          utils.ShowToast(res.data.msg);
        }
        typeof(obj.success) == 'function' && obj.success(res);
      }
    },
    fail: function() {
      utils.ShowToast("网络异常，请重试……");
    },
    complete: function(res) {
      if (request.userPhoneNumberReadyCallback != undefined) {
        request.userPhoneNumberReadyCallback(res, Base.EventBusForUserPhone)
      }
      utils.HideLoading();
    }
  })

}


/**
 * 用户信息解密数据返回
 */
request.getUserInforForButton = function(obj) {
  utils.ShowLoading();
  var header = request.getHeader();
  wx.request({
    url: Base.url + obj.url,
    data: obj.data,
    method: obj.method,
    header: header,
    success: function(res) {
      /**
      * 返回状态码：
      * |-1       |保存用户信息失败 |
        |0       |openid获取失败 |
        |1       |获取到用户信息成功|
        |1003    |获取sessionKey失败 |
        |2000    |解密用户信息失败 |
        */
      if (res.statusCode == 200) {
        if (res.data.S == 1) {
          wx.setStorageSync(Base.GetUserInforState, false)
          wx.setStorageSync(Base.GetUserPhoneNumBerState, true)
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: 'none',
          })
        }
        typeof(obj.success) == 'function' && obj.success(res);
        // utils.ShowToast("授权成功");
      } else {
        wx.setStorageSync(Base.GetUserInforState, true)
        wx.setStorageSync(Base.GetUserPhoneNumBerState, true)
        isSuccess = false;
        utils.ShowToast("服务器异常，请重试");
      }
    },

    fail: function() {
      isSuccess = false;
      wx.setStorageSync(Base.GetUserInforState, true)
      wx.setStorageSync(Base.GetUserPhoneNumBerState, true)
      typeof obj.fail == 'function' && obj.fail(res);
      utils.ShowToast("网络异常，请重试");
    },

    complete: function(res) {
      typeof obj.complete == 'function' && obj.complete(res);
      if (request.userInfoReadyCallback != undefined) {
        request.userInfoReadyCallback(res, Base.EventBusForUserInfor)
      }
      utils.HideLoading();
      // utils.ShowToast("操作成功")
    }

  })
}





request.getHeader = function() {
  var header = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  var UserInforSesstion = wx.getStorageSync(Base.UserInforSesstion);
  var userInfor = wx.getStorageSync(Base.UserInfor);
  if (userInfor != undefined && userInfor.sessionId != undefined) {
    //直接获取用户信息中的session
    var minu = utils.formatTimeMinu(new Date());
    var userInforData = wx.getStorageSync(Base.UserInforData);
    header = {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      "Cookie": 'JSESSIONID=' + userInfor.sessionId
    }
    if ((minu - userInforData) > 50 && userInforData.length > 0) {
      wx.setStorageSync(Base.UserInfor, "");
    }
  } else if (UserInforSesstion != undefined && UserInforSesstion.length > 0) {
    //直接获取缓存中的session
    var minu = utils.formatTimeMinu(new Date());
    var catchminu = wx.getStorageSync(Base.UserInforSesstionData);

    if ((minu - catchminu) > 50 && catchminu.length > 0) {
      wx.setStorageSync(Base.UserInforSesstionData, "");
    } else {
      header = {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "Cookie": 'JSESSIONID=' + UserInforSesstion
      }
    }
  }
  return header;
}

/**
 * 新版本监测更新
 */
request.versionCodeUpDate = function() {

  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(function(res) {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })

  updateManager.onUpdateReady(function() {
    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    updateManager.applyUpdate()
    // wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success: function(res) {
    //         if (res.confirm) {
    //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //             updateManager.applyUpdate()
    //         }
    //     }
    // })
  })

  updateManager.onUpdateFailed(function() {
    // 新的版本下载失败
  })
}


module.exports = request