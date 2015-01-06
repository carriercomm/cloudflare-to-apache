Cloudflare to Apache
=====================

A small script to convert [Cloudflare](http://www.cloudflare.com) log format to match that of [Apache](http://httpd.apache.org). So you can import the logs into things like [Piwik](http://piwik.org).

# Cloudflare format

```
host<space>IP<space>Request timestamp<space>"Request"<space>Response code<space>Response time<space>"User Agent"<space>"Bot?"<space>"Referrer"
```

# Apache format

```
IP - - [Request date string]<space>"Request"<space>Response code<space>-<space>"Referrer"<space>"User agent"
```

# Easy usage

```bash
npm i -g cloudflare-to-apache
cloudflare-to-apache < inpuFile > outputFile
```

# Usage

```bash
node index < $inputFile > $outputFile
```

# Status

[![Dependency Status](https://david-dm.org/surevine/cloudflare-to-apache.svg)](https://david-dm.org/surevine/cloudflare-to-apache)