const fetch = require("node-fetch");
const { parse } = require("node-html-parser");
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

let run = async () => {
  console.log("Fetching!...");
  let fr = await fetch("https://thetravelers.online/leaderboard");
  const dom = parse(await fr.text());
  //console.log(dom.structure);

  let leaderData = dom.querySelector("#lb_xp_JSON").attributes.value;
  let stepsData = dom.querySelector("#lb_steps_JSON").attributes.value;
  let locsData = dom.querySelector("#lb_locs_JSON").attributes.value;
  let sexData = dom.querySelector("#lb_seconds_JSON").attributes.value;

  const parsed = [...JSON.parse(leaderData), ...JSON.parse(stepsData),
    ...JSON.parse(locsData), ...JSON.parse(sexData)];
  const res_player_info = {};

  for(let psdv of parsed) {
    if(!res_player_info[psdv.username]) res_player_info[psdv.username] = {};
    Object.assign(res_player_info[psdv.username], psdv);
    delete res_player_info[psdv.username].rank;
  }

  const resdata = JSON.stringify(Object.values(res_player_info));

  fs.appendFileSync(
    path.join(__dirname, "history.txt"),
    resdata + "\n\n@@@@\n\n" + new Date().getTime() + "\n\n====\n\n"
  );

  console.log(resdata);
  let delayTime = 2 * 60 * 1000;
  console.log("Done!", delayTime);
  queue(delayTime);
  console.log("Publishing stats...");
  cp.exec("./publishstats.sh", (err, stdout, stderr) => {
    console.log();
    console.log();
    console.log("Stats published.");
    console.log("Err:", err);
    console.log("Stdout:", stdout);
    console.log("Stderr:", stderr);
    console.log();
    console.log();
  });
};

function queue(timems) {
  let start = new Date().getTime();
  let intv = setInterval(
    () =>
      process.stdout.write(
        "\r" + (timems - (new Date().getTime() - start)) + "ms left\u001b[0K"
      ),
    1000
  );
  setTimeout(() => {
    clearInterval(intv);
    console.log("");
    run();
  }, timems);
}

run();

process.on("unhandledRejection", up => {
  throw up;
});
