#!/bin/sh
cd gh-pages/travelersleaderboard
cp ../../history.txt history.txt
git add history.txt
git commit -m "update history"
git push