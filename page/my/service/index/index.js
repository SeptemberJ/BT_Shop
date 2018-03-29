var app = getApp()
Page( {
  data: {
    name:'',
    tel:'',
    cont:'',
    addr:'',
    loadingHidden:true

  },

  onLoad: function() {
    
   
  },
  changeName: function(e){
    this.setData({
      name:e.detail.value
    })
  },
  changeTel: function(e){
    this.setData({
      tel:e.detail.value
    })
  },
  changeCont: function(e){
    this.setData({
      cont:e.detail.value
    })
  },
  changeAddr: function(e){
    this.setData({
      addr:e.detail.value
    })
  },
  goHistory: function(){
    wx.navigateTo({
      url: '../history/index'
    })
  },
  
  submitService: function(){
    if (this.data.name == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入姓名!',    
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
    if(!(/^1[34578]\d{9}$/.test(this.data.tel))){
			wx.showModal({    
                    title:'提示',    
                    content: '请输入正确的联系电话!',    
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
		if (this.data.cont == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入服务项目!',    
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
    if (this.data.addr == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请输入联系地址!',    
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
    console.log(this.data.name)
    console.log(this.data.tel)
    console.log(this.data.cont)
    console.log(this.data.addr)

  }

})