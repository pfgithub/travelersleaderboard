let botsList = ["pfg", "lawnmower", "toragadude", "henta\x69", "LightningWB", 'Meepcom', 'cerbere'];

let el = n => document.createElement(n);
let tn = txt => document.createTextNode(txt);
function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
            (h = (h << 13) | (h >>> 19));
    return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}

function seededRandom(string) {
    let seed = xmur3(string);
    return sfc32(seed(), seed(), seed(), seed());
}
function getRandomColor(string) {
    let rand = seededRandom(string);
    var letters = "0123456789ABCDEF";
    let luminance = 0;
    let iterCount = 0;
    while (luminance < 0.5 || luminance > 0.8) {
        iterCount++;
        if (iterCount > 1000) {
            console.log("Uh oh name! " + string);
            break;
        }
        var color = [0, 0, 0].map(q => {
            return Math.floor(rand() * 255);
        });
        luminance = (0.3 * color[0] + 0.59 * color[1] + 0.114 * color[2]) / 255;
    }
    return "#" + color.map(c => c.toString(16).padStart(2, "0")).join("");
}

window.onhashchange = () => location.reload();

async function App(mount) {
    let loader = el("div");
    let status = tn("Loading...");
    loader.appendChild(status);
    mount.appendChild(loader);
    let text;
    let choicenames = {
		"#latest": "history6h.txt",
		'#dist': 'history6h.txt',
		'#time': 'history6h.txt',
		'#locs': 'history6h.txt',
		"#last24h": "history2min.txt",
		"#alpha": "alpha.txt"
	};
    let selfyl = window.location.hash || "#latest";
    let filename = choicenames[selfyl];
    if (!filename) {
        status.nodeValue = "404 not found. ";
        let link = el("a");
        link.href = "#";
        link.appendChild(tn("View leaderboard history"));
        loader.appendChild(link);
        return;
    }
    try {
        text = await (await fetch(filename)).text();
    } catch (e) {
        status.nodeValue = "Load failed. " + e.toString();
        console.log(e);
        throw e;
    }
    status.nodeValue = "Loaded! Parsing...";

    let vlist, targetStat;
    try {
        let history = text
            .split("\n====\n")
            .map(l => l.trim())
            .filter(v => v)
            .map(itm => itm.split("\n@@@@\n"));
        let historyJson = new Set();
        history = history.filter(([lbd, tme]) => {
            if (historyJson.has(lbd)) return false;
            historyJson.add(lbd);
            return true;
        });
		// uses the hash to determine what way to sort with
		switch(window.location.hash)
		{
			case '#latest':
				targetStat = 'xp';
				break;
			case '#time':
				targetStat = 'seconds_played';
				break;
			case '#dist':
				targetStat = 'steps_taken';
				break;
			case '#locs':
				targetStat = 'locs_explored';
				break;
			default:
				targetStat = 'xp';
				break;
		}
		let sortingAlgorithm = (a, b)=> b[targetStat] - a[targetStat];
        vlist = history.map(([leaderboardData, time]) => {
            if (!time) time = 0;
            else time = +time.trim();
            leaderboardData = leaderboardData.trim();
            let top10 = JSON.parse(leaderboardData).filter(e=>e[targetStat]!=undefined).sort(sortingAlgorithm);
			if(top10[0]===undefined || top10[0][targetStat]===undefined)return null;
            return top10.map((player, i) => {
				if(targetStat==='xp') return {
                    username: player.username,
                    level: player.level || 0,
                    xp: player[targetStat] || 0,
                    color: getRandomColor(player.username),
                    time: time,
                };
				else if(targetStat==='seconds_played') return {
                    username: player.username,
                    xp: parseInt(player[targetStat]/60/60) || 0,
                    color: getRandomColor(player.username),
                    time: time,
                };
				else return {
                    username: player.username,
                    xp: player[targetStat] || 0,
                    color: getRandomColor(player.username),
                    time: time,
                };
            });
        });
		vlist = vlist.filter(e=>e!=null);
    } catch (e) {
        status.nodeValue = "Parse failed. " + e.toString();
        console.log(e);
        throw e;
    }
    let allPlayers = [...new Set(vlist.flatMap(q => q.map(w => w.username)))];

    status.nodeValue = "Ready!";
    status.remove();

    let buttonBar = el("div");
    buttonBar.classList.add("buttonbar");

    let leftContainer = el("div");
    leftContainer.classList.add("left");
    buttonBar.appendChild(leftContainer);

    let lynks = el("div");
    lynks.classList.add("links-list");
    let i = 0;
    for (let linkdat of [
        { name: "Release", hash: "#latest" },
        { name: "Distance", hash: "#dist" },
        { name: "Time", hash: "#time" },
        { name: "Location", hash: "#locs" },
        { name: "24h", hash: "#last24h" },
        { name: "Alpha", hash: "#alpha" }
    ]) {
        if (i === 0) i++;
        else lynks.appendChild(tn(" / "));
        let linkryl = el("a");
        linkryl.href = linkdat.hash;
        linkryl.appendChild(tn(linkdat.name));
        if (selfyl === linkdat.hash) {
            linkryl.classList.add("selectedlynk");
        }
        lynks.appendChild(linkryl);
    }
    leftContainer.appendChild(lynks);

    let centerContainer = el("div");
    centerContainer.classList.add("center");

    let prevButton = el("button");
    prevButton.appendChild(tn("←"));
    centerContainer.appendChild(prevButton);
    let currentStatus = el("span");
    let currentStatusTn = tn("...");
    currentStatus.appendChild(currentStatusTn);
    centerContainer.appendChild(currentStatus);
    let nextButton = el("button");
    nextButton.appendChild(tn("→"));
    centerContainer.appendChild(nextButton);

    buttonBar.appendChild(centerContainer);

    let rightContainer = el("div");
    rightContainer.classList.add("right");

    let fullscreenScale = el("button");
    let fsbtnText = tn("scale -");
    fullscreenScale.appendChild(fsbtnText);
    rightContainer.appendChild(fullscreenScale);
    let includePfg = el("button");
    let ipfgTxt = tn("bots √");
    includePfg.appendChild(ipfgTxt);
    rightContainer.appendChild(includePfg);

    buttonBar.appendChild(rightContainer);

    mount.appendChild(buttonBar);

    let sliderBar = el("div");
    sliderBar.classList.add("sliderBar");

    let playpauseButton = el("button");
    sliderBar.appendChild(playpauseButton);

    let slider = el("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = vlist.length - 1;
    sliderBar.appendChild(slider);

    mount.appendChild(sliderBar);

    let displayPlayers = {};
    let displayArea = el("div");
    displayArea.classList.add("playerlist");
    allPlayers.push(" scale ");
    for (let player of allPlayers) {
        let scl = player === " scale ";

        let bg = el("div");
        bg.classList.add("player");

        if (!scl) {
            let progressBg = el("div");
            progressBg.classList.add("playerbg");
            progressBg.classList.add("playerblank");
            bg.appendChild(progressBg);
            let progressAnim = el("div");
            progressAnim.classList.add("playerbg");
            progressAnim.classList.add("playeranim");
            bg.appendChild(progressAnim);
        }

        let tx = el("div");
        tx.classList.add("playertx");
        bg.appendChild(tx);

        if (scl) bg.classList.add("scale");
        let level = targetStat==='xp'?tn("..."):tn('');
        let xp = tn("...");
        let time = tn("time");

        scl || tx.appendChild(targetStat==='xp'?tn("lv"):tn(''));
        scl || tx.appendChild(level);
        scl || tx.appendChild(tn((targetStat==='xp'?" - ":'') + player + " ("));
        scl || tx.appendChild(xp);
        scl || tx.appendChild(tn(")"));
        scl && tx.appendChild(time);
        displayArea.appendChild(bg);
        displayPlayers[player] = { bg, player, level, xp, time };
    }
    mount.appendChild(displayArea);

    let displayIndex = vlist.length - 1;
    let playing = false;
    let includePfgChoice = true;
    let fullscreenScaleChoice = false;

    let update = () => {
        let disablePrev = false;
        let disableNext = false;
        if (playing) {
            playpauseButton.setAttribute("aria-label", "pause");
            playpauseButton.setAttribute("class", "playpause pause");
        } else {
            if (displayIndex + 1 >= vlist.length) {
                playpauseButton.setAttribute("aria-label", "restart");
                playpauseButton.setAttribute("class", "playpause restart");
            } else {
                playpauseButton.setAttribute("aria-label", "play");
                playpauseButton.setAttribute("class", "playpause play");
            }
        }
        if (includePfgChoice) {
            ipfgTxt.nodeValue = "bots √";
        } else {
            ipfgTxt.nodeValue = "bots ×";
        }
        if (fullscreenScaleChoice) {
            fsbtnText.nodeValue = "scale ≡";
        } else {
            fsbtnText.nodeValue = "scale -";
        }

        let visiblePlayers = vlist[displayIndex].filter(pl =>
            (pl.xp) &&
            (!includePfgChoice && botsList.includes(pl.username) ? false : true)
        );
        let topXP = visiblePlayers[0].xp;
        let topTime = visiblePlayers[0].time;
        let adsn = Math.floor(Math.log2(topXP));
        visiblePlayers.unshift({
            username: " scale ",
            level: 0,
            xp: 2 ** adsn,
            color: "#aaa",
            time: topTime,
        });
        for (let line of Object.values(displayPlayers)) {
            let hiddenPosition = visiblePlayers.length;
            if (botsList.includes(line.player) && !includePfgChoice)
                hiddenPosition = 0;
            line.bg.style.setProperty("--top", 2.3 * hiddenPosition + "rem");
            line.bg.classList.add("hidden");
        }
        let index = 0;
        for (let player of visiblePlayers) {
            if (!includePfgChoice && botsList.includes(player.username))
                continue;
            let line = displayPlayers[player.username];
            line.bg.classList.remove("hidden");
            if(targetStat==='xp')line.level.nodeValue = (player.level + 1).toLocaleString();
            line.xp.nodeValue = player.xp.toLocaleString();
            line.bg.style.setProperty("--top", 2.3 * index + "rem");
            let percent = player.xp / topXP;
            line.bg.style.setProperty(
                "--progress",
                (percent * 100).toFixed(2) + "%"
            );
            if (line.player === " scale ") {
                if (fullscreenScaleChoice) {
                    line.bg.classList.add("fullscreen");
                } else {
                    line.bg.classList.remove("fullscreen");
                }
                line.bg.style.setProperty(
                    "--prev-progress",
                    ((2 ** (adsn - 1) / topXP) * 100).toFixed(2) + "%"
                );
                line.bg.style.setProperty(
                    "--scale-color",
                    "rgb(" +
                        new Array(3)
                            .fill(Math.floor(percent * 170) + 85)
                            .map(q => q.toString())
                            .join(",") +
                        ")"
                );
                line.time.nodeValue = player.time ? new Date(player.time).toString() : "Dates were not being recorded yet";
            }
            line.bg.style.setProperty("--color", player.color);
            index++;
        }
        currentStatusTn.nodeValue =
            "(" + (displayIndex + 1) + " / " + vlist.length + ")";

        if (displayIndex + 1 >= vlist.length) disableNext = true;
        if (displayIndex <= 0) disablePrev = true;

        if (disablePrev) prevButton.setAttribute("disabled", "");
        else prevButton.removeAttribute("disabled");
        if (disableNext) nextButton.setAttribute("disabled", "");
        else nextButton.removeAttribute("disabled");

        if (slider.value !== displayIndex) slider.value = displayIndex;
    };
    update();

    includePfg.onclick = () => {
        includePfgChoice = !includePfgChoice;
        update();
    };
    fullscreenScale.onclick = () => {
        fullscreenScaleChoice = !fullscreenScaleChoice;
        update();
    };

    nextButton.onclick = () => {
        if (playing) {
            stopPlay();
        }
        displayIndex++;
        update();
    };
    prevButton.onclick = () => {
        if (playing) {
            stopPlay();
        }
        displayIndex--;
        update();
    };

    let playInterval;

    let stopPlay = () => {
        playing = false;
        clearInterval(playInterval);
        update();
    };

    let doplaytick = () => {
        if (displayIndex + 1 >= vlist.length) {
            stopPlay();
        } else {
            displayIndex++;
            update();
        }
    };
    playpauseButton.onclick = () => {
        if (playing) {
            stopPlay();
        } else {
            if (displayIndex + 1 >= vlist.length) displayIndex = 0;
            else {
                playing = true;
                playInterval = setInterval(doplaytick, 1000 / 30);
                // easier than calculating deltas with requestAnimationFrame
            }
            update();
        }
    };

    slider.oninput = () => {
        if (playing) {
            stopPlay();
        }
        displayIndex = Math.round(slider.value);
        update();
    };
}

App(document.getElementById("content"));