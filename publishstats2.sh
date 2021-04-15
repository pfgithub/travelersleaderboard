rm -rf gh-pages/travelersleaderboard/
mkdir -p gh-pages/travelersleaderboard/
cp -r static/. gh-pages/travelersleaderboard/
cp history.txt gh-pages/travelersleaderboard/historyraw.txt
cd gh-pages/travelersleaderboard/
git init
node ../../historyfilter.js
git remote add origin https://github.com/pfgithub/travelersleaderboard.git
git add --all
git commit -m "update history" --author="Leaderboard Bot <lbot@pfg.pw>"
git push -u origin HEAD:gh-pages --force
