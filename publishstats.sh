#!/bin/sh
cd gh-pages/travelersleaderboard
cp ../../history.txt historyraw.txt
node historyfilter.js
git add --all
git commit -m "update history" --author="Leaderboard Bot <lbot@pfg.pw>"
git push
