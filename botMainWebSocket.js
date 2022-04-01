"use strict";
const { Builder, By, Key, until } = require('selenium-webdriver');
const { fs } = require('file-system');
const { Result } = require('selenium-webdriver/io/exec');
const https = require('https');
const axios = require('axios');
const fetch = require('node-fetch');


const serverPort = 3000;
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);

const websocketServer = new WebSocket.Server({ server });

//start the web server
server.listen(3000, () => {
  console.log("Websocket server started on port 3000");
});


let isRunning = false;


websocketServer.on("connection", (webSocketClient) => {
  main(webSocketClient)
});




let driver;

// minimum 30 s. = 1 play
const playTimeSpotify = 35000;

// read & parse local json documents
const accountsList = JSON.parse(fs.readFileSync("./accounts.json", {encoding:'utf8', flag:'r'}));
const playlistsList = JSON.parse(fs.readFileSync("./playlist.json", {encoding:'utf8', flag:'r'}));

class Account {
  constructor(email, passwort, playlist) {
    this.state = "Stop";
    this.email = email;
    this.passwort = passwort;
    this.currentSong = 0;
    this.currentBand = "None";
    this.currentTitle = "None";
    this.currentImage = "";
    this.logPlayedSongs = 0;
    this.playlist = playlist;
    this.driver;
  }
}

let accountsArray = new Array();

for (let i = 0; i < accountsList.spotify.length - 3; i++){
  accountsArray[i] = new Account(accountsList.spotify[i].email, accountsList.spotify[i].passwort, playlistsList.spotify);
}

let startDate = new Date();

let logger = {songsPlayed: 0, playlistsPlayed: 0, start: startDate};










async function main(webSocketClient) {

  //webSocketClient.send(JSON.stringify(accountsArray));

  for (let i = 0; i < accountsArray.length; i++){
  
    console.log("Logging in account: " + accountsArray[i].email + "...");
    accountsArray[i].driver = await new Builder().forBrowser("chrome").build();

    const num_startPlaylist = 0;

    try{
      if (accountsArray[i].state = "Stop"){
        let loginState = await loginSpotify(accountsArray[i]);

        if (loginState){
          accountsArray[i].state = "Login OK"
        }
      }

      webSocketClient.send(JSON.stringify(accountsArray));
      dispatcher(accountsArray[i],num_startPlaylist, webSocketClient);
    }
    catch(e){
      console.log("Exception: " + e);
    }
  }
}






async function loginSpotify(account){

  let result = false;

  try
  {
    // go to website & wait until rendered
    await account.driver.get('https://www.spotify.com');
    await sleep(3000);
    
    // 
    await account.driver.findElement(By.id('onetrust-accept-btn-handler')).click();
    
    //await click('Cookies akzeptieren');
    await account.driver.findElement(By.xpath("//*[text()='" + "Cookies akzeptieren" + "']")).click();
    
    //await click('Anmelden');
    await account.driver.findElement(By.xpath("//*[text()='" + "Anmelden" + "']")).click();
    await sleep(1000);
    
    // login account & wait
    await account.driver.findElement(By.id('login-username')).sendKeys(account.email, Key.RETURN);
    await account.driver.findElement(By.id('login-password')).sendKeys(account.passwort, Key.RETURN);
    await sleep(1000)
    
    console.log("Login successful: " + account.email)

    result = true;
  }

  catch(e)
  {
    console.log("Login error: " + account.email);
    console.log("Exception " + e);
    result = false;
  }

  return result;
}



async function dispatcher(account, num_currentSong, webSocketClient){

  
  await sleep(1000);
  
  try{
    // OPEN SONG
    account.currentState = "Open link"
    account.currentSong = num_currentSong;
    account.currentBand = account.playlist[num_currentSong].band;
    account.currentTitle = account.playlist[num_currentSong].song;



    await account.driver.get(account.playlist[num_currentSong].link);
    await sleep(2000)

    // FIND SRC OF ALBUM COVER
    let classImage = await account.driver.findElement(By.className("CmkY1Ag0tJDfnFXbGgju"));
    let imageSrc = await classImage.findElement(By.css("img")).getAttribute("src");

    account.currentImage = imageSrc;    
    webSocketClient.send(JSON.stringify(accountsArray));

    // CLICK GREEN PLAY BUTTON
    await account.driver.findElements(By.className("Button-qlcn5g-0 iaAUvZ")).then(function(elements){
      elements.forEach(function (element) {
        element.click(); 
      });
    });
    await sleep(1000);

    // CHECK BUTTON STATE
    let songRunning = false;

    while(!songRunning){

      // CLICK PLAYBUTTON
      await account.driver.findElement(By.className("A8NeSZBojOQuVvK4l1pS")).then(function(element)
      {
        element.click();
      })
      await sleep(1000);

      // find html object and check state of playbutton
      let pButton = await account.driver.findElement(By.className("A8NeSZBojOQuVvK4l1pS"));
      let currentState = await pButton.getAttribute('aria-label');
      //console.log(currentState);
    
      // "Play" means song is not playing
      if(currentState == "Play"){
        songRunning = false;
        console.log(currentState);
        //account.state = "Pause"
      }
      else if (currentState == "Pause"){
        songRunning = true;
        //account.state = "Playing"
      }
      else{
        //exception
      }
    }

    account.state = "Song playing";
    webSocketClient.send(JSON.stringify(accountsArray));


    await sleep(playTimeSpotify);
    logger.songsPlayed += 1;

    account.state = "Song done"
    account.logPlayedSongs += 1;
    webSocketClient.send(JSON.stringify(accountsArray));

    if (num_currentSong >= account.playlist.length - 1){
      num_currentSong = 0;
      logger.playlistsPlayed += 1;
    }
    else {
      num_currentSong += 1;
    }

    var currentDate = new Date();

    console.log(`[Played: ${logger.songsPlayed} songs & ${logger.playlistsPlayed} playlists] ${currentDate.getMinutes() - startDate.getMinutes()} minutes`);

    return dispatcher(account, num_currentSong, webSocketClient)
  }
  catch(e){
    console.log("Exception: " + e);
    return;
  }
}



function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 


//main();


