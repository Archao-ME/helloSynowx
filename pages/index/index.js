//index.js
//获取应用实例
const app = getApp()
const Circles = require('../../utils/Circles')
const AV = require('../../utils/AV')
const API = require('../../utils/API')
const util = require('../../utils/util')

Page({
  data: {
    motto: 'Hello Syno',
    userInfo: {},
    myLocation: {},
    circles: [],
    circlesList: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pointContent: '',
    leanApi: null
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
    const Api = new API()
    this.leanApi = Api.init()
    this.myMap = wx.createMapContext('myMap', this)
    let query = new this.leanApi.Query('Circles')
    let that = this
    query.descending('createdAt').find().then( res => {
      let newCircles = []
      res.forEach((item) => {
        newCircles.push(item.attributes)
      })
      newCircles.map((item) => {
        item.time = util.formatTime(new Date(item.time))
        return item
      })
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
    let circles = event.currentTarget.dataset.circles
    console.log('circles', circles)
    this.setData({
      circles: [circles]
    })
    this.setData({
      myLocation: circles
    })
  },
  savePoint () {
    let that = this
    this.getMyLocation().then((res) => {
      let circlesApi = new Circles()
      let time = new Date().getTime()
      let newCircle = {
        latitude: res.latitude,
        longitude: res.longitude,
        radius: 100,
        fillColor: "#ffffffFA"
      }
      circlesApi.set('time', time)
      circlesApi.set('pointContent', that.data.pointContent)
      circlesApi.set('circles', newCircle)
      circlesApi.save().then((saveres) => {
        let newCircles = [{
          time: time,
          pointContent: that.data.pointContent,
          circles: newCircle
        }].concat(that.data.circlesList)
        newCircles.map((item) => {
          item.time = util.formatTime(new Date(item.time))
          return item
        })
        this.setData({circlesList: newCircles})
        that.setData({pointContent: ''})
        that.setData({
          myLocation: saveres
        })
        console.log('this.data.circlesList', this.data.circlesList)
      }, (err) => {
        console.log('save failds err', err)
      })
    })
  }
})
