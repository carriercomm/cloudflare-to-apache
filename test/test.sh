#!/usr/bin/env bash

node index < test/input.log > test/output.log 

if [[ -n $(diff test/output.log test/correct-output.log) ]]; 
then
  echo 'Fail';
  diff test/output.log test/correct-output.log;
  exit 1;
else 
  echo 'Pass';
  exit 0;
fi;