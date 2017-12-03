//index.js
//获取应用实例
const app = getApp()
const Circles = require('../../utils/Circles')
const AV = require('../../utils/AV')

Page({
  data: {
    motto: 'Hello Syno',
    userInfo: {},
    myLocation: {},
    circles: [],
    circlesList: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pointContent: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.getLocation({
      success: (res) => {
        this.setData({
          myLocation: res
        })
      }
    })
  },
  onReady: function() {
    AV.init({
      appId: 'xxx',
      appKey: 'xxx'
    })
    this.myMap = wx.createMapContext('myMap', this)
    let query = new AV.Query('Circles')
    let that = this
    query.descending('createdAt').find().then( res => {
      let newCircles = []
      res.forEach((item) => {
        newCircles.push(item.attributes)
      })
      console.log('newCircles', newCircles)
      this.setData({circlesList: newCircles})
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getMyLocation: function(e) {
    return new Promise(function(resolve, reject){
      wx.getLocation({
        success: function (res) {
          resolve(res)
        }
      })
    })
  },
  updateInput ({detail:{value}}) {
    this.setData({pointContent: value})
  },
  markCircle (event) {
    console.log('event', event)
    let circles = event.currentTarget.dataset.circles
    this.setData({
      circles: [circles]
    })
    this.setData({
      myLocation: circles[0] || circles
    })
  },
  savePoint () {
    let that = this
    this.getMyLocation().then((res) => {
      let circlesApi = new Circles()
      let newCircles = {
        latitude: res.latitude,
        longitude: res.longitude,
        radius: 100,
        fillColor: "#ffffffFA"
      }
      let time = new Date().getTime()
      circlesApi.set('time', time)
      circlesApi.set('pointContent', that.data.pointContent)
      circlesApi.set('circles', newCircles)
      circlesApi.save().then((res) => {
        that.setData({
          circlesList: [{
            time: time,
            pointContent: that.data.pointContent,
            circles: [newCircles]
          }].concat(that.data.circlesList)
        })
        that.setData({pointContent: ''})
        that.setData({
          myLocation: res
        })
      }, (err) => {
        console.log('save failds err', err)
      })
    })
  }
})
