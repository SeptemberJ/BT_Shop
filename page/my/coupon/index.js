var app = getApp()
import h from '../../../utils/url.js'
Page( {
  data: {
    cardList:[],
    loadingHidden: false,

  },

  onLoad: function() {
    
   
  },
  onShow: function(){
    //获取用户本小程序内所有卡券列表
    wx.request({
      url: h.main + '/getcardpage',
      data: {
        oppenid: app.globalData.oppenid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      success: (res) => {
        // success
        console.log('获取用户本小程序内所有卡券列表backInfo----')
        console.log(res)
        var temp = []
        var len = res.data.length
        for (var i = 0; res.data.length > 0; i++) {
          var tempObj = {
            "card_id": res.data[0],
            "code": res.data[1],
            "card_log": res.data[2],
            "brand_name": res.data[3],
            "title": res.data[4],
            "bgColor":res.data[5],
          }
          temp.push(tempObj)
          res.data.splice(0, 6)
        }
        console.log('截取后----')
        console.log(temp)
        this.setData({
          cardList: temp,
          loadingHidden:true
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
  openCard: function(e){
    var card_id = e.currentTarget.dataset.cardid
    var code = e.currentTarget.dataset.code
    wx.openCard({
      cardList: [
        {
          cardId: card_id,
          code: code
        }
      ],
      success: function (res) {
      }
    })
  }
})