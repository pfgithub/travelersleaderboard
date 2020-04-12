const history = require("fs").readFileSync("./history.txt", "utf-8");
let gtimeout;

let vlist = [
  ...new Set(
    history
      .split("\n====\n")
      .map(q => q.split("\n@@@@\n")[0].trim())
      .filter(q => q)
      .map(q =>
        JSON.parse(q)
          .sort((a, b) => b.xp - a.xp)
          .map(r =>
            `|   lv${r.level.toString().padEnd(3, " ")} - ${r.username.padEnd(
              15,
              " "
            )} (${r.xp} xp)`.padEnd(" ", 40)
          )
          .join("  \n")
      )
  )
];

clearTimeout(gtimeout);
let ln = v => (gtimeout = setTimeout(() => doa(v), 100));

function doa(i) {
  console.log("(" + (i + 1) + "/" + vlist.length + ")\n\n" + vlist[i]);
  if (vlist[i + 1]) ln(i + 1);
  else console.log("DONE!!");
}

ln(0);
