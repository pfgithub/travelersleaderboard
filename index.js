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
  let leaderData = dom.querySelector("#leaderJSON").attributes.value;

  fs.appendFileSync(
    path.join(__dirname, "history.txt"),
    leaderData + "\n\n@@@@\n\n" + new Date().getTime() + "\n\n====\n\n"
  );

  console.log(leaderData);
  let delayTime = 10 * 60 * 1000;
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
