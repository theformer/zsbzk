// packageA/pages/community/release/page.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    videoFile:{},
    showLoading:false,
    inputValue:'',
    showActionsheet: false,
    imgUrl: app.base.imgUrl,
    groups: [
      { text: '选择视频', value: 1 },
      { text: '去图库选择图片', value: 2 },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const eventChannel = this.getOpenerEventChannel()
    that.eventChannel = eventChannel;
    that.getModules();
  },
  
  /**
   * 获取社区版块
   */
  getModules() {
    let that = this;
    let obj = {
      url: app.base.getModules,
      data: {},
      success: (res) => {
        if (res.S == 1) {
          let modules = res.V;
          wx.setStorageSync('modules', res.V);
          modules.forEach(item => {
            item.pageIndex = 1;
          });
          that.setData({
            modules: modules,
          })
        }
      }
    }
    app.request.wxRequest(obj);
  },
  chooseImage: function (e) {
    const that = this;
    let count = 9 - that.data.files.length;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      count: count,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let urls = res.tempFilePaths;
        that.checkImage(urls);
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  close: function () {
    this.setData({
      showActionsheet: false
    })
  },
  btnClick(e) {
    const that = this;
    if (e.detail.value === 1) {
      wx.chooseVideo({
        sourceType: ['album'],
        maxDuration: 60,
        camera: 'back',
        success(res) {
          console.log("视频", res);
          that.setData({
            videoFile: {
              url: res.tempFilePath,
              time: res.duration,
            }
          })
        }
      })
    } else if (e.detail.value === 2) {
      wx.chooseImage({
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        count: 9,
        success: function (res) {
          let urls = res.tempFilePaths;
          that.checkImage(urls);
        }
      })
    }
    that.close()
  },
  uploadCallback() {
    let index = 0;  // 当前位置，标识已上传到第几张图片
    let newUrls = []; // 上传成功后的图片地址数组
    // 图片上传方法
    let upload = () => {
      let nowUrl = this.data.urlArr[index]; //当前待上传的图片地址
      wx.showLoading({
        title: '正在上传',
      });
      /* 
        无图片上传接口，收setTimeout 模拟延迟状态
        项目中替换为 wx.uploadFile 即可
      */
      // 假设每 1000ms 上传一张图片
      setTimeout(() => {
        // 此处为已上传成功后的回调函数内容
        let resUrl = `服务器返回上传后的地址 ${nowUrl}`; //假设这是上传成功后返回的地址
        newUrls.push(resUrl); // 将上传后的地址添加到成功数组中

        // 判断图片是否已经全部上传完成
        if (index >= (this.data.urlArr.length - 1)) {
          send();
        } else {
          //未全部上传完时标识位置+1并再次调用上传方法
          index++;
          upload();
        }
      }, 1000);
    }
    // 发送方法,用作图片上传完后，得到图片地址提交给其它接口或其它操作
    let send = () => {
      // 关闭加载提示
      wx.hideLoading();
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      })

      // 输出已经上传完的图片地址，请查看控制台结果
      console.log(newUrls);
    }

    // 调用上传方法
    upload();
  },
  uploadImageOrVideo:function(){
    const that = this;
    this.setData({
      showActionsheet: true
    })

  },
  checkImage:function(files){
    const that =this;
    let index = 0;
    let error = 0;
    let upload = () => {
      wx.showLoading({
        title: '正在检验图片',
      });
      let nowUrl = files[index]; //当前待上传的图片地址
      wx.uploadFile({
        url: app.base.url + app.base.checkImg + "?appTag=1000",
        filePath: nowUrl,
        name: 'img',//这里根据自己的实际情况改
        header: {
          "Cookie": 'JSESSIONID=' + wx.getStorageSync(app.base.UserInforSesstion),
        },
        success: (res) => {
          let reuslt = JSON.parse(res.data);
          if (reuslt.S == 1) {
            that.data.files.push({
              url:nowUrl,
              state:0,
              });
            if (index >= (files.length - 1)) {
              send();
            } else {
              //未全部上传完时标识位置+1并再次调用上传方法
              index++;
              upload();
            }
          } else {
            console.log('图片内容违规',index)
            index++;
            error++;
            upload();
          }
        },
        fail: (res) => {
          index++;
          error++;
          upload();
        },
        complete: (res) => {

        }
      });
    }
    // 发送方法,用作图片上传完后，得到图片地址提交给其它接口或其它操作
    let send = () => {
      // 关闭加载提示
      wx.hideLoading();
      let title ="图片校验成功";
      if (error>0){
        title+=`,有${error}图片内容违规`
      }
      wx.showToast({
        title: title,
        icon: 'success'
      })
      that.setData({
        files: that.data.files,
      })
      // 输出已经上传完的图片地址，请查看控制台结果
      console.log(that.data.files);
    }
    upload();
  },
  chooseLabel:function(){
    let that =this;
    wx.navigateTo({
      url: '/packageA/pages/community/label-module/page',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        eventCallback: function (data) {
          // console.log("eventCallback",data)
          that.setData({
            moduleIndex: data,
          })
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          modules : that.data.modules,
          moduleIndex : that.data.moduleIndex,
        })
      }
    })
  },

  /**
   * 多图片上传
   */
   uploadImageFile :function(data){
    var that = this,
    i= data.i ? data.i : 0;//当前上传的哪张图片
    let url = that.data.files[i].url;
     wx.showLoading({
       title: '正在上传图片',
     });
    wx.uploadFile({
      url: app.base.uploadUrl + app.base.uploadImg,
      filePath: url,
      name: 'myFile',//这里根据自己的实际情况改
      header: {
        "Cookie": 'JSESSIONID=' + wx.getStorageSync(app.base.UserInforSesstion),
      },
      success: (res) => {
        let reuslt = JSON.parse(res.data);
        if (reuslt.S == 1) {
          that.setData({
            ["files[" + i + "].url"]: reuslt.V.linkimageUrl,
            ["files[" + i + "].state"]: 1,
          })
        }else{
          that.setData({
            ["files[" + i + "].state"]: 0,
          })
        }
      },
      fail: (res) => {
        that.setData({
          ["files[" + i + "].state"]: 0,
        })
      },
      complete: () => {
        i++;//这个图片执行完上传后，开始上传下一张            
        if (i == that.data.files.length) {   //当图片传完时，停止调用 
          wx.showLoading({
            title: '上传成功',
          });
          that.addPost();//发布帖子
        } else {//若图片还没有传完，则继续调用函数                
          data.i = i;
          that.uploadImageFile(data);
        }
      }
    });
  },
  /**
   * 上传视频
   */
  uploadVideoFile:function(){
    const that =this; 
    wx.uploadFile({
      url: app.base.uploadUrl + app.base.uploadVideo,
      filePath: that.data.videoFile.url,
      name: 'upVideoTeach',//这里根据自己的实际情况改
      success: (res) => {
        let data = JSON.parse(res.data);
        if (data.S == 1) {
          that.data.videoFile.url = data.V.linkvideoUrl;
          that.data.videoFile.imgUrl = data.V.linkvideoImgUrl;
          that.setData({
            videoFile: that.data.videoFile
          })
          that.addPost();//发布帖子
        }
      },
      fail: (res) => {
        console.log("上传视频失败",res);
      },
      complete: (res) => {
        console.log("上传视频", res);
      }
    });
  },
  /**
   * 数据提交
   */
  formSubmit:function(e){
    const that = this;
    var data = e.detail.value,
    title =  data.title,
    content = data.content;
    if (!app.empty(title)){
      wx.showToast({
        title: '标题不能为空',
        icon:'none',
        duration:2000,
      })
      return false;
    }
    if(!app.empty(content)){
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000,
      })
      return false;
    }
    if(content.length<6){
      wx.showToast({
        title: '内容不能少于6个汉子',
        icon: 'none',
        duration: 2000,
      })
      return false;
    }
    if (that.data.moduleIndex==undefined){
      wx.showToast({
        title: '请选择标签',
        icon: 'none',
        duration: 2000,
      })
      return false;
    }
    app.request.wxPromise({
      url: app.base.checkMsg,
      data: {
        appTag:1000,
        content: title + content,
      },
    }).then(res=>{
      if(res.S==1){
        that.setData({
          showLoading: true,
          title: title,
          content: content,
        })
        if (that.data.files.length > 0) {
          that.uploadImageFile({});
        } else if (that.data.videoFile.url != undefined) {
          that.uploadVideoFile();
        } else {
          that.addPost();
        }
      }else{
        wx.showToast({
          title: '标题或内容违规,请修改',
          icon: 'none',
          duration: 3000,
        })
      }
    })
    
  },
  delImg:function(e){
    const that=this;
    let index = e.currentTarget.dataset.index;
    let files = that.data.files;
    files.splice(index,1);
    that.setData({
      files: files,
    })
  },
  delVideo:function(e){
    const that = this;
    that.setData({
      videoFile: {},
    })
  },
  /**
   * 发帖
   */
  addPost:function(){
    let that = this;
    let postData = {
      title: that.data.title,
      content: that.data.content,
      userId: wx.getStorageSync(app.base.UserInfor).id,
      provinceId: wx.getStorageSync("province").id,
      moduleId: that.data.modules[that.data.moduleIndex].id,
      state:1,
    };
    if (that.data.files.length > 0 ){
      postData.urlList = JSON.stringify(that.data.files);
      
    } else if (that.data.videoFile.url != undefined){
      postData.urlList = JSON.stringify([that.data.videoFile]);
      postData.state = 2;
    }
    let obj = {
      url: app.base.addPost,
      data: postData,
      success: (res) => {
        console.log(res);
        if (res.S == 1) {
          app.globalData.communityRefresh = !0;
          wx.showToast({
            title: '发帖成功!',
            icon: 'none',
            duration: 3000,
          })
          wx.navigateBack({
            delta: 1,
            success: (res) => {
              that.eventChannel.emit('reloading', {});
            }
          })
        }else{
          wx.showToast({
            title: '内容非法,请修改!',
            icon: 'none',
            duration: 3000,
          })
        }
      },
      fail: (res) => {

      },
      complete: (res) => {
        that.setData({
          showLoading:false,
        })
      }
    }
    app.request.wxRequest(obj);
  },
  changeLabel:function(e){
    this.setData({
      moduleIndex: e.currentTarget.dataset.index,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 富文本编辑器事件
   */
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})