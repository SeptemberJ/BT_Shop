import h from '../../../utils/url.js'
var app = getApp()
Page( {
  data: {
    state:'',
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
      url: h.main + '/searchlogs',
      data: {
        forderno: this.data.orderNum  
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //     header: {
      //         'content-type': 'application/x-www-form-urlencoded',
      //         'Accept': 'application/json',
      //     },
      success: (res) => {
        // success
        console.log('物流信息backInfo----')
        console.log(res)
        if (res.data==1){
          this.setData({
            logistics: []
          })
        }else{
        switch (res.data[2].state) {
          case '0': 
            this.setData({
              state: '在途中'
            })
          break;
          case '1': 
            this.setData({
              state: '已收揽'
            })
          break; 
          case '2':
            this.setData({
              state: '疑难'
            })
            break; 
          case '3':
            this.setData({
              state: '已签收'
            })
            break; 
          case '4':
            this.setData({
              state: '退签'
            })
            break; 
          case '5':
            this.setData({
              state: '同城派送中'
            })
            break; 
          case '6':
            this.setData({
              state: '退回'
            })
            break; 
          case '7':
            this.setData({
              state: '转单'
            })
            break; 
          default : 
            this.setData({
              state: '其他'
            })
        }
        this.setData({
          logistics:res.data
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


  },
  
})