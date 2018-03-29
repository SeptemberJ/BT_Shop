
var app = getApp()
Page( {
  data: {
    userInfo: {},
  
  },

  onLoad: function() {
    var that = this
    
    //调用应用实例的方法获取全局数据
    // app.getUserInfo( function( userInfo ) {
    //   //更新数据
    //   that.setData( {
    //     userInfo: userInfo
    //   })
    // })
    that.setData({
      userInfo:app.globalData.userInfo,
    });
    console.log(app.globalData.userInfo);
   
   
  },
  navigateToOrder: function(e){
    let status = e.currentTarget.dataset.status
    wx.navigateTo({
			url: '../order/index?status='+status
		});
  },
  navigateToAddress:function(){
    wx.navigateTo({
			url: '../address/list/list'
		});
  },
  navigateToReceipt: function(){
    wx.navigateTo({
      url: '../receipt/list/index',
    })
  },
  navigateToFavorite: function(){
    wx.navigateTo({
      url: '../favorite/index',
    })
  },
  navigateToCoupon: function(){
    wx.navigateTo({
      url: '../coupon/index',
    })
  },
  navigateToService: function(){
    wx.navigateTo({
      url: '../service/index/index',
    })
  },
  navigateToGetCoupon: function(){
    wx.navigateTo({
      url: '../gcoupon/index',
    })
  },

})