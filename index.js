const fetch = require("node-fetch");
const { parse } = require("node-html-parser");
const fs = require("fs");
const path = require("path");

let run = async () => {
  console.log("Fetching!...");
  let fr = await fetch("https://thetravelers.online/leaderboard");
  const dom = parse(await fr.text());
  //console.log(dom.structure);
  let leaderData = dom.querySelector("#leaderJSON").attributes.value;
  let minutesLeft = dom.querySelector("#minutesLeft").text;

  fs.appendFileSync(
    path.join(__dirname, "history.txt"),
    leaderData + "\n\n@@@@\n\n" + new Date().getTime() + "\n\n====\n\n"
  );

  console.log(leaderData);
  let delayTime = (+minutesLeft + 3) * 60 * 1000;
  console.log("Done!", minutesLeft, delayTime);
  queue(delayTime);
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
