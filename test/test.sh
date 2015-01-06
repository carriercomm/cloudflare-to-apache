#!/usr/bin/env bash

node index < test/input.log > test/output.log 

echo "Generated output file with "
wc -l test/output.log
echo "lines"

if [[ -n $(diff --strip-trailing-cr test/output.log test/correct-output.log) ]]; 
then
  echo 'Fail';
  diff --strip-trailing-cr test/output.log test/correct-output.log;
  exit 1;
else 
  echo 'Pass';
  exit 0;
fi;