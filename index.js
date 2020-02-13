const fetch = require("node-fetch");
const {parse} = require("node-html-parser");
const fs = require("fs");
const path = require("path");

let run = async () => {
    
    let fr = await fetch("https://thetravelers.online/leaderboard");
    const dom = parse(await fr.text());
    //console.log(dom.structure);
    let leaderData = (dom.querySelector("#leaderJSON").attributes.value);
    let minutesLeft = (dom.querySelector("#minutesLeft").text);

    fs.appendFileSync(path.join(__dirname, "history.txt"), leaderData + "\n\n" + "====" + "\n\n");
    
    console.log("minutes: ",minutesLeft);

    setTimeout(() => run(), +(minutesLeft + 3) * 60 * 1000);
};

run();
