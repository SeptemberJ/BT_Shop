import h from '../../../utils/url.js'
var app = getApp()
Page( {
  data: {
    goods:[],
    levels:[],
    loadingHidden:true,
    canDo:false

  },

  onLoad: function (options) {
    this.setData({
      orderNum: options.orderNum
    })
    
   
  },
  onShow: function () {
    
    wx.request({
      url: h.main + '/selectorderentry1',
      data: {
        FBillNo: this.data.orderNum

      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //     header: {
      //         'content-type': 'application/x-www-form-urlencoded',
      //         'Accept': 'application/json',
      //     },
      success: (res) => {
        // success
        console.log('评价backInfo----')
        console.log(res)
        this.setData({
          goods:res.data
        })

        // level
        var temp = []
        var len = this.data.goods.length
        var initialLevel = {
          'starts': [false, false, false, false, false],
          'level': 0
        }
        for (var i = 0; i < len; i++) {
          temp.push(initialLevel)
        }
        this.setData({
          levels: temp
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

  chooseStart: function (e) {
    var indexf = e.currentTarget.dataset.indexf
    var indexs = e.currentTarget.dataset.indexs
    var temp = this.data.levels
    var instead={
      'starts':[],
      'level':''
    }
    instead.level = indexs+1
    temp.splice(indexf,1,{})
    for(var i=0;i<5;i++){
      if (i <= indexs){
        instead.starts.push(true)
      }else{
        instead.starts.push(false)
      }
    }
    temp.splice(indexf, 1, instead)
    this.setData({
      levels: temp
      })
  },
  // 提交评价
  bindFormSubmit: function(e){
    this.setData({
      canDo:true
    })
    var obj=[]
    var len = this.data.goods.length
    for(var i=0;i<len;i++){
      var tempObj = {}
      tempObj.goods = this.data.goods[i]
      tempObj.levels = this.data.levels[i]
      tempObj.evaluateCont = e.detail.value['evaluateCont' + i.toString()]
      obj.push(tempObj)
    }
    console.log(obj)
    wx.request({
      url: h.main + '/insertgoods',
      data: {
        Forderno: this.data.orderNum,
        GoodsEvaluates:obj,
        oppenid: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //     header: {
      //         'content-type': 'application/x-www-form-urlencoded',
      //         'Accept': 'application/json',
      //     },
      success: (res) => {
        // success
        console.log('评价提交backInfo----')
        console.log(res)
        if (res.data==1){
          wx.showToast({
            title: '评价提交成功！',
            icon: 'success',
            duration: 1000
          })
          wx.navigateBack({
          })
        }else{
          wx.showToast({
            title: '评价提交失败，稍后重试！',
            icon: 'success',
            duration: 1000
          })
          this.setData({
            canDo: false
          })
        }

      },
      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete

      }
    })


  }
  
})