const fs = require("fs");

const historytxt = fs.readFileSync("./historyraw.txt", "utf-8");

const sixhtxt = [];
const history2min = [];

let minTime = Date.now() - 24 * 60 * 60 * 1000;

var lastTime = 0;

for(let line of historytxt.split("\n====\n")) {
    if(!line.trim()) continue;
    let [json, time] = line.split("\n@@@@\n");
    time =+ time.trim();

    if(lastTime + 5.9 * 60 * 60 * 1000 < time) {
        lastTime = time;
        sixhtxt.push(json.trim() + "\n\n@@@@\n\n" + time + "\n\n====\n\n");
    }
    if(time > minTime) history2min.push(json.trim() + "\n\n@@@@\n\n" + time + "\n\n====\n\n");
}

fs.writeFileSync("./history6h.txt", sixhtxt.join(""), "utf-8");
fs.writeFileSync("./history2min.txt", history2min.join(""), "utf-8");
