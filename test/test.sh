#!/usr/bin/env bash

echo 'Running tests for old format data files'
echo ''

node index -f old < test/input.old.log > test/output.old.log 

echo "Generated output file with "
wc -l test/output.old.log
echo "lines"

if [[ -n $(diff --strip-trailing-cr test/output.old.log test/correct-output.old.log) ]]; 
then
  echo 'Fail';
  diff --strip-trailing-cr test/output.old.log test/correct-output.old.log;
  exit 1;
else 
  echo 'Pass';
  exit 0;
fi;
