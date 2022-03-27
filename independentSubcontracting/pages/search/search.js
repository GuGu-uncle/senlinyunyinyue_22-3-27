import request from '../../../utils/request'

let isSend=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'',//placeholder的内容
    hotList:[],//热搜榜数据
    searchContent:'',//用户输入的表单项内容
    searchList:[],//关键字模糊匹配的数据
    historyList:[],//历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化的数据
    this.getInitData()
    // 读取搜索历史记录
    this.getSearchHistory()
  },

  // 获取初始化的数据的回调
  async getInitData(){
    let placeholderData=await request('/search/default')
    let hotListData=await request('/search/hot/detail')
    this.setData({
      placeholderContent:placeholderData.data.showKeyword,
      hotList:hotListData.data
    })
  },
  // 读取本地搜索历史记录的功能函数
  getSearchHistory(){
    let historyList=wx.getStorageSync('historyList')
    if(historyList){
      this.setData({
        historyList
      })
    }
  },
  // 表单项内容发生改变的回调
  handleInputChange(event){
    this.setData({
      searchContent:event.detail.value.trim()
    })
    // 发送请求获取关键字模糊匹配的数据(防抖)
    clearTimeout(isSend)
    this.getSearchList()
  },
  // 获取搜索数据的功能函数
  getSearchList(){
    isSend=setTimeout(async()=>{
      if(!this.data.searchContent){
        this.setData({
          searchList:[]
        })
        return
      }
      let {searchContent,historyList}=this.data
      let searchListData=await request("/search",{keywords:searchContent,limit:10})
      // 将搜索的关键字添加到搜索历史中
      let index=historyList.indexOf(searchContent)
      if(index!==-1){
        historyList.splice(index,1)
      }
      historyList.unshift(searchContent)
      this.setData({
        searchList:searchListData.result.songs,
        historyList
      })
      wx.setStorageSync('historyList', historyList)
    },300)
  },
  // 清空搜索内容
  clearSearchContent(){
    this.setData({
      searchContent:''
    })
  },
  // 删除搜索历史记录
  deleteSearchHistory(){
    // 询问是否删除搜索历史记录
    wx.showModal({
      title:'是否删除搜索历史记录？',
      success:(res)=>{
        if(res.confirm){
          // 移除本地的搜索历史记录缓存
          wx.removeStorageSync('historyList')
          // 清空data中的historyList
          this.setData({
            historyList:[]
          })
        }
      }
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