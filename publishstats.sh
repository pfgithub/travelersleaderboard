#!/bin/sh
cd gh-pages/travelersleaderboard
cp ../../history.txt history.txt
git reset --soft HEAD~1
git add --all
git commit -m "update history"
git push --force
