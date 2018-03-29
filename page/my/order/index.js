var QR = require("../../../utils/qrcode.js");
import h from '../../../utils/url.js'
var app = getApp()
Page( {
  data: {
    tabList: ['待付款', '待发货', '待收货', '待评价','全部'],
    cur:0,
    orderList:[],
    maskHidden:true,
    imagePath:'',
    placeholder:'http://wxapp-union.com',
    loadingHidden:false
  },
  onReady:function(){
  },

  onLoad: function(options) {
    this.setData({
      cur:options.status
    })
  },
  onShow: function(){
    this.getGoodsByClass()
  },
  // tab 
  changeTab: function(e){
    this.setData({
      loadingHidden: false
    })
    let id = e.currentTarget.dataset.id
    this.setData({
      cur:id
    })
    console.log(this.data.cur)
    //获取对应商品分类
    this.getGoodsByClass()
  },
  // creat QrCode
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url,canvasId,cavW,cavH);

  },
  // to evaluate
  toEvaluate: function(e){
    var orderNum = e.currentTarget.dataset.ordernum
    wx.navigateTo({
      url: '../toEvaluate/index?orderNum=' + orderNum,
    })
  },
  // toLogistics
  toLogistics: function (e) {
    var orderNum = e.currentTarget.dataset.ordernum
    wx.navigateTo({
      url: '../logistics/index?orderNum=' + orderNum,
    })
  },

  //去付款
  toPay: function(e){
    var orderidx = e.currentTarget.dataset.idx
    console.log(orderidx)
    var orderNum = this.data.orderList[orderidx][0].Forderno
    
    var bodyString = '柏田科技订单-' + orderNum
    //微信重新支付
    wx.request({
      url: 'https://shkingdee-soft.com/xshopapi/JsapiPay',
      data: {
        total_fee: Number(this.data.orderList[orderidx][0].total) * 100,
        out_trade_no: this.data.orderList[orderidx][0].Forderno,
        body: bodyString.toString(),
        open_id: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('微信支付----')
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': (res) => {
            console.log('支付成功--')
            console.log(res)
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000
            })
            //支付成功修改订单状态
            wx.request({
              url: h.main + '/updateorder',
              data: {
                oppenid: app.globalData.oppenid,
                status: 1,
                FBillNo: orderNum

              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              //     header: {
              //         'content-type': 'application/x-www-form-urlencoded',
              //         'Accept': 'application/json',
              //     },
              success: (res) => {
                // success
                console.log('支付成功修改订单状态backInfo----')
                console.log(res)

              },
              fail: (res) => {
                // fail
              },
              complete: (res) => {
                // complete
                //刷新
                console.log('刷新----')
                this.getGoodsByClass()

              }
            })



          },
          'fail': (res) => {
            console.log(res)
            //支付失败修改订单状态
            wx.request({
              url: h.main + '/updateorder',
              data: {
                oppenid: app.globalData.oppenid,
                status: 0,
                FBillNo: orderNum

              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              //     header: {
              //         'content-type': 'application/x-www-form-urlencoded',
              //         'Accept': 'application/json',
              //     },
              success: (res) => {
                // success
                console.log('支付失败修改订单状态backInfo----')
                console.log(res)


              },
              fail: (res) => {
                // fail
              },
              complete: (res) => {
                // complete
                //刷新
                console.log('刷新----')
                this.getGoodsByClass()
              }
            })
          }
        })



      },
      fail: (res) => {
      },
      complete: (res) => {
        
      }
    })
  },
  //取消待付款订单
  cancelOrder: function(e){
    var orderidx = e.currentTarget.dataset.idx
    var orderNum = this.data.orderList[orderidx][0].Forderno
    wx.request({
      url: h.main + '/deleteorder',
      data: {
        FBillNo: orderNum
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: (res) => {
        var that = this
        // success
        console.log('订单删除成功backInfor-----')
        console.log(res.data)
        wx.showToast({
          title: '订单取消成功！',
          icon: 'success',
          duration: 1000
        })
        this.getGoodsByClass()
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })


    this.getGoodsByClass()
  },
  //toConfirm
  toConfirm: function(e){
    wx.showModal({
      title: '提示',
      content: '确认收货？',
      success: (res) => {
        if (res.confirm) {
          var orderNum = e.currentTarget.dataset.ordernum
          wx.request({
            url: h.main + '/updateorder',
            data: {
              FBillNo: orderNum,
              status: 3
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: (res) => {
              var that = this
              // success
              console.log('订单确认成功！backInfor-----')
              console.log(res.data)
              wx.showToast({
                title: '订单确认成功！',
                icon: 'success',
                duration: 500
              })
              // 跳转评价
              setTimeout(function () {
                wx.navigateTo({
                  url: '../toEvaluate/index?orderNum=' + orderNum,
                })
              }, 500);

              // this.getGoodsByClass()
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
          this.getGoodsByClass()
        }
      }
    })
    // var orderidx = e.currentTarget.dataset.idx
    // var orderNum = this.data.orderList[orderidx][0].Forderno

  },
  //获取商品分类
  getGoodsByClass: function () {
    if (this.data.cur==4){
      // 查询全部订单
      wx.request({
        url: h.main + '/selectorderentry3',
        data: {
          oppenid: app.globalData.oppenid,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: (res) => {
          // success
          console.log('查询全部订单backInfo-----')
          console.log(res.data)
          this.setData({
            loadingHidden: true
          })
          var that = this
          
          this.setData({
            orderList: res.data
          })
          res.data.map(function (item, index) {
            var canvasName = 'mycanvas' + index
            that.createQrCode(item[0].Forderno, canvasName, 50, 50);
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })

    }else{
      wx.request({
        url: h.main + '/selectorder',
        data: {
          oppenid: app.globalData.oppenid,
          status: this.data.cur
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: (res) => {
          // success
          console.log('查询对应状态订单backInfo-----')
          console.log(res.data)
          this.setData({
            loadingHidden: true
          })
          var that = this
          this.setData({
            orderList: res.data
          })
          res.data.map(function (item, index) {
            var canvasName = 'mycanvas' + index
            that.createQrCode(item[0].Forderno, canvasName, 50, 50);
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
    
  }
})
