import PubSub from "pubsub-js"
import request from "../../../utils/request"
let songId
let index
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:'',//月
    day:'',//天
    recommendList:[]//推荐歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否已经登录
    let userInfo=wx.getStorageSync("userInfo")
    if(!userInfo){
      wx.showToast({
        title:"请先登录！",
        icon:"none",
        success:()=>{
          setTimeout(()=>{
            wx.redirectTo({
              url:"/pages/login/login"
            })
            return
          },2000)
        }
      })
    }
    // 更新日期
    this.setData({
      month:new Date().getMonth()+1,
      day:new Date().getDate()
    })
    // 获取推荐歌曲
    this.getRecommendList()
    // 订阅消息
    PubSub.subscribe('switchType', (msg,type)=>{
      if(type==="pre"){//上一首
        if(index!=0){
          songId=this.data.recommendList[index-1].id
          index--
        }
      }else{//下一首
        if(index!=29){
          songId=this.data.recommendList[index+1].id
          index++
        }
      }
      //将id赋值给songId回传给songDetail页面
      PubSub.publishSync("songId",songId)
    })
  },
  // 获取用户每日推荐的回调
  async getRecommendList(){
    let recommendListData=await request("/recommend/songs")
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
  // 跳转到songDetail界面
  toSongDetail(event){
    if(event){
      index=event.currentTarget.dataset.index
      songId=event.currentTarget.dataset.songId
    }
    // 路由跳转传参：支持query参数
    wx.navigateTo({
      url:`/conventionalSubcontracting/pages/songDetail/songDetail?songId=${songId}`
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
    //取消订阅
    PubSub.unsubscribe("switchType")
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