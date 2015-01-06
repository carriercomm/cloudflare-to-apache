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

# Usage

## Simple 

```bash
npm i -g cloudflare-to-apache
cloudflare-to-apache < inpuFile > outputFile
```

## Manual

```bash
node index < $inputFile > $outputFile
```

## Outputting to a file

```bash
DEBUG=* node index apache.log < $inputFile
```

`DEBUG=*` outputs debug information to the terminal.

# Status

[![Build Status](https://secure.travis-ci.org/surevine/cloudflare-to-apache.svg)](http://travis-ci.org/surevine/cloudflare-to-apache)

[![Dependency Status](https://david-dm.org/surevine/cloudflare-to-apache.svg)](https://david-dm.org/surevine/cloudflare-to-apache)