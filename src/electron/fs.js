const { promisify } = require('util')
const fs = require('fs')

module.exports = Object.keys(fs).reduce((acc, fn) => {
  if (fn.match(/(stream|sync)/gi)) {
    acc[fn] = fs[fn]
  } else {
    try {
      acc[fn] = promisify(fs[fn])
    } catch (err) {
      acc[fn] = fs[fn]
    }
  }
  return acc
}, {})
