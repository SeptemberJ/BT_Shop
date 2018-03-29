import h from '../../utils/url.js'
var utils = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    wareId:'',
    evaluates:[{'userName':'任艳','userAvatar':'','date':'2017-05-23','userMsg':'环境不错，房东客气有礼貌不烦人。下次有机会再去喝啤酒，吸收记得纸巾盒不太好用。'},{'userName':'向心力','userAvatar':'','date':'2017-06-23','userMsg':'一杯低度酒，一本“你是我的虚荣”，好惬意的一个下午！'}],
    loadingHidden:true
  },
  onLoad:function(options){
    this.setData({
      wareId:options.wareId
    })
  },
  onShow:function(){
    wx.request({
      url: h.main +'/selectcomment',
      data: {
        fitemid:this.data.wareId
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res)=>{
        // success
        console.log(res)
        var temp = res.data
        res.data.map(function(item,index){
          var format = new Date(res.data[index].comment_time)
          temp[index].comment_time = utils.secondToFormat(format)
        })
        this.setData({
          evaluates: temp
        })
      },
      fail: (res)=>{
        // fail
      },
      complete: (res)=>{
        this.setData({
          loadingHidden:true
        })
      }
    })
  },
})