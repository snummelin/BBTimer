
let gameId = window.location.toString()
  .replace("https://esco.basket.fi/taso/scoreboard.php?otteluid=", "");
console.log("gameId: "+gameId);

//Refresh display when time is changed in local storage
var clockElement = document.getElementById("clock");
if ( clockElement !== null ) {
    console.log("Page has clock element!");
    clockElement.style.display = 'block';
    clockElement.style.fontSize = '1500%';
    clockElement.style.position = 'relative';
    clockElement.style.top = '50%';

    // Select the node that will be observed for mutations
    const awaytarget = document.getElementById("awaysets");
    const hometarget = document.getElementById("homesets");
    const periodtarget = document.querySelector(".period");

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      console.log("mutation done!");
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          //reload time from sync
          chrome.storage.sync.get(["time", "gameId"]).then((result) => {
            if(result.gameId == gameId) {
              console.log(result.gameId+" : " + result.time);
              clockElement.innerText = result.time;
            }
          });        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(hometarget, config);
    observer.observe(awaytarget, config);
    observer.observe(periodtarget, config);


    chrome.storage.onChanged.addListener(function(changes, namespace) {
      console.log("time change in local storage!");
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

document.addEventListener("DOMContentLoaded", function(){
  console.log("DOMContentLoaded is fired!")
});
