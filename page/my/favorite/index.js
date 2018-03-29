import h from '../../../utils/url.js'
var app = getApp()
Page( {
  data: {
    myGoodsList:[],
    loadingHidden:false
  
  },

  onLoad: function() {
    
   
  },
  onShow: function(){
    //获取收藏列表
    wx.request({
      url: h.main + '/selectcollection1',
      data: {
        oppenid: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }, // 设置请求的 header
      success: (res) => {
        console.log('收藏列表backInfo---=')
        console.log(res.data)
        this.setData({
          myGoodsList: res.data,
          loadingHidden:true
        })
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    })
  },
  // 跳转商品详细页
	showWare: function(e){
		var index = parseInt(e.currentTarget.dataset.id)
		wx.navigateTo({
		  url: '../../ware/index?id='+index,
		})

	},
  // 取消收藏
  moveOut: function(e){
    var idx = parseInt(e.currentTarget.dataset.idx)
    console.log('moveout-----')
    wx.showModal({
			title: '提示',
			content: '确认取消该商品的收藏？',
			// confirmColor:'#000',  
			success: (res)=>{
          if (res.confirm) {
            //取消收藏
            wx.request({
              url: h.main + '/deletecollection',
              data: {
                fitemid: this.data.myGoodsList[idx][0].fitemid,
                oppenid: app.globalData.oppenid
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: (res) => {
                // success
                console.log('取消收藏backInfo-----')
                console.log(res)
                if (res.data==1){
                  wx.showToast({
                    title: '取消收藏成功！',
                    icon: 'success',
                    duration: 1000
                  })
                  var temp = this.data.myGoodsList
                  temp.splice(idx, 1)
                  this.setData({
                    myGoodsList: temp
                  })
                }

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

  }

})