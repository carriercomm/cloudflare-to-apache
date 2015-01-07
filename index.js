var Transform = require('stream').Transform || require('readable-stream').Transform 
  , log = require('debug')('index')
  , fs = require('fs')
  , argv = require('minimist')(process.argv.slice(2))

require('colors')

var totalRecords = 0
var dataFormat = 'new'
var hangover = null

if (argv.f && ('old' === argv.f.toLowerCase())) {
  dataFormat = 'old'
}

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
  if (hangover) {
      record = hangover + record
      log('Appending hangover, record now:\n' + record)
      hangover = null
  }
  var initialPart = record.split(' ', 3)
  if (initialPart.length < 3) {
    hangover = record
    throw new Error('Initial part not 3 records long! ' + initialPart.length)
  }
  transformed.host = initialPart[0]
  transformed.ip = initialPart[1]
  transformed.date = new Date(parseInt(initialPart[2]) * 1000)
  transformed.rawTimestamp = parseInt(initialPart[2])
  var nextPart =  /^"(.*)" ([0-9]*) ([0-9]*) "(.*)" "(.*)" "(.*)"$/
    .exec(record.substring(initialPart.join(' ').length + 1))

  if (!nextPart) {
    hangover = record
    throw new Error('Could not transform record: ' + record)
  }
  transformed.request = nextPart[1]
  transformed.responseCode = parseInt(nextPart[2])
  transformed.responseTime = parseInt(nextPart[3])
  transformed.userAgent = nextPart[4]
  transformed.bot = nextPart[5]
  transformed.referrer = nextPart[6]
  nextPart = null
  initialPart = null
  return writeApacheFormat(transformed)
}

var parser = new Transform()
parser._transform = function(records, encoding, done) {
  var recordSet = records.toString('utf8').split('\n')
  log(recordSet.length + ' records in this set')
  recordSet.forEach(function(record) {
    try {
      this.push(transformRecord(record))
      ++totalRecords
    } catch (e) {
      log(e.message)
    }
  }, this)
  done()
}

var writeStream = process.stdout

if (argv._[0]) {
  log('Outputting to file ' + argv._[0])
  writeStream = fs.createWriteStream(argv._[0])
}

process.stdin.setEncoding('utf8')

process.stdin
  .pipe(parser)
  .pipe(writeStream)
  .on('finish', function() {
    log(('Done, total records ' + totalRecords).green)
    process.exit(0)
  })
