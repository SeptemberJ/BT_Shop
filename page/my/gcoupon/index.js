var app = getApp()
import h from '../../../utils/url.js'
import util from '../../../utils/sha1.js'
Page( {
  data: {
    loadingHidden:false
  },

  onShow: function(){
    //获取所有卡券列表
    wx.request({
      url: h.main + '/getcard_id',
      data: {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
          },
      success: (res) => {
        // success
        console.log('获取所有卡券列表backInfo----')
        console.log(res)
        var temp = []
        var len = res.data.length
        for (var i = 0; res.data.length > 0; i++) {
          var tempObj = {
            "card_id": res.data[0],
            "card_log": res.data[1],
            "brand_name": res.data[2],
            "title": res.data[3],
            "bgColor": res.data[4],
          }
          temp.push(tempObj)
          res.data.splice(0, 5)
        }
        console.log('截取后----')
        console.log(temp)
        this.setData({
          cardList: temp,
          loadingHidden: true
        })
      },

      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete
      }
    })  
  },
  getCoupon: function (e) {
    var card_id = e.currentTarget.dataset.cardid
    var timestamp = (Date.parse(new Date())) / 1000;
    var openid = app.globalData.oppenid;
    var nonce_str = Math.random().toString(36).substr(2);
    var arr = new Array(timestamp, openid, nonce_str);
    // 转为字符串
    arr = arr.map(function (n) {
      return n.toString();
    });
    // 字典序排序
    arr = arr.sort();
    // 拼接为字符串
    var str = arr.join("");
    var signature = util.hex_sha1(str)
    wx.addCard({
      cardList: [
        {
          cardId: card_id,
          cardExt: '{"openid": openid, "timestamp": timestamp,"nonce_str":nonce_str, "signature":signature}'
        }
      ],
      success: function (res) {
        console.log('成功---')
        console.log(res.cardList) // 卡券添加结果
      },
      fail: function (res) {
        console.log('失败---')
        console.log(res)
      },
    })


  },
  
})