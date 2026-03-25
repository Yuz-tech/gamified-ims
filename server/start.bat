batch@echo off
echo Starting...
echo.

cd /d %~dp0

if not exist .env (
    echo ERROR: .env file not found!
    pause
    exit
)

echo Starting MongoDB...
REM net start MongoDB

node server.js

pause

bash#!/bin/bash

cd "$(dirname "$0")"

if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    exit 1
fi

node server.js