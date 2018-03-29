var WxParse = require('../wxParse/wxParse.js');
var utils = require('../../utils/util.js');
import h from '../../utils/url.js'
var app = getApp()
Page({
  data:{
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    circular:true,
    FItemID:'',
    ware:'',
    quantity:1,
    showQuantity:false,
    ifFavorite:false,
    evaluates:0,
    rate:0,
    cartOrPay:'',
    loadingHidden:true
  },
  onLoad:function(options){
    this.setData({
      FItemID: options.FItemID
    })
  },
  onShow:function(){
    //该类下的商品
    wx.request({
      url: h.main + '/getGoodsByCategory',
      data: {
        FItemID: this.data.FItemID
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //     header: {
      //         'content-type': 'application/x-www-form-urlencoded',
      //         'Accept': 'application/json',
      //     },
      success: (res) => {
        // success
        console.log('该类下的商品---')
        console.log(res.data.arr)
        this.setData({
          goodsList: res.data.arr
        })

      },
      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete
      }
    })
    // wx.request({
    //   url: h.main+'/getGoodsByCategory1',
    //   data: {
    //     FItemID:this.data.wareId,
    //     oppenid:app.globalData.oppenid
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //    //     header: {
    //     //         'content-type': 'application/x-www-form-urlencoded',
    //     //         'Accept': 'application/json',
    //     //     },
    //   success: (res)=>{
    //     // success
    //     console.log('商品详情----')
    //     console.log(res.data)
    //     // var temp = res.data.arr
    //     // var format = new Date(res.data.arr[1][0].comment_time.time)
    //     // temp[1][0].comment_time.time = utils.formatTime2(format)
        
    //     // console.log(temp)
    //     this.setData({
    //       ware: res.data.arr,
    //       ifFavorite:res.data.arr[3]==0?false:true,
    //       evaluates:res.data.arr[2],
    //       rate:res.data.arr[4]
    //     })
    //     var article = res.data.arr[0][0].fdetail;
    // WxParse.wxParse('article', 'html', article, this, 5);
      
    //   },
    //   fail: (res) => {
    //     // fail
    //   },
    //   complete: (res) => {
    //     // complete
    //   }
    // })

    this.setData({
      showQuantity:false
    })
    

  },
  // favorite
  favorite: function(){
    this.setData({
      ifFavorite:!this.data.ifFavorite
    })
    if(this.data.ifFavorite){
      //收藏
      wx.request({
        url: h.main + '/Insertcollection',
        data: {
          fitemid: this.data.ware[0][0].fitemid,
          oppenid:app.globalData.oppenid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'Accept': 'application/json',
        //     },
        success: (res) => {
          // success
          console.log('收藏backInfo-----')
          console.log(res)
          wx.showToast({
            title: '收藏成功！',
            icon: 'success',
            duration: 1000
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
      //取消收藏
      wx.request({
        url: h.main + '/deletecollection',
        data: {
          fitemid: this.data.ware[0][0].fitemid,
          oppenid: app.globalData.oppenid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'Accept': 'application/json',
        //     },
        success: (res) => {
          // success
          console.log('取消收藏backInfo-----')
          console.log(res)
          wx.showToast({
            title: '取消收藏成功！',
            icon: 'success',
            duration: 1000
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1000
      })
    }
  },
  // loadMore evaluates
  loadMore: function(){
    var wareId = this.data.ware[0][0].fitemid
    wx.navigateTo({
      url: '../evaluate/index?wareId='+wareId
    })
  },
  // 关闭数量选择框
  closeShowQuantity: function(){
    this.setData({
      showQuantity:false
    })
  },
	//减少数量
	bindMinus: function(e) {
    if(this.data.quantity<2){
      return
    }else{
      var num = this.data.quantity
      num--
      this.setData({
        quantity: num
      });
    }
	},

	//增加数量
	bindPlus: function(e) {
		var num = this.data.quantity
    num++
    this.setData({
			quantity: num
		});
	},

	//直接修改数量
	bindManual: function(e) {
		this.setData({
			quantity: e.detail.value
		});
	},
  //addCart
  addCart: function () {
    this.setData({
      showQuantity: true,
      cartOrPay: 0
    })
  },
  //buyNow
  buyNow: function(){
    this.setData({
      showQuantity:true,
      cartOrPay:1
    })
    
  },
  // confirmBuy
  confirm: function(){
    if (this.data.cartOrPay==1){
      var buyGoodInfo = {
        'goods_id': this.data.ware[0][0].fitemid,
        'goods_price': this.data.ware[0][0].frefcost,
        'goods_name': this.data.ware[0][0].fname,
        'fimgs1': this.data.ware[0][0].fimgs1,
        'goods_num': this.data.quantity,
        'goods_img': this.data.ware[0][0].fimgs
      }
      console.log(this.data.ware)
      console.log(buyGoodInfo)
      var orderInfo = {}
      orderInfo.buyList = []
      orderInfo.buyList.push(buyGoodInfo)
      orderInfo.total = parseInt(buyGoodInfo.goods_price) * buyGoodInfo.goods_num
      wx.setStorage({
        key: "orderInfo",
        data: orderInfo
      })
      // console.log(parseInt(buyGoodInfo.price))
      wx.navigateTo({
        url: '../order/index'
      });
    }else{
      // 加入购物车
      wx.request({
        url: h.main + '/cartInsert',
        data: {
          fitemid: this.data.ware[0][0].fitemid,
          goods_num: this.data.quantity,
          oppenid: app.globalData.oppenid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'Accept': 'application/json',
        //     },
        success: (res) => {
          // success
          console.log('加入购物车----')
          console.log(res.data)
          if (res.data==1){
            wx.showToast({
              title: '加入购物车成功！',
              icon: 'success',
              duration: 1000
            })
            this.setData({
              showQuantity: false
            })
          }else{
            wx.showToast({
              title: '请稍后重试！',
              icon: 'warn',
              duration: 1000
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
    
  },
})