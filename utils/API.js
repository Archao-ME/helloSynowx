const AV = require('./AV.js')

class API {
  constructor() {
    console.log('init API')
  }
  init() {
    return AV.init({
      appId: 'l3d8zs0MsW8UMg4RWWcw39CU-gzGzoHsz',
      appKey: 'Fke3tXfc0Hjzlv8h9ko1fY1U',
    })
  }
}