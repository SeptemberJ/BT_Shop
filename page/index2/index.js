import Promise from '../../utils/blue'
import h from '../../utils/url.js'
var app = getApp()
Page({
    data: {
        role:'',
        loadingHidden:false,
        // SE
        RecyclingList: ['沃土物流','沃金物流']
        },
	onLoad: function () {
        
    },
    onShow: function (e) {
      var code1
      wx.login({
        success: function (res) {
          console.log(res.code + "*******************")
          code1 = res.code

          wx.request({
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx71dfc9ba5ddba395&secret=341d3888b3acf345ff663c8dfd9db372&code=' + code1 + '&grant_type=authorization_code',
            data: {
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: (res) => {
              // success
              console.log('openid-----')
              console.log(res.data)

            },
            fail: (res) => {
              // fail
              console.log(res.data)
            },
            complete: (res) => {
              // complete
              console.log(res.data)
            }
          })
        }
      })
    },
    
});