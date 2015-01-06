var Transform = require('stream').Transform
require('colors')

var getFormattedDate = function(date) {
    var months = [ 0, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev' ]
    var month = months[date.getMonth()]
    /* Assuming a UTC timestamp in logs */
    var timezone = '+0000'
    
    return [
      date.getDate(),
      '/',
      month,
      '/',
      date.getFullYear(),
      ':',
      (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
      ':',
      date.getUTCMinutes(),
      ':',
      (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds(),
      ' ',
      timezone
    ].join('')
}

var writeApacheFormat = function(transformed) {
  return [
      transformed.ip,
      ' - - [',
      getFormattedDate(transformed.date),
      '] "',
      transformed.request,
      '" ',
      transformed.responseCode,
      ' - "',
      transformed.referrer,
      '" "',
      transformed.userAgent,
      '"\n'
  ].join('')
}

var transformRecord = function(record) {
    var transformed = {}
    var initialPart = record.split(' ', 3)
    if (initialPart.length < 3) {
      return
    }
    transformed.host = initialPart[0]
    transformed.ip = initialPart[1]
    transformed.date = new Date(parseInt(initialPart[2]) * 1000)
    transformed.rawTimestamp = parseInt(initialPart[2])
    var nextPart =  /^"(.*)" ([0-9]*) ([0-9]*) "(.*)" "(.*)" "(.*)"$/
      .exec(record.substring(initialPart.join(' ').length + 1))

    if (nextPart) {
      transformed.request = nextPart[1]
      transformed.responseCode = parseInt(nextPart[2])
      transformed.responseTime = parseInt(nextPart[3])
      transformed.userAgent = nextPart[4]
      transformed.bot = nextPart[5]
      transformed.referrer = nextPart[6]
      nextPart = null
      initialPart = null
    }
    return writeApacheFormat(transformed)
}

var parser = new Transform();
parser._transform = function(records, encoding, done) {
  records.toString('utf8').split('\n').forEach(function(record) {
      this.push(transformRecord(record))
  }, this)
  done()
}

process.stdin
  .pipe(parser)
  .pipe(process.stdout)