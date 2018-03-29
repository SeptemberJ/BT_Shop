// const AV = require('../../utils/av-weapp.js')
import h from '../../utils/url.js'
var app = getApp()
Page({
	data:{
    // ifHasCard:'',
		goodsList: [],
		minusStatuses: [],
		selectedAllStatus: false,
		total: 0,
		loadingHidden:false
	},
	onShow: function() {
    // 是否领取过会员卡
    // this.setData({
    //   ifHasCard: app.globalData.ifHasCard
    // })
    //获取购物车列表
    wx.request({
      url: h.main + '/cartList',
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
        console.log('购物车列表---')
        console.log(res.data)
        var goods = res.data.goods
        var tempGoodsList=[]
        goods.map(function(item,index){
          item.selected=true
        })
        this.setData({
          goodsList: goods,
          loadingHidden: true
        })
        console.log(goods)
        this.initData();

      },
      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete
      }
    })
    
	},

	// 跳转商品详细页
	showWare: function(e){
		var index = parseInt(e.currentTarget.dataset.id)
		wx.navigateTo({
		  url: '../ware/index?id='+index,
		})

	},

	//减少数量
	bindMinus: function(e) {
		var index = parseInt(e.currentTarget.dataset.index);
    var objectId = e.currentTarget.dataset.objectId;
    var num = this.data.goodsList[index].goods_num;
		// 如果只有1件了，就不允许再减了
		if (num > 1) {
			num --;
		}
		// 只有大于一件的时候，才能normal状态，否则disable状态
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		// 购物车数据
		var carts = this.data.goodsList;
    carts[index].goods_num=num;
		// 按钮可用状态
		var minusStatuses = this.data.minusStatuses;
    minusStatuses.splice(index, 1, minusStatus)
		// minusStatuses[index] = minusStatus;
		// 将数值与状态写回
		this.setData({
			goodsList: carts,
			minusStatuses: minusStatuses
		});
		// update database
    wx.request({
      url: h.main + '/cartUpdate',
      data: {
        goods_num: num,
        id: objectId,
        oppenid: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: (res) => {
        // success
        console.log('购物车修改商品数量---')
        console.log(res.data)
        

      },
      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete
      }
    })
    //重新计算总价
		this.sum();
	},

	//增加数量
	bindPlus: function(e) {
		var index = parseInt(e.currentTarget.dataset.index);
    var objectId = e.currentTarget.dataset.objectId;
    var num = this.data.goodsList[index].goods_num;
		num ++;
		// quantity>1----normal，否则disable
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		// 购物车数据
		var carts = this.data.goodsList;
    carts[index].goods_num=parseInt(num);
		// 按钮可用状态
    console.log(this.data.minusStatuses)
		var minusStatuses = this.data.minusStatuses;
    minusStatuses.splice(index, 1, minusStatus)
		// minusStatuses[index] = minusStatus;
    console.log(minusStatus)
		
		this.setData({
			goodsList: carts,
			minusStatuses: minusStatuses
		});
    wx.request({
      url: h.main + '/cartUpdate',
      data: {
        goods_num: num,
        id: objectId,
        oppenid: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: (res) => {
        // success
        console.log('购物车修改商品数量---')
        console.log(res.data)


      },
      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete
      }
    })
    //重新计算总价
		this.sum();
	},

	//直接修改数量
	bindManual: function(e) {
		var index = parseInt(e.currentTarget.dataset.index);
    var objectId = e.currentTarget.dataset.objectId;
		var carts = this.data.goodsList;
		var num = e.detail.value;
    carts[index].goods_num=num;
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses.splice(index, 1, minusStatus)
    // minusStatuses[index] = minusStatus;
		this.setData({
			goodsList: carts,
      minusStatuses: minusStatuses
		});
    wx.request({
      url: h.main + '/cartUpdate',
      data: {
        goods_num: num,
        id: objectId,
        oppenid: app.globalData.oppenid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: (res) => {
        // success
        console.log('购物车修改商品数量---')
        console.log(res.data)


      },
      fail: (res) => {
        // fail
      },
      complete: (res) => {
        // complete
      }
    })
    //重新计算总价
    this.sum();
	},

	//复选框切换
	bindCheckbox: function(e) {
		var index = parseInt(e.currentTarget.dataset.index);
		//原始的icon状态
		var selected = this.data.goodsList[index].selected;
		var carts = this.data.goodsList;
		var selectedAllStatus = this.data.selectedAllStatus;
		// 对勾选状态取反
		carts[index].selected=!selected;
		//更新全选状态
		for (var item of carts) {
			if(!item.selected){
				selectedAllStatus=false
				break
				}else{
					selectedAllStatus=true		
			}
		}
		this.setData({
			goodsList: carts,
			selectedAllStatus:selectedAllStatus
		});
		console.log('复选框click------')
		console.log(this.data.goodsList)
		this.sum();
	},

	//全选
	bindSelectAll: function() {
		// 当前状态
		var selectedAllStatus = this.data.selectedAllStatus;
		// 取反
		selectedAllStatus = !selectedAllStatus;
		//遍历使其与全选状态相同
		var carts = this.data.goodsList;
		for(var item of carts){
			item.selected=selectedAllStatus;
		}
		this.setData({
			selectedAllStatus: selectedAllStatus,
			goodsList: carts,
		});
		this.sum();
	},

	//提交订单
	submitOrder: function() {
    wx.clearStorage()
		var buyList = this.getBuyList();
		if (buyList.length <= 0) {
			wx.showModal({
			title: '提示',
			content: '您还未勾选任何商品！',
			confirmColor:'#000',
			showCancel: false,   
			success: (res)=>{
				if (res.confirm) {
					
				}
				}
			})
			return
		}
		var orderInfo={}
		orderInfo.buyList = buyList
		orderInfo.total = this.data.total
		 wx.setStorage({
            key:"orderInfo",
            data:orderInfo
        })
		console.log('buyList------')
		console.log(buyList)
		wx.navigateTo({
			url: '../order/index'
		});
	},

	//单个删除商品
	deleteOne: function (e) {
    var index = e.currentTarget.dataset.index;
		var objectId = e.currentTarget.dataset.objectId;
		console.log(objectId);
		wx.showModal({
			title: '提示',
			content: '确认要删除该商品吗？',
			success: (res)=>{
				if (res.confirm) {
          //获取购物车列表
          wx.request({
            url: h.main + '/cartDel',
            data: {
              id: objectId,
              oppenid: app.globalData.oppenid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: (res) => {
              console.log('从购物车移除---')
              console.log(res.data)
              var temp = this.data.goodsList
              temp.splice(index, 1)
              this.setData({
                goodsList: temp,
              })
              if (res.data==1){
                wx.showToast({
                  title: '删除成功！',
                  duration: 500
                });
              }else{
                wx.showToast({
                  title: '删除失败，稍后重试！',
                  duration: 500
                });
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
			}
		})
    
	},

	//获取所有selected为true的商品
	getBuyList: function () {
		// 遍历取出已勾选的cid
		var carts = this.data.goodsList
		var buyList=[]
		for(var item of carts){
			if(item.selected){
				buyList.push(item)
			}
		}
		return buyList;
	},

	//初始化数据
	initData: function() {
		var goodsList = this.data.goodsList
		var minusStatuses = this.data.minusStatuses
		for(var i = 0; i < goodsList.length; i++){
      minusStatuses[i] = goodsList[i].goods_num <= 1 ? 'disabled' : 'normal';
			}
		this.setData({
				minusStatuses: minusStatuses
		});
		this.sum();
	},
	
	//计算合计
	sum: function() {
		var carts = this.data.goodsList;
		var total = 0;
		for(var item of carts){
			if (item.selected) {
        total += item.goods_num * item.goods_price;
			}
		}
		total = total.toFixed(2);
		this.setData({
			goodsList: carts,
			total: total
		});
	},

  // 领取会员卡
  getCard: function () {
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
          cardId: 'p9ejSvrmgHDcqZMeJBvWf27wCv4Y',
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
      },
    })
  },
  close: function () {
    app.globalData.ifHasCard = true
    this.setData({
      ifHasCard: true
    })
  },
	
})