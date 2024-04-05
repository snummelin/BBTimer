
let gameId = window.location.toString()
  .replace("https://esco.basket.fi/taso/esco.php?otteluid=", "")
  .replace("&escosivu=ottelu", "");
console.log("gameId: "+gameId);

//TODO: lue tämä pelin alustuksesta, löytyykö jostain sivulta?
let readGameTime = "08:00";

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function refreshGameTime(newTime) {
  console.log("refreshGameTime: "+newTime);
  document.getElementById('timeTD').innerText = newTime;
  //Save to local storage
  chrome.storage.sync.set({ time: newTime, gameId: gameId }).then(() => {
    console.log("Value "+newTime+" is set");
  });
}

async function readSavedGameTime() {
  //Read game time from storage if set when setting up the page
  await chrome.storage.sync.get(["time", "gameId"]).then((result) => {
    if(result.gameId == gameId) {
      console.log(result.gameId+" : " + result.time);
      readGameTime = result.time;
    }
  });

  return readGameTime;
}

var intervalId = 0;

function timerStop() {
  clearInterval(intervalId);
  intervalId = -1;
  document.getElementById('resetBtn').disabled = false;
}

function startTimer(duration, display) {
    console.log("Starttimer "+duration+" / "+display.innerText)
    document.getElementById('resetBtn').disabled = true;
    //Minus one from duration so we dont count first second twice
    duration--;

    var timer = duration, minutes, seconds;
    intervalId = setInterval(function () {
      console.log("setInterval, first");
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        //Save to local storage
        chrome.storage.sync.set({ time: display.textContent, gameId: gameId }).then(() => {
          console.log("Value "+display.textContent+" is set");
        });

        if (--timer < 0) {
          document.getElementById('startBtn').disabled = true;
          timerStop();
        }
    }, 1000);
}

const time = document.createElement("td");
time.id = 'gametime';
time.style.background = "black";
time.style.width = '34%';
time.style.margin = 'auto';

const timeText = document.createElement('table');
timeText.setAttribute('width', '100%');
timeText.innerHTML = "<tr>"+
    "<td id='timeTD' colspan='2' style='color:white;text-align:center;font-weight:bold;'>99:99</td>" +
    "</tr><tr>" +
    "<td style='width:100%;'><button id='startBtn' class='awesome' style='width:100%;'>Start/Stop</button></td>" +
    "<td><button id='resetBtn' class='awesome'>Reset</button></td>" +
    "</tr>"
time.appendChild(timeText);

const koti = document.getElementById("kotitop");
if (koti !== null) {
  koti.style.width = "33%";
  insertAfter(koti, time);
  document.getElementById("vierastop").style.width = "33%";

  document.getElementById('vaihdajakso_0').addEventListener('click', function () {
    refreshGameTime("08:00");
  });
  document.getElementById('vaihdajakso_1').addEventListener('click', function () {
    refreshGameTime("08:00");
  });
  document.getElementById('vaihdajakso_2').addEventListener('click', function () {
    refreshGameTime("08:00");
  });
  document.getElementById('vaihdajakso_3').addEventListener('click', function () {
    refreshGameTime("08:00");
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
    let current = document.getElementById('timeTD').innerText;
    let retVal = prompt("Anna uusi aika (min:sec): ", current);

    //TODO: minuutit eivät voi olla isompia kuin annettu peliaika!
    var pattern = /^\d{2}:([0-5][0-9])$$/;
    const afterReg = pattern.exec(retVal);
    console.log("after reg "+afterReg+ " retVal "+retVal);

    if(retVal != null && afterReg != null) {
      console.log("vaihda aika resetin jälkeen, aika validoituna!");
      document.getElementById('timeTD').innerText = retVal;
      chrome.storage.sync.set({ "time" : document.getElementById('timeTD').innerText }).then(() => {
        console.log("Value "+document.getElementById('timeTD').innerText+" is set");
      });
    }
  });

  document.getElementById('timeTD').addEventListener("change", (event) => {
    console.log("timeTD change!");
    chrome.storage.sync.set({ "time" : document.getElementById('timeTD').innerText }).then(() => {
        console.log("Value "+document.getElementById('timeTD').innerText+" is set");
      });
  });

  document.addEventListener('readystatechange', async event => {
    const savedGameTime = await readSavedGameTime();
    document.getElementById('timeTD').innerText = savedGameTime;

    var count = 60 * 8;
    var display = document.getElementById('timeTD');
    console.log("count ="+count+" display ="+display.innerText);

    document.getElementById('startBtn').addEventListener('click', function () {
      console.log("startBtn clicked! intervalId="+intervalId);

      if (intervalId > 0) {
        timerStop();
      } else {
        var currentTimeArr = display.innerText.split(":")
        var currentTime = parseInt(currentTimeArr[0] * 60) + parseInt(currentTimeArr[1]);
        if (count > currentTime) {
          startTimer(currentTime, display);
        } else {
          startTimer(count, display);
        }
      }
    });
  });
}
