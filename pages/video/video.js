import request from "../../utils/request"
let videoContext
let timeout
let tip=false//提示框状态
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,//判断用户是否登录
    videoGroupList:[],//导航标签数据
    navId:"",//导航标识
    videoList:[],//视频列表数据
    videoId:'',//视频id标识
    videoUpdateTime:[],//video播放的时长
    isTriggered:false,//视频列表下拉是否被触发
    vid:'',//记录所点击的视频的id
    seek:{}//获取当前点击视频的上一次播放时长
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据(登录后才能获取) 
    if(wx.getStorageSync("userInfo")){
      this.setData({
        isLogin:true
      })
      this.getVideoGroupListData("/video/group/list")
    }
  },
  // 去登录
  toLogin(){
    wx.navigateTo({
      url:"/pages/login/login"
    })
  },
  // 获取导航数据
  async  getVideoGroupListData(url){
    let videoGroupListData=await request(url)
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId:videoGroupListData.data[0].id
    })
    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId){
    let videoListData=await request('/video/group',{id:navId})
    
    tip=false
    // 加id属性
    let index=1
    let videoList=videoListData.datas.map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      videoList,
      isTriggered:false//关闭视频列表下拉刷新
    })
  },
  // 点击切换导航的回调
  changeNav(event){
    this.setData({
      videoId:''
    })
    // 通过id向event传参时，如果传的是number会自动转换为string
    // 通过data-xxx的形式传参时，类型不变
    let navId=event.target.id//类型为string
    this.setData({
      navId:navId>>>0//右移0位
    })
    // 清空视频列表
    this.setData({
      videoList:[]
    })
    // 显示提示框
    wx.showLoading({title:"加载中，请稍等！"})
    tip=true
    // 动态获取当前导航对应的视频数据
    this.getVideoList(event.target.id)
    // 关闭提示框
    setTimeout(()=>{
      wx.hideLoading({noConflict:tip})
    },0)
  },
  // 视频点击播放、继续播放的回调
  handlePlay(event){
    /**
     * 问题：多个视频可以同时播放
     * 需求
     *  1.在点击播放的事件中找到上一个播放的视频
     *  2.在播放新的视频之前关闭上一个正在播放的视频
     */
      // 关闭上一个视频
    // vid!=event.currentTarget.id&&videoContext&&videoContext.pause()
    this.setData({
      vid:event.currentTarget.id,
    })
    // 创建一个控制video标签的实例对象
    videoContext=wx.createVideoContext(event.currentTarget.id,this)
    // 跳到上一次播放的位置
    let {videoUpdateTime}=this.data
    let videoItem=videoUpdateTime.find(item=>item.id===event.currentTarget.id)
    if(videoItem){
      this.setData({
        seek:{
          currentTime:videoItem.currentTime,
          id:event.currentTarget.id
        }
      })
      // videoContext.seek(Math.floor(videoItem.currentTime))
    }
    this.setData({
      videoId:event.currentTarget.id// 点击将image图片切换为video标签
    })
    // 播放视频
    // videoContext.play()
  },
  // 监视视频播放进度的回调
  handleTimeUpdate(event){
    let {videoUpdateTime}=this.data
    let videoTimeObj={id:event.currentTarget.id,currentTime:event.detail.currentTime}
    /**
     * 思路：判断记录播放时长的videoUpdateTime数组中是否存在当前视频的播放记录
     *    1.如果有，在原有的记录上修改播放时长
     *    2.如果没有，在数组中添加当前视频的播放对象
     */
    let videoItem=videoUpdateTime.find(item=>videoTimeObj.id===item.id)
    if(videoItem){
      console.log(videoTimeObj.currentTime)
      videoItem.currentTime=videoTimeObj.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }
    // 统一更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束时的回调
  handleEnded(event){
    // vid=event.currentTarget.id
    let {videoUpdateTime}=this.data
    let index=videoUpdateTime.findIndex(item=>item.id===this.data.vid)
    // 移除记录播放时长数组中当前视频的对象
    videoUpdateTime.splice(index,1)
    // 更新数组
    this.setData({
      videoUpdateTime
    })
  },
  // 自定义视频列表下拉的回调
  async handleRefresher(){
    this.getVideoList(this.data.navId)
  },
  // 自定义视频列表上拉触底的回调
  handleToLower(){
    // 数据分页：前端分页、后端分页
    console.log("发送请求||在前端截取最新的数据，追加到视频列表的后方")
    console.log("网易云音乐在暂时没有提供分页的api")
    /**
     * 模拟数据
     *    let newVideoList=[...]
     *    let videoList=this.data.videoList
     *    将视频最新的数据添加到原有的视频数据列表中
     *    videoList.push(...newVideoList)
     *    this.setData({
     *      videoList
     *    })
     */
  },
  // 跳转到search页面
  toSearch(){
    console.log(111)
    wx.navigateTo({
      url:"/independentSubcontracting/pages/search/search"
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
    console.log("页面的下拉刷新")
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面的上拉触底")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    if(from==="menu"){
      return {
        title:"menu",
        path:"/pages/video/video",
        imageUrl:"/static/images/nvsheng.jpg"
      }
    }else{
      return {
        title:"button",
        path:"/pages/video/video",
        imageUrl:"/static/images/nvsheng.jpg"
      }
    }
  }
})