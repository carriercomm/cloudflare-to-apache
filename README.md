Cloudflare to Apache
=====================

A small script to convert [Cloudflare](http://www.cloudflare.com) log format to match that of [Apache](http://httpd.apache.org). So you can import the logs into things like [Piwik](http://piwik.org).

# Cloudflare format

host<space>IP<space>Request timestamp<space>"Request"<space>Response code<space>Response time<space>"User Agent"<space>"Unknown"<space>"Referrer"

# Apache format

IP - - [Request date string]<space>"Request"<space>Response code<space>-<space>"Referrer"<space>"User agent"

# Usage

```
node index < $inputFile > $outputFile
```
