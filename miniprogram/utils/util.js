function t(t) {
  return (t = t.toString())[1] ? t : "0" + t;
}

var request = require('../request.js');
var base = require('../conf.js');


/**
 * 图片指定宽高比缩放方法
 **/
function InputWHImage(e, width, heigh) {
  var imageSize = {};
  var originalWidth = e.detail.width; //图片原始宽
  var originalHeight = e.detail.height; //图片原始高
  var originalScale = originalHeight / originalWidth; //图片高宽比

  if (originalWidth < width) { //图片高宽比小于屏幕高宽比
    //图片缩放后的宽为屏幕宽
    imageSize.imageWidth = originalWidth;
    imageSize.imageHeight = originalHeight

  } else { //图片宽大于屏幕宽
    //图片缩放后的宽为屏幕宽
    imageSize.imageWidth = width;
    imageSize.imageHeight = originalScale * width;
  }
  return imageSize;
}


/**
 * 富文本去除标签方法
 */
function convertHtmlToText(inputText) {
  var returnText = "" + inputText;

  returnText = returnText.replace(/<\/div>/ig, '\r\n');
  returnText = returnText.replace(/<\/li>/ig, '\r\n');
  returnText = returnText.replace(/<li>/ig, '  *  ');
  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
  //-- 删除br标签并用换行符替换它们
  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

  //-- 删除P和A标签，但保留其中的内容
  returnText = returnText.replace(/<p.*?>/gi, "\r\n");
  returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- 截取图片标签中的路径内容
  if (returnText.indexOf("<img") > -1) {
    //去空格
    // returnText = returnText.replace(/\s+/g, '');
    returnText = returnText + returnText.substring(returnText.indexOf("src=\"") + 5, returnText.indexOf("g\"") + 1);
  }
  //-- 删除所有SCRIPT和STYLE标签
  returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- 删除所有其他
  returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

  //--摆脱2个以上的多个换行符：
  returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

  //-- 摆脱2个以上的空格：
  returnText = returnText.replace(/ +(?= )/g, '');

  //-- 摆脱html编码的字符：
  returnText = returnText.replace(/ /gi, " ");
  returnText = returnText.replace(/&/gi, "&");
  returnText = returnText.replace(/"/gi, '"');
  returnText = returnText.replace(/</gi, '<');
  returnText = returnText.replace(/>/gi, '>');

  // 空数据判断
  if (isBlank(returnText))
    returnText = "";

  return returnText;
}


function ShowToast(title) {

  if (title == undefined || title.length < 1) {
    title = '授权失败，请重试 T_T '
  }

  wx.showToast({
    title: title,
    icon: "none"
  })
}

/**
 * 用于判断空，Undefined String Array Object
 */
function isBlank(str) {
  if (str === 'Undefined' || str === 'undefined') { //空
    return true
  } else if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }

}

/**
 * 获取用户订单信息
 */
function getVideoStateForSubId(subId) {
  var map = "";
  var userInfor = wx.getStorageSync(base.UserInfor);
  if (userInfor == undefined) {
    return null;
  } else {
    var ord = userInfor.orderDetial;
    if (ord != undefined && ord.config != undefined && ord.config.length > 0) {
      var sub = ord.config.split("|");
      if (sub == null)
        return null;
      for (var i = 0; i < sub.length; i++) {
        var sblast = sub[i].substring(0, sub[i].indexOf(","));
        if (sblast != undefined && sblast == subId) {
          var shux = sub[i].substring(sub[i].indexOf(",") + 1, sub[i].lastIndexOf(","));
          var num = sub[i].substring(sub[i].lastIndexOf(",") + 1, sub[i].length);
          map = {
            shux: shux,
            num: num
          };
          return map;
        }
      }
    }
  }
  return null;
}

function ShowLoading() {
  wx.showLoading({
    title: "加载中",
    mask: true
  })
}


function HideLoading() {
  wx.hideLoading()
}

function formatTime(e) {
  var n = e.getFullYear(),
    o = e.getMonth() + 1,
    r = e.getDate(),
    u = e.getHours(),
    i = e.getMinutes(),
    g = e.getSeconds();
  return [n, o, r].map(t).join("/") + " " + [u, i, g].map(t).join(":");
}

function formatTimeData(e) {
  var n = e.getFullYear() + '',
    o = e.getMonth() + 1 + '',
    r = e.getDate() + '';
  if (o.length < 2) {
    o = "0" + o
  }
  if (r.length < 2) {
    r = "0" + r
  }

  return (n + o + r)
}

function formatTimeMinu(e) {
  var n = e.getFullYear() + '',
    o = e.getMonth() + 1 + '',
    r = e.getDate() + '',
    u = e.getHours() + '',
    i = e.getMinutes() + '';

  if (o.length < 2) {
    o = "0" + o
  }
  if (r.length < 2) {
    r = "0" + r
  }
  if (u.length < 2) {
    u = "0" + u
  }
  if (i.length < 2) {
    i = "0" + i
  }
  return (n + o + r + u + i);
}

//php反序列化


function Unserialize(ss) {
  var p = 0,
    ht = [],
    hv = 1,
    r = null;

  function unser_null() {
    p++;
    return null;
  }

  function unser_boolean() {
    p++;
    var b = (ss.charAt(p++) == '1');
    p++;
    return b;
  }

  function unser_integer() {
    p++;
    var i = parseInt(ss.substring(p, p = ss.indexOf(';', p)));
    p++;
    return i;
  }

  function unser_double() {
    p++;
    var d = ss.substring(p, p = ss.indexOf(';', p));
    switch (d) {
      case 'INF':
        d = Number.POSITIVE_INFINITY;
        break;
      case '-INF':
        d = Number.NEGATIVE_INFINITY;
        break;
      default:
        d = parseFloat(d);
    }
    p++;
    return d;
  }

  function unser_string() {
    p++;
    var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
    p += 2;
    var s = utf8to16(ss.substring(p, p += l));
    p += 2;
    return s;
  }

  function utf8to16(utf8Arr) {
    var utf16Str = '';

    for (var i = 0; i < utf8Arr.length; i++) {
      //每个字节都转换为2进制字符串进行判断
      var one = utf8Arr[i].toString(2);

      //正则表达式判断该字节是否符合>=2个1和1个0的情况
      var v = one.match(/^1+?(?=0)/);

      //多个字节编码
      if (v && one.length == 8) {
        //获取该编码是多少个字节长度
        var bytesLength = v[0].length;

        //首个字节中的数据,因为首字节有效数据长度为8位减去1个0位，再减去bytesLength位的剩余位数
        var store = utf8Arr[i].toString(2).slice(7 - bytesLength);
        for (var st = 1; st < bytesLength; st++) {
          //后面剩余字节中的数据，因为后面字节都是10xxxxxxx，所以slice中的2指的是去除10
          store += utf8Arr[st + i].toString(2).slice(2)
        }

        //转换为Unicode码值
        utf16Str += String.fromCharCode(parseInt(store, 2));

        //调整剩余字节数
        i += bytesLength - 1
      } else {
        //单个字节编码，和Unicode码值一致，直接将该字节转换为UTF-16
        utf16Str += String.fromCharCode(utf8Arr[i])
      }
    }

    return utf16Str
  }

  function unser_array() {
    p++;
    var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
    p += 2;
    var a = [];
    ht[hv++] = a;
    for (var i = 0; i < n; i++) {
      var k;
      switch (ss.charAt(p++)) {
        case 'i':
          k = unser_integer();
          break;
        case 's':
          k = unser_string();
          break;
        case 'U':
          k = unser_unicode_string();
          break;
        default:
          return false;
      }
      a[k] = __unserialize();
    }
    p++;
    return a;
  }

  function unser_object() {
    p++;
    var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
    p += 2;
    var cn = utf8to16(ss.substring(p, p += l));
    p += 2;
    var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
    p += 2;
    if (eval(['typeof(', cn, ') == "undefined"'].join(''))) {
      eval(['function ', cn, '(){}'].join(''));
    }
    var o = eval(['new ', cn, '()'].join(''));
    ht[hv++] = o;
    for (var i = 0; i < n; i++) {
      var k;
      switch (ss.charAt(p++)) {
        case 's':
          k = unser_string();
          break;
        case 'U':
          k = unser_unicode_string();
          break;
        default:
          return false;
      }
      if (k.charAt(0) == '/0') {
        k = k.substring(k.indexOf('/0', 1) + 1, k.length);
      }
      o[k] = __unserialize();
    }
    p++;
    if (typeof (o.__wakeup) == 'function') o.__wakeup();
    return o;
  }

  function unser_custom_object() {
    p++;
    var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
    p += 2;
    var cn = utf8to16(ss.substring(p, p += l));
    p += 2;
    var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
    p += 2;
    if (eval(['typeof(', cn, ') == "undefined"'].join(''))) {
      eval(['function ', cn, '(){}'].join(''));
    }
    var o = eval(['new ', cn, '()'].join(''));
    ht[hv++] = o;
    if (typeof (o.unserialize) != 'function') p += n;
    else o.unserialize(ss.substring(p, p += n));
    p++;
    return o;
  }

  function unser_unicode_string() {
    p++;
    var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
    p += 2;
    var sb = [];
    for (i = 0; i < l; i++) {
      if ((sb[i] = ss.charAt(p++)) == '//') {
        sb[i] = String.fromCharCode(parseInt(ss.substring(p, p += 4), 16));
      }
    }
    p += 2;
    return sb.join('');
  }

  function unser_ref() {
    p++;
    var r = parseInt(ss.substring(p, p = ss.indexOf(';', p)));
    p++;
    return ht[r];
  }

  function __unserialize() {
    switch (ss.charAt(p++)) {
      case 'N':
        return ht[hv++] = unser_null();
      case 'b':
        return ht[hv++] = unser_boolean();
      case 'i':
        return ht[hv++] = unser_integer();
      case 'd':
        return ht[hv++] = unser_double();
      case 's':
        return ht[hv++] = unser_string();
      case 'U':
        return ht[hv++] = unser_unicode_string();
      case 'r':
        return ht[hv++] = unser_ref();
      case 'a':
        return unser_array();
      case 'O':
        return unser_object();
      case 'C':
        return unser_custom_object();
      case 'R':
        return unser_ref();
      default:
        return false;
    }
  }
  return __unserialize();
}

/**
 * parm 
 *  arr 遍历的数组对象
 *  key 要查询的对象属性name
 *  value 对应属性的值
 * 根据指定对象参数查询数组对象
 * return Object
 */
function arrayMapParm(arr, key, value) {
  var _item = {};
  arr.map((item) => {
    if (item[key] == value) {
      _item = item;
    }
  });
  return _item;
}

/* parm 
 *  arr 遍历的数组对象
 *  key 要查询的对象属性name
 *  value 对应属性的值
 * 根据指定对象参数查询数组对象
 * return array
 */
function filterArrayParm(arr, key, value) {
  var _item = [];
  arr.map((item) => {
    if (item[key] == value) {
      _item.push(item);
    }
  });
  return _item;
}
/* parm 
 *  arr 遍历的数组对象
 *  obj 要检查的对象属性
 *  parm 配对的对象字段
 * 根据指定对象检查数组对象
 * return Boolean
 */
function checkArrayParm(objectArray, object, parm) {
  let flag = false;
  objectArray.forEach(item => {
    if (item[parm] == object[parm]) {
      flag = true;
    }
  });
  return flag;
}
/* parm 
 *  currentArray 当前数组对象
 *  targetArray 过滤的数组对象
 *  parm 配对的对象字段
 * 根据指定对象检查数组对象
 * return objectArray
 */
function filterObjectArray(currentArray, targetArray, parm) {
  return currentArray.filter(itemA => {
    let flag=true;
    targetArray.forEach(itemB=>{
      if (itemA[parm] == itemB[parm]) {
        flag = false;
      }
    })
    return flag;
  })
}
/* parm 
 *  arr 排序数组
 *  seq 过滤参数
 * 根据指定对象检查数组对象
 * return newArr
 */
function sortAndfilter(arr, seq) {
  let newArr = []
  seq.forEach(item => {
    arr.forEach((val, index, arr) => {
      if (val.course.id == item) {
        newArr.push(arr.splice(index, 1)[0]);
      }
    })
  })
  return newArr;
}
/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

function checkItemAuth(item) {
  var userInfor = wx.getStorageSync(base.UserInfor);
  var result = false;
  var ord = userInfor.orderDetial;
  if (item.xkwMoney == 0) {
    result = true;
  } else
  if (ord != undefined && ord.config != undefined && ord.config.length > 0) {
    var sub = ord.config.split("|");
    var subCourseIdStr = item.subCourseIdStr.split(",");
    if (sub != null) {
      for (var i = 0; i < sub.length; i++) {
        var mysub = sub[i].split(',');
        if (subCourseIdStr.indexOf(mysub[0]) > -1) {
          if (mysub[1].indexOf(4) > -1) {
            result = true;
            break;
          }
        }
      }
    }
  }
  return result;
}
module.exports = {
  formatTime: formatTime,
  formatTimeData: formatTimeData,
  formatTimeMinu: formatTimeMinu,
  InputWHImage: InputWHImage,
  ShowToast: ShowToast,
  convertHtmlToText: convertHtmlToText,
  isBlank: isBlank,
  getVideoStateForSubId: getVideoStateForSubId,
  ShowLoading: ShowLoading,
  HideLoading: HideLoading,
  filterArrayParm: filterArrayParm,
  arrayMapParm: arrayMapParm,
  checkArrayParm: checkArrayParm,
  filterObjectArray: filterObjectArray,
  sortAndfilter: sortAndfilter,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  checkItemAuth: checkItemAuth,
};