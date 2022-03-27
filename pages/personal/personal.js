import request from "../../utils/request"
let startY=0;//手指开始的位置
let moveY=0;//手指移动后的位置
let moveDistance=0;//手指移动的距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:"translateY(0rpx)",
    coverTransition:"",
    userInfo:{},//用户信息
    recentPlayList:[]//用户的播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let userInfo=wx.getStorageSync("userInfo")
    if(userInfo){
      userInfo=JSON.parse(userInfo)
      this.setData({
        userInfo
      })
      // 获取用户的播放记录
      this.getUserRecentPlayList(userInfo.userId,0)
    }
  },

  // 获取用户播放记录的功能函数
  async getUserRecentPlayList(userId,type){
    let recentPlayListData=await request("/user/record",{uid:userId,type})
    let index=0
    let recentPlayList=recentPlayListData.allData.slice(0,5).map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },

  // 跳转到登录界面
  toLogin(){
    wx.navigateTo({
      url:"/pages/login/login"
    })
  },
  // 手指触摸动作开始的回调
  handleTouchStart(event){
    // 获取第一根手指的起始纵坐标
    startY=event.touches[0].pageY
    this.setData({
      coverTransition:''
    })
  },
  // 手指触摸后移动的回调
  handleTouchMove(event){
    moveY=event.touches[0].pageY
    moveDistance=moveY-startY
    if(moveDistance<=80&&moveDistance>0){
      this.setData({
        coverTransform:`translateY(${moveDistance}rpx)`
      })
    }
  },
  // 手指触摸动作结束的回调
  handleTouchEnd(){
    this.setData({
      coverTransform:"translateY(0rpx)",
      coverTransition:'1s linear'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})