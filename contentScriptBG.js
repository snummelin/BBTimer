
let gameId = window.location.toString()
  .replace("https://esco.basket.fi/taso/scoreboard.php?otteluid=", "");
console.log("gameId: "+gameId);

//Refresh display when time is changed in local storage
var clockElement = document.getElementById("clock");
if ( clockElement !== null ) {
    console.log("Page has clock element!");
    clockElement.style.display = 'block';

    //Duplicate code...
    chrome.storage.sync.get(["time", "gameId"]).then((result) => {
      if(result.gameId == gameId) {
        console.log(result.gameId+" : " + result.time);
        clockElement.innerText = result.time;
      }
    });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
      if ("time" in changes) {
          chrome.storage.sync.get(["time", "gameId"]).then((result) => {
            if(result.gameId == gameId) {
              console.log(result.gameId+" : " + result.time);
              clockElement.innerText = result.time;
            }
          });
      }
  });
}
