import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//轮播图数据
    recommendList:[],//推荐歌单数据
    topList:[]//排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // 获取轮播图数据
    let bannerListDate=await request('/banner',{type:2})
    // console.log("bannerListDate:",bannerListDate)
    // 获取推荐歌单数据
    let recommendListDate=await request('/personalized?limit=8')
    // 获取排行榜数据
    let topListData=await request('/toplist/detail')
    this.setData({
      bannerList:bannerListDate.banners,
      recommendList:recommendListDate.result,
      topList:topListData.list.slice(0,4)
    })
    
    // console.log("recommendList:",this.data.recommendList)
  },

  // 跳转到recommendSong页面的回调
  toRecommendSong(){
    wx.navigateTo({
      url:"/conventionalSubcontracting/pages/recommendSong/recommendSong"
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