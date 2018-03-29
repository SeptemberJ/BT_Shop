var app = getApp()
import h from '../../utils/url.js'
Page({
    data: {
        menuList:[],
        cur:0,
        goodsList:[],
        loadingHidden:true
       
           
    },
    onLoad: function() {

        
        
    },
    onShow: function(){
    //获取商品分类
    wx.request({
      url: h.main+'/getCategory',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'Accept': 'application/json',
        //     },
      success: (res)=>{
        // success
        console.log(res.data)
        this.setData({
            menuList:res.data.arr
        })
        //初始显示第一类下的商品
        wx.request({
        url: h.main+'/getGoodsByCategory',
        data: {
            FItemID:this.data.menuList[this.data.cur].FItemID
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     header: {
            //         'content-type': 'application/x-www-form-urlencoded',
            //         'Accept': 'application/json',
            //     },
        success: (res)=>{
            // success
            console.log('该类下的商品---')
            console.log(res.data)
            this.setData({
                goodsList:res.data.arr
            })
        
        },
        fail: (res)=>{
            // fail
        },
        complete: (res)=>{
            // complete
        }
        })
      },

      fail: (res)=>{
        // fail
      },
      complete: (res)=>{
        // complete
      }
    })
    },
    menuTabChange: function(e) {
        var idx = e.currentTarget.dataset.index
        var FItemID = e.currentTarget.dataset.fitemid
        console.log(e.currentTarget.dataset.index)
         console.log(e.currentTarget.dataset.fitemid)
        this.setData({
            cur:idx
        })
        //获取商品分类
        wx.request({
        url: h.main+'/getGoodsByCategory',
        data: {
            FItemID:FItemID
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     header: {
            //         'content-type': 'application/x-www-form-urlencoded',
            //         'Accept': 'application/json',
            //     },
        success: (res)=>{
            // success
            console.log('该类下的商品---')
            console.log(res.data)
            this.setData({
                goodsList:res.data.arr
            })
        
        },
        fail: (res)=>{
            // fail
        },
        complete: (res)=>{
            // complete
        }
        })
        
    },
    

    

})