import h from '../../utils/url.js'
import util from '../../utils/sha1.js'
var app = getApp()
Page({
  data:{
    nickName:'',
    Btabstract:'柏田科技，您的软件服务商！',
    greeting:'',
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    circular:true,
    SearchKey:'',
    searchOrClear:'../../image/icon/Search.png',
    products:[],
    loadingHidden:false,
    access_token:'',
    api_ticket:'',
    icons: ['../../image/icon/hardware.png', '../../image/icon/software.png', '../../image/icon/serviceIndex.png', '../../image/icon/fmagriculture.png']
  },
  onLoad:function(options){
        //调用应用实例的方法获取全局数据
        // app.getUserInfo((userInfo)=> {
        //     this.setData({
        //         userInfo: userInfo,
        //         nickName:userInfo.nickName,
        //     })
        //     console.log(this.data.userInfo)
        // });
    wx.login({
      success: (res)=> {
        var code = res.code;
        console.log(code + "*******************")
        wx.getUserInfo({
          success: (res)=> {
            console.log('getUserInfo----')
            console.log(res)
            var encryptedData = encodeURIComponent(res.encryptedData);
            var iv = res.iv;
            app.globalData.userInfo = res.userInfo
            app.globalData.code = code
            app.globalData.encryptedData = encryptedData
            app.globalData.iv = res.iv
            this.setData({
              nickName: res.userInfo.nickName,
            })
            this.Login(code, encryptedData, iv);
            typeof cb == "function" && cb(app.globalData.userInfo)
          }
        })
      }
    })
  },
  onShow: function(){
    // 是否领取过会员卡
    //set greeting
        var NowHour = new Date().getHours()
        if(NowHour<=12){
          this.setData({
                greeting: '上午好',
            })
        }else{
          if(12<NowHour<=18){
            this.setData({
                greeting: '下午好',
            })
          }else{
            this.setData({
                greeting: '晚上好',
            })
          }
        }
        
    //  获取分类模块
        wx.request({
          url: h.main + '/getCategory',
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          //     header: {
          //         'content-type': 'application/x-www-form-urlencoded',
          //         'Accept': 'application/json',
          //     },
          success: (res) => {
            // success
            console.log('获取三大模块backInfo----')
            this.setData({
              menuList: res.data.arr.slice(0, 3),
            })
          },

          fail: (res) => {
            // fail
          },
          complete: (res) => {
            // complete
          }
        })    
    //获取商品分类
    wx.request({
      url: h.main+'/getCategoryGoodsList',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'Accept': 'application/json',
        //     },
      success: (res)=>{
        // success
        console.log('获取首页商品backInfo----')
        console.log(res.data)
        this.setData({
          products:res.data.arr,
          loadingHidden: true,
        })

      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    // 搜索恢复默认
    this.setData({
      SearchKey:'',
      resultList:[],
      searchOrClear:'../../image/icon/Search.png'

    })
  },
  chooseSearchKey: function(e){
    this.setData({
      SearchKey:e.detail.value
    })
  },

  // search
  goSearch: function(e){
    if(this.data.searchOrClear=='../../image/icon/close.png'){
      this.setData({
        SearchKey:'',
        resultList:[],
        searchOrClear:'../../image/icon/Search.png'
      })
    }else{
      this.setData({
        loadingHidden:false
      })
      // 发送关键字获取结果列表
      wx.request({
        url: h.main + '/mohu',
        data: {
          FName: this.data.SearchKey
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'Accept': 'application/json',
        //     },
        success: (res) => {
          // success
          console.log('查询backInfo-----')
          console.log(res)
          if(res.data.length<=0){
            wx.showModal({
              title: '提示',
              content: '对不起，目前没有该商品！',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  //console.log('用户点击确定') 
                  this.setData({
                    resultList: res.data,
                    loadingHidden: true
                  })
                }
              }
            });

          }else{
            this.setData({
              resultList: res.data,
              searchOrClear: '../../image/icon/close.png',
              loadingHidden: true
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
  },
  //chooseThis
  chooseThis: function(e){
    var FItemID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../ware/index?id=' + FItemID,
    })

  },
  //分类模块
  getGoodsByClass: function(e){
    var FItemID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../module/index?FItemID=' + FItemID,
    })
  },



  // 领取会员卡
  getCard: function(){
    // var str = util.hex_sha1('15005348589h50f7yy2lhoGm3u0FHjaAt6vFemoB3XF39RHbE')
    // console.log(str)
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
          cardId: app.globalData.card_id,
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
        wx.showModal({
          title: '提示',
          content: '请先关注公众号！',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {

            }
          }
        })
      },
    })
  },
  close: function(){
    //获取是否领取并激活
    wx.request({
      url: h.main + '/selectstatus',
      data: {
        oppenid: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //     header: {
      //         'content-type': 'application/x-www-form-urlencoded',
      //         'Accept': 'application/json',
      //     },
      success: (res) => {
        // success
        console.log('获取是否领取并激活backInfo----')
        console.log(res)
        this.setData({
          jihuo: res.data[1] == 1 ? false : true
        })
        wx.showModal({
          title: '提示',
          content: '请先领取会员卡并激活（领取会员卡前,请先关注公众号-柏田软件！)',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
            }
          }
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
  // login
  Login:function (code, encryptedData, iv) {
    console.log('开始登录----');
    var app = getApp();
    console.log(app.globalData.userInfo);
    console.log(code)
  //请求服务器
  wx.request({
      url: h.main + "/userInsertWsc",
      data: {
        code: code,
        iv: app.globalData.iv,
        encryptedData: app.globalData.encryptedData,
        realname: app.globalData.userInfo.nickName,
        head_img: app.globalData.userInfo.avatarUrl
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }, // 设置请求的 header
      success: (res) => {
        console.log('登录返回oppen_id-----');
        console.log(res.data);
        // success
        // 未关注公众号
        if(res.data=='关注公众号'){
          this.setData({
            jihuo: app.globalData.jihuostatus == 1 ? false : true
          })
          wx.showModal({
            title: '提示',
            content: '领取会员卡前,请先关注公众号-柏田软件！',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
              }
            }
          })

        }else{
          app.globalData.oppenid = res.data.oppen_id;
          app.globalData.card_id = res.data.card_id;
          app.globalData.cardstatus = res.data.cardstatus;
          app.globalData.jihuostatus = res.data.jihuostatus;
          this.setData({
            jihuo: app.globalData.jihuostatus == 1 ? false : true
          })
          console.log(res.data.oppen_id);
          console.log(app.globalData.oppenid);

        }
        
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
        console.log(+res);
      }
    })
  }
})

