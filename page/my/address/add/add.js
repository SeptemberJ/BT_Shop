 const AV = require('../../../../utils/av-weapp.js')
 import h from '../../../../utils/url.js'
 import ss from '../../../../utils/add.js'
 var app = getApp()
Page({
	isDefault: false,
	data: {
		address:{},
		objectId:-1,
		id:'',
		current: 0,
		province: [],
		city: [],
		region: [],
		town: [],
		provinceObjects: [],
		cityObjects: [],
		regionObjects: [],
		townObjects: [],
		areaSelectedStr: '请选择省市区',
		maskVisual: 'hidden',
		provinceName: '请选择',
    sexArray:[true,false],
    sex:'先生'
	},
		onLoad: function (options) {
			var that = this;
			console.log(ss.add)
			var list = ss.add;
			var lista = [];
			for (var i in list) {
				lista.push(list[i].name)
			}
			this.setData({
				province: lista,
			})
			console.log(lista)
			if(options.id){
				wx.getStorage({
				key: 'address',
				success: (res)=>{
          console.log('本地存储----')
          console.log(res)
          var tempSex
          if (res.data.sex=='先生'){
            tempSex=[true,false]
          }else{
            tempSex = [false, true]
          }
          var addr = {'fitemid':res.data.fitemid,'detail':res.data.sblock,'realname':res.data.username,'mobile':res.data.smobile,}
					this.setData({
						areaSelectedStr:res.data.province+res.data.city+res.data.region,
						address:addr,
						provinceName:res.data.province,
						cityName:res.data.city,
						regionName:res.data.region,
            sexArray: tempSex,
            sex: res.data.sex
					})
          // console.log('address------')
          // console.log(this.data.address)
          // console.log(this.data.sexArray)
          // console.log(this.data.sex)
				}
				})
       
			}
			
			
			
	},
  // 选择性别
    chooseSex: function(e){
    var idx = parseInt(e.currentTarget.dataset.index)
    var kind = e.currentTarget.dataset.kind
    var kinds = this.data.sexArray
    var that = this
    kinds.map(function (item, index) {
      if (index == idx) {
        kinds[index] = true
      } else {
        kinds[index] = false
      }
    })
    this.setData({
      sexArray: kinds,
      sex: kinds[0] == true ? '先生' : '女士'
    })
  },
	  //选择位置位置
  chooseLocation:function(e){
    console.log(e)
    wx.chooseLocation({
          success: (res)=>{
            // success
            console.log('选择的位置位置---')

            console.log(res)
            console.log(res.address)
            console.log(res.name)
			var newaddress = this.data.address
			newaddress.detail=res.address
            this.setData({
				address:newaddress
            //   hasLocation:true,
            //   location:{
            //     longitude:res.longitude,
            //     latitude:res.latitude
            //   }
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  },

	// 显示选项区域
	cascadePopup: function() {
		console.log('cascadePopup---')
		console.log(this.data.city)
		var animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'ease-in-out',
		});
		this.animation = animation;
		animation.translateY(-285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'show'
		});
	},
	// 隐藏选项区域
	cascadeDismiss: function () {
		this.animation.translateY(285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'hidden'
		});
	},
	// 选择province
	provinceTapped: function (e) {
		console.log('provinceTapped----')
		// 标识当前点击省份，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		console.log(index)
		// current为1，使得页面向左滑动一页至市级列表
		// provinceIndex是市区数据的标识
		this.setData({
			provinceName: this.data.province[index],
			regionName: '',
			townName: '',
			provinceIndex: index,
			cityIndex: -1,
			regionIndex: -1,
			townIndex: -1,
			region: [],
			town: []
		});
		var that = this;
		var lista=[];
		var City=ss.add[index].city
		// var lista = ss.add[index].city[0].area;
		for (var i in City) {
				lista.push(City[i].name)
			}
		
		console.log(lista)
		that.setData({
			cityName: '请选择',
			city: lista,
			current: 1
			//cityObjects: area
		});
	},
	// 选择city
	cityTapped: function (e) {
		console.log('cityTapped----')
		// 标识当前点击县级，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		// current为1，使得页面向左滑动一页至市级列表
		// cityIndex是市区数据的标识
		this.setData({
			cityIndex: index,
			regionIndex: -1,
			townIndex: -1,
			cityName: this.data.city[index],
			regionName: '',
			townName: '',
			town: []
		});
		this.setData({
				regionName: '请选择',
				region: ss.add[this.data.provinceIndex].city[this.data.cityIndex].area,
				current: 2
			});
			
	},
	// 选择region
	regionTapped: function(e) {
    	// 标识当前点击镇级，记录其名称与主键id都依赖它
    	var index = e.currentTarget.dataset.index;
    	// current为1，使得页面向左滑动一页至市级列表
    	// regionIndex是县级数据的标识
    	this.setData({
    		regionIndex: index,
    		townIndex: -1,
    		regionName: this.data.region[index],
    		townName: ''
    	});
		var areaSelectedStr = this.data.provinceName + this.data.cityName+this.data.regionName;
		this.setData({
			areaSelectedStr: areaSelectedStr
		});
		this.cascadeDismiss();
    },
    currentChanged: function (e) {
    	// swiper滚动使得current值被动变化，用于高亮标记
    	var current = e.detail.current;
    	this.setData({
    		current: current
    	});
    },
    changeCurrent: function (e) {
    	// 记录点击的标题所在的区级级别
    	var current = e.currentTarget.dataset.current;
    	this.setData({
    		current: current
    	});
    },

	// 提交
		formSubmit: function(e) {
		// user 
		// var user = AV.User.current();
		// detail
		var detail = e.detail.value.detail;
		// realname
		var realname = e.detail.value.realname;
		// mobile
		var mobile = e.detail.value.mobile;
		// 表单验证
		if (this.data.areaSelectedStr == '请选择省市区') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入区域!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                });    
                // return false;
			return;
		}
		if (detail == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请填写详情地址!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}
		if (realname == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请填写收件人!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}
		if(!(/^1[34578]\d{9}$/.test(mobile))){
			wx.showModal({    
                    title:'提示',    
                    content: '请填写正确手机号码!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}

	//新增
	if(!this.data.address.fitemid){
		console.log('新增-----')
			wx.request({
        url: h.main + '/Insertaddress',
			data: {
        sex: this.data.sex,
        mobile: e.detail.value.mobile,
        username: e.detail.value.realname,
				sblock:e.detail.value.detail,
        province: this.data.provinceName,
        city: this.data.cityName,
        region: this.data.regionName,
				oppenid: app.globalData.oppenid
			},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
			}, // 设置请求的 header
      success: (res) => {
				console.log(e.detail.value.realname)
				console.log(res.data)
				wx.showToast({
					title: '保存成功',
					duration: 500
				});
				// 等待半秒，toast消失后返回上一页
				setTimeout(function () {
					wx.navigateBack();
				}, 500);
			},
			fail: (res)=> {


			},
      complete: (res) => {

			}
		})
	}else{
		console.log('修改-----')
		wx.request({
      url: h.main + '/updateaddress',
			data: {
        fitemid: this.data.address.fitemid,
        sex: this.data.sex,
        mobile: e.detail.value.mobile,
        username: e.detail.value.realname,
        sblock: e.detail.value.detail,
        province: this.data.provinceName,
        city: this.data.cityName,
        region: this.data.regionName,
        oppenid: app.globalData.oppenid
			},
			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
				// 'Accept-Charset': 'GB2312,utf-8'
			}, // 设置请求的 header
			success: function (res) {
				console.log(res.data)
				wx.showToast({
					title: '保存成功',
					duration: 500
				});
				// 等待半秒，toast消失后返回上一页
				setTimeout(function () {
					wx.navigateBack();
				}, 500);
			},
			fail: function (res) {


			},
			complete: function (res) {

			}
		})

	}

	}
    
})

// yuanlai
//  const AV = require('../../../../utils/av-weapp.js')
//  import h from '../../../../utils/url.js'
//  import ss from '../../../../utils/add.js'
//  var app = getApp()
// Page({
// 	isDefault: false,
// 	data: {
// 		objectId:-1,
// 		id:'',
// 		current: 0,
// 		province: [],
// 		city: [],
// 		region: [],
// 		town: [],
// 		provinceObjects: [],
// 		cityObjects: [],
// 		regionObjects: [],
// 		townObjects: [],
// 		areaSelectedStr: '请选择省市区',
// 		maskVisual: 'hidden',
// 		provinceName: '请选择'
// 	},
// 	// getArea: function (pid, cb) {
// 	// 	var that = this;
// 	// 	// query area by pid
// 	// 	var query = new AV.Query('Area');
// 	// 	query.equalTo('pid', pid);
// 	// 	query.find().then(function (area) {
// 	// 		cb(area);
// 	// 	}, function (err) {
			
// 	// 	});
// 	// },
// 		onLoad: function (options) {
// 			var that = this;
// 			console.log(ss.add)
// 			var list = ss.add;
// 			var lista = [];
// 			for (var i in list) {
// 				lista.push(list[i].name)
// 			}
// 			that.setData({
// 				province: lista,
// 			})
// 			console.log(lista)
			
// 	},

	
// // 		loadAddress: function (options) {
// // 			var that =this
// // 		if (options.objectId != undefined) {

// // 			var storageAddr={}
// // 			var address = new AV.Object('Address');
// // 			wx.getStorage({
// // 				key: 'address',
// // 				success: function(res) {
// // 					storageAddr=res.data
// // 					console.log('storageAddr----- ')
// // 					console.log(storageAddr)
// // 		address.set('detail', storageAddr.sblock);
// // 		// set province city region
// // 		address.set('province',storageAddr.province);
// // 		address.set('city',storageAddr.city);
// // 		address.set('region',storageAddr.region);
// // 		address.set('town',storageAddr.town);
// // 		//address.set('user', storageAddr.username);
// // 		address.set('realname', storageAddr.username);
// // 		address.set('mobile', storageAddr.smobile);

// // console.log(address.attributes.realname)

// // 		that.setData({
// // 					address:address.attributes,
// // 					areaSelectedStr:address.attributes.province+address.attributes.city+address.attributes.region+address.attributes.town
// // 				});
// // 				console.log('loadAddress----- ')
// // 				console.log(address)
// // 		}
				
// // 			})
			 

// // 		}

		
	

// // 	},
// 	// loadAddress2: function (options) {

// 	// 	var that = this;
// 	// 	if (options.objectId != undefined) {
// 	// 	wx.request({
//     //         url: h.main+'/main/listByaddress.html',
//     //         data: {
// 	// 			saccountno:app.globalData.accountName
//     //             // oppen_id: app.globalData.oppenid
//     //         },
//     //         method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
//     //         header: {
//     //             'content-type': 'application/x-www-form-urlencoded',
//     //             'Accept': 'application/json',

//     //         },

//     //         success: function (res) {
// 	// 			console.log(res.data[options.objectId])
//     //             that.setData({
// 	// 				address: res.data[options.objectId],
// 	// 				areaSelectedStr:res.data[options.objectId].sarea
// 	// 			});
//     //         },
//     //         fail: function () {
//     //             // fail
//     //         },
//     //         complete: function () {
//     //             // complete
//     //         }
//     //         })
// 	// 	}
// 	// },
// 	// setDefault: function () {
// 	// 	var that = this;
// 	// 	var user = AV.User.current();
// 	// 	// if user has no address, set the address for default
// 	// 	var query = new AV.Query('Address');
// 	// 	query.equalTo('user', user);
// 	// 	query.count().then(function (count) {
// 	// 		if (count <= 0) {
// 	// 			that.isDefault = true;
// 	// 		}
// 	// 	});
// 	// },
// 	// 显示选项区域
// 	cascadePopup: function() {
// 		console.log('cascadePopup---')
// 		console.log(this.data.city)
// 		var animation = wx.createAnimation({
// 			duration: 500,
// 			timingFunction: 'ease-in-out',
// 		});
// 		this.animation = animation;
// 		animation.translateY(-285).step();
// 		this.setData({
// 			animationData: this.animation.export(),
// 			maskVisual: 'show'
// 		});
// 		// if(this.data.current!=0){
// 		// 		this.setData({
// 		// 			current: 1,
// 		// 		})
// 		// 	}
// 	},
// 	// 影藏选项区域
// 	cascadeDismiss: function () {
// 		this.animation.translateY(285).step();
// 		this.setData({
// 			animationData: this.animation.export(),
// 			maskVisual: 'hidden'
// 		});
// 	},
// 		provinceTapped: function (e) {
// 		console.log('provinceTapped----')
// 		// 标识当前点击省份，记录其名称与主键id都依赖它
// 		var index = e.currentTarget.dataset.index;
// 		console.log(index)
// 		// current为1，使得页面向左滑动一页至市级列表
// 		// provinceIndex是市区数据的标识
// 		this.setData({
// 			provinceName: this.data.province[index],
// 			regionName: '',
// 			townName: '',
// 			provinceIndex: index,
// 			cityIndex: -1,
// 			regionIndex: -1,
// 			townIndex: -1,
// 			region: [],
// 			town: []
// 		});
// 		var that = this;

// 		var lista;
// 		// var lista = ss.add[index].city[0].area;
// 		for (var i in ss.add[index].city) {
// 				lista.push(list[i].name)
// 			}
		
// 		console.log(lista)
// 		that.setData({
// 			cityName: '请选择',
// 			city: lista,
// 			current: 1
// 			//cityObjects: area
// 		});


// 	},
// 	cityTapped: function (e) {
// 		console.log('cityTapped----')
// 		// 标识当前点击县级，记录其名称与主键id都依赖它
// 		var index = e.currentTarget.dataset.index;
// 		// current为1，使得页面向左滑动一页至市级列表
// 		// cityIndex是市区数据的标识
// 		this.setData({
// 			cityIndex: index,
// 			regionIndex: -1,
// 			townIndex: -1,
// 			cityName: this.data.city[index],
// 			regionName: '',
// 			townName: '',
// 			town: []
// 		});
// 		var that = this;
// 		console.log(that.data.city)
// 		console.log(that.data.city[index].area)
// 		// that.setData({
// 		// 		regionName: '请选择',
// 		// 		region: that.data.city[index].area,
// 		// 		current: 2
// 		// 	});
// 			var areaSelectedStr = this.data.provinceName + this.data.cityName ;
// 		this.setData({
// 			areaSelectedStr: areaSelectedStr
// 		});
// 		this.cascadeDismiss();
// 	},
	
//     // regionTapped: function(e) {
//     // 	// 标识当前点击镇级，记录其名称与主键id都依赖它
//     // 	var index = e.currentTarget.dataset.index;
//     // 	// current为1，使得页面向左滑动一页至市级列表
//     // 	// regionIndex是县级数据的标识
//     // 	this.setData({
//     // 		regionIndex: index,
//     // 		townIndex: -1,
//     // 		regionName: this.data.region[index],
//     // 		townName: ''
//     // 	});
//     // 	var that = this;
//     // 	//townObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
//     // 	// getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
//     // 	this.getArea(this.data.regionObjects[index].get('aid'), function (area) {
// 	// 		// 假如没有镇一级了，关闭悬浮框，并显示地址
// 	// 		if (area.length == 0) {
// 	// 			var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
// 	// 			that.setData({
// 	// 				areaSelectedStr: areaSelectedStr
// 	// 			});
// 	// 			that.cascadeDismiss();
// 	// 			return;
// 	// 		}
// 	// 		var array = [];
// 	// 		for (var i = 0; i < area.length; i++) {
// 	// 			array[i] = area[i].get('name');
// 	// 		}
// 	// 		// region就是wxml中渲染要用到的县级数据，regionObjects是LeanCloud对象，用于县级标识取值
// 	// 		that.setData({
// 	// 			townName: '请选择',
// 	// 			town: array,
// 	// 			townObjects: area
// 	// 		});
// 	// 		// 确保生成了数组数据再移动swiper
// 	// 		that.setData({
// 	// 			current: 3
// 	// 		});
// 	// 	});
//     // },
//     // townTapped: function (e) {
//     // 	// 标识当前点击镇级，记录其名称与主键id都依赖它
//     // 	var index = e.currentTarget.dataset.index;
//     // 	// townIndex是镇级数据的标识
//     // 	this.setData({
//     // 		townIndex: index,
//     // 		townName: this.data.town[index]
//     // 	});
//     // 	var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName + this.data.townName;
//     // 	this.setData({
//     // 		areaSelectedStr: areaSelectedStr
//     // 	});
//     // 	this.cascadeDismiss();
//     // },
//     currentChanged: function (e) {
//     	// swiper滚动使得current值被动变化，用于高亮标记
//     	var current = e.detail.current;
//     	this.setData({
//     		current: current
//     	});
//     },
//     changeCurrent: function (e) {
//     	// 记录点击的标题所在的区级级别
//     	var current = e.currentTarget.dataset.current;
//     	this.setData({
//     		current: current
//     	});
//     },
// 		formSubmit: function(e) {
// 		// user 
// 		var user = AV.User.current();
// 		// detail
// 		var detail = e.detail.value.detail;
// 		// realname
// 		var realname = e.detail.value.realname;
// 		// mobile
// 		var mobile = e.detail.value.mobile;
// 		// 表单验证
// 		if (this.data.areaSelectedStr == '请选择省市区') {
// 			// wx.showToast({
// 			// 	title: '请输入区域'
// 			// });
// 			wx.showModal({    
//                     title:'提示',    
//                     content: '请输入区域!',    
//                     confirmColor:'#000',    
//                     showCancel: false,    
//                     success: function (res) {    
//                         if (res.confirm) {    
//                             //console.log('用户点击确定')    
//                         }    
//                     }    
//                 });    
//                 // return false;
// 			return;
// 		}
// 		if (detail == '') {
// 			// wx.showToast({
// 			// 	title: '请填写详情地址'
// 			// });
// 			wx.showModal({    
//                     title:'提示',    
//                     content: '请填写详情地址!',    
//                     confirmColor:'#000',    
//                     showCancel: false,    
//                     success: function (res) {    
//                         if (res.confirm) {    
//                             //console.log('用户点击确定')    
//                         }    
//                     }    
//                 }); 
// 			return;
// 		}
// 		if (realname == '') {
// 			// wx.showToast({
// 			// 	title: '请填写收件人'
// 			// });
// 			wx.showModal({    
//                     title:'提示',    
//                     content: '请填写收件人!',    
//                     confirmColor:'#000',    
//                     showCancel: false,    
//                     success: function (res) {    
//                         if (res.confirm) {    
//                             //console.log('用户点击确定')    
//                         }    
//                     }    
//                 }); 
// 			return;
// 		}
// 		if(!(/^1[34578]\d{9}$/.test(mobile))){ 
// 			// wx.showToast({
// 			// 	title: '请填写正确手机号码'
// 			// });
// 			wx.showModal({    
//                     title:'提示',    
//                     content: '请填写正确手机号码!',    
//                     confirmColor:'#000',    
//                     showCancel: false,    
//                     success: function (res) {    
//                         if (res.confirm) {    
//                             //console.log('用户点击确定')    
//                         }    
//                     }    
//                 }); 
// 			return;
// 		}
// 		// save address to leanCloud
// 		var address = new AV.Object('Address');
// 		// 如果是编辑地址而不是新增
// 		// if (this.data.address != undefined) {
// 		// 	address = this.data.address;
// 		// }
// 		// if isDefault address
		
		
// 		address.set('isDefault', this.isDefault);
// 		address.set('detail', detail);
// 		address.set('province', this.data.province[this.data.provinceIndex]);
// 		address.set('city', this.data.city[this.data.cityIndex]);
// 		address.set('region', this.data.region[this.data.regionIndex]);
// 		address.set('town', this.data.town[this.data.townIndex]);
// 		address.set('user', user);
// 		address.set('realname', realname);
// 		address.set('mobile', mobile);
		
// 		var that = this;
// 		address.save().then(function (address) {
// 			// that.setData('address', address);
// 			wx.showToast({
// 				title: '保存成功',
// 				duration: 500
// 			});
// 			// 等待半秒，toast消失后返回上一页
// 			setTimeout(function () {
// 				wx.navigateBack();
// 			}, 500);
// 		}, function (error) {
// 			console.log(error);
// 		});
// 		console.log('typeof------')
// 	console.log(this.data.townName=='')
// 	console.log(this.data.townName)
// 	//新增
// 	if(this.data.objectId==-1){
// 			wx.request({
// 				url: h.main + '/page/upuser.html',
// 			data: {
// 				username: e.detail.value.realname,
// 				smobile: e.detail.value.mobile,
// 				sblock:e.detail.value.detail,
// 				// sarea: this.data.areaSelectedStr,
// 				province: that.data.provinceName,
// 				city: that.data.cityName,
// 				region: that.data.regionName,
// 				town:that.data.townName,
// 				saccountno:app.globalData.accountName,
// 				// oppen_id: app.globalData.oppenid
// 			},
// 			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
// 			header: {
// 				'content-type': 'application/x-www-form-urlencoded',
// 				'Accept': 'application/json',
// 				// 'Accept-Charset': 'GB2312,utf-8'
// 			}, // 设置请求的 header
// 			success: function (res) {
// 				console.log(e.detail.value.realname)
// 				console.log(res.data)
// 				wx.showToast({
// 					title: '保存成功',
// 					duration: 500
// 				});
// 				// 等待半秒，toast消失后返回上一页
// 				// setTimeout(function () {
// 				// 	wx.navigateBack();
// 				// }, 500);
// 			},
// 			fail: function (res) {


// 			},
// 			complete: function (res) {

// 			}
// 		})
// 	}else{
// 		console.log('address edit----')
// 		console.log(that.data.provinceName)
// 		console.log(that.data.address.province)
// 		wx.request({
// 				url: h.main + '/page/upuser1.html',
// 			data: {
// 				username: e.detail.value.realname,
// 				smobile: e.detail.value.mobile,
// 				sblock:e.detail.value.detail,
// 				// sarea: this.data.areaSelectedStr,
// 				province: that.data.provinceName=='请选择'?that.data.address.province:that.data.provinceName,
// 				city: that.data.cityName?that.data.cityName:that.data.address.city,
// 				region: that.data.regionName?that.data.regionName:that.data.address.region,
// 				town:that.data.townName?that.data.townName:that.data.address.town,
// 				// province: that.data.provinceName,
// 				// city: that.data.cityName,
// 				// region: that.data.regionName,
// 				// town:that.data.townName,
// 				saccountno:app.globalData.accountName,
// 				// oppen_id: app.globalData.oppenid,
// 				id:this.data.id
// 			},
// 			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
// 			header: {
// 				'content-type': 'application/x-www-form-urlencoded',
// 				'Accept': 'application/json',
// 				// 'Accept-Charset': 'GB2312,utf-8'
// 			}, // 设置请求的 header
// 			success: function (res) {
// 				console.log(res.data)
// 				wx.showToast({
// 					title: '保存成功',
// 					duration: 500
// 				});
// 				// 等待半秒，toast消失后返回上一页
// 				// setTimeout(function () {
// 				// 	wx.navigateBack();
// 				// }, 500);
// 			},
// 			fail: function (res) {


// 			},
// 			complete: function (res) {

// 			}
// 		})

// 	}

// 	}
    
// })

