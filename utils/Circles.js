const AV = require('./AV.js')

class Circles extends AV.Object {
  constructor () {
    super()
    console.log('constructor circles')
  }
  getAV () {
    return AV
  }
}

AV.Object.register(Circles)

module.exports = Circles