import PubSub from "pubsub-js"
import moment from "moment"
import request from "../../../utils/request"
let BackgroundAudioManager=wx.getBackgroundAudioManager()
let musicId//当前歌曲的id
// let InnerAudioContext=wx.createInnerAudioContext()
// 获取全局实例
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//判断是否播放音乐
    song:{},//歌曲详情
    musicUrl:'',//音乐的链接
    currentTime:"00:00",//实时时间
    durationTime:"00:00",//总时长
    currentWidth:'0rpx'//进度条实时长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    musicId=options.songId
    // options用于接受路由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
    // 获取歌曲详情
    this.getSongInfo(musicId)
    // 监听背景音乐播放的回调
    BackgroundAudioManager.onPlay(()=>{
      this.changePlayState(true)
      // 修改全局音乐id
        appInstance.globalData.musicId=musicId
      // 修改全局音乐播放状态
      appInstance.globalData.isMusicPlay=true
    })
    // 监听背景音乐暂停的回调
    BackgroundAudioManager.onPause(()=>{
      this.changePlayState(false)
      // 修改全局音乐播放状态
      appInstance.globalData.isMusicPlay=false
    })
    // 监听背景音乐停止的回调
    BackgroundAudioManager.onStop(()=>{
      this.changePlayState(false)
    })
    // 监听歌曲实时的播放进度
    BackgroundAudioManager.onTimeUpdate(()=>{
      let currentTime=BackgroundAudioManager.currentTime
      let currentWidth=currentTime/BackgroundAudioManager.duration*400+"rpx"
      currentTime=moment(currentTime*1000).format("mm:ss")
      // 当前页面歌曲与正在播放歌曲一致则实时时间变化
      if(musicId==appInstance.globalData.musicId){
        this.setData({
          currentTime,
          currentWidth
        })
      }
    })
    // 监听歌曲自然播放结束
    BackgroundAudioManager.onEnded(()=>{
      // 自动切换至下一首歌曲并自动播放
      PubSub.publishSync('switchType', "next");
      // 将实时的时间跟进度条长度置为0
      this.setData({
        currentTime:'00:00',
        currentWidth:"0rpx"
      })
    })
    // 订阅recommendSong发布的消息，接受歌曲id
    //订阅{事件名：[回调]}数组中可以存多个回调
    PubSub.subscribe("songId",(msg,songId)=>{
      // 修改全局的歌曲id
      appInstance.globalData.musicId=songId
      // 修改当前歌曲的id
      musicId=songId
      // 修改全局音乐播放状态
      appInstance.globalData.isMusicPlay=true
      this.getSongInfo(songId)
    })
  },

  // 修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
  },

  // 获取歌曲详情的功能函数
  async getSongInfo(songId){
    let songDetailData=await request("/song/detail",{ids:songId})
    this.setData({
      song:songDetailData.songs[0]
    })
    // 动态修改窗口的标题
    wx.setNavigationBarTitle({
      title:this.data.song.name
    })
    // 获取音乐链接的功能函数
    let musicUrlData=await request("/song/url",{id:songId})
    this.setData({
      musicUrl:musicUrlData.data[0].url
    })
    // 判断当前页面音乐是否在播放,是则继续播放
    if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId==songId){
      this.setData({
        isPlay:true
      })
    }
    //如果是切换的歌曲则直接播放
    if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId==songId){
      this.musicControl(true)
    }
    // 修改歌曲总时长
    let durationTime=moment(this.data.song.dt).format("mm:ss")
    this.setData({
      durationTime
    })
  },

  // 点击播放/暂停的回调
  handelMusicPlay(){
    if(this.data.musicUrl){
      this.musicControl(!this.data.isPlay)
    }
  },
  // 控制音乐播放/暂停的功能函数
  musicControl(isPlay){
    if(isPlay){//播放
      BackgroundAudioManager.src=this.data.musicUrl//音乐链接
      BackgroundAudioManager.title=this.data.song.name//音乐名字
      BackgroundAudioManager.play()
    }else{//暂停播放
      BackgroundAudioManager.pause()
    }
  },
  
  // 切换歌曲
  handleSwitch(event){
    let type=event.currentTarget.id
    // 关闭当前的音乐
    BackgroundAudioManager.stop()
    // 发布消息
    PubSub.publishSync('switchType', type);
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
    // 取消订阅
    PubSub.unsubscribe("songId")
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