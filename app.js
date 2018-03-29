//app.js
import h from '/utils/url.js'
// const AV = require('./utils/av-weapp.js');
const appId = "wx6a30d2c0aea74559";
const appKey = "9f4fd8ce7a2f074b313630412d6caca7";
// AV.init({ 
// 	appId: "SgHcsYqoLaFTG0XDMD3Gtm0I-gzGzoHsz", 
// 	appKey: "xdv2nwjUK5waNglFoFXkQcxP",
// });

App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


  },
  getUserInfo: function (cb) {
    var that = this
     wx.login({
        success: function (a) {
          var code = a.code;
          console.log(code+"*******************")
          wx.getUserInfo({
            success: function (res) {
              console.log('getUserInfo----')
              console.log(res)
              var encryptedData = encodeURIComponent(res.encryptedData);
               var iv = res.iv;
              that.globalData.userInfo = res.userInfo
              that.globalData.code = code
              that.globalData.encryptedData = encryptedData
              that.globalData.iv = res.iv
              
            Login(code,encryptedData,iv);
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
  },
  onShow: function () {
    console.log('App Show')
    
    
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    code: "",
    encryptedData: "",
    iv: "",
    oppenid: '',
    card_id:'',
    // oppenid:'oGm3u0FHjaAt6vFemoB3XF39RHbE',
    cardstatus:0,
    jihuostatus: 0,
    userRole:'',
    accountName:'',
    // ifHasCard:true
  },

})

//Login-----
function  Login(code,encryptedData,iv){  
          console.log('开始登录----');
          var app = getApp();
          console.log(app.globalData.userInfo);
          console.log(code)
          //请求服务器
          wx.request({
            url: h.main + "/userInsertWsc",
            data: {
             code:code,
             iv: app.globalData.iv,
             encryptedData: app.globalData.encryptedData,
             realname:app.globalData.userInfo.nickName,
             head_img:app.globalData.userInfo.avatarUrl
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
               'content-type': 'application/x-www-form-urlencoded' ,
                'Accept': 'application/json'
            }, // 设置请求的 header
            success: function (res) {
              console.log('登录返回oppen_id-----');
              // success
              console.log(res.data);
              app.globalData.oppenid = res.data.oppen_id;
              app.globalData.card_id = res.data.card_id;
              app.globalData.cardstatus = res.data.cardstatus;
              app.globalData.jihuostatus = res.data.jihuostatus;
              
              console.log(res.data.oppen_id);
              console.log(app.globalData.oppenid);
            },
            fail: function (res) {
              // fail
                console.log(res);
            },
            complete: function (res) {
              // complete
                console.log(+res);
            }
          })
  }

