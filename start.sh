#!/bin/sh
set -e

cd backend
dune build bin/main.exe
./_build/default/bin/main.exe
