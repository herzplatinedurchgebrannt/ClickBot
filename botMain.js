const { Builder, By, Key, until } = require('selenium-webdriver');
const { fs } = require('file-system');
const { Result } = require('selenium-webdriver/io/exec');
const https = require('https');
const axios = require('axios');
const fetch = require('node-fetch');

let driver;

// read & parse local json documents
const accountsList = JSON.parse(fs.readFileSync("./accounts.json", {encoding:'utf8', flag:'r'}));
const playlistsList = JSON.parse(fs.readFileSync("./playlist.json", {encoding:'utf8', flag:'r'}));

class Account {
  constructor(email, passwort, playlist) {
    this.state = "stop";
    this.email = email;
    this.passwort = passwort;
    this.currentSong = 0;
    this.playlist = playlist;
    this.driver;
  }
}

let accountsArray = new Array();

for (let i = 0; i < accountsList.spotify.length; i++){
  accountsArray[i] = new Account(accountsList.spotify[i].email, accountsList.spotify[i].passwort, playlistsList.spotify);
}

let counterPlays = 0;
const playTimeSpotify = 20000;


async function main() {

  for (let i = 0; i < accountsArray.length; i++){
  
    // wait until account is playing song
    console.log("Logging in account: " + accountsArray[i].email + "...");
    accountsArray[i].driver = await new Builder().forBrowser("chrome").build();

    const num_startPlaylist = 0;

    try{
      if (accountsArray[i].state = "stop"){
        let loginState = await loginSpotify(accountsArray[i]);

        if (loginState){
          accountsArray[i].state = "logged"
        }
      }
      dispatcher(accountsArray[i],num_startPlaylist);
    }
    catch(e){
      console.log("Exception: " + e);
    }
  }
}

main();




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



async function dispatcher(account, num_currentSong){

  console.log(`num current song: ${num_currentSong}`);

  await sleep(1000);
  
  try{
    // OPEN SONG
    await account.driver.get(account.playlist[num_currentSong].link);
    await sleep(2000)
    
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
      console.log(currentState);
    
      // "Play" means song is not playing
      if(currentState == "Play"){
        songRunning = false;
      }
      else if (currentState == "Pause"){
        songRunning = true;
      }
      else{
        //exception
      }
    }

    await sleep(playTimeSpotify);
    console.log("song done");

    if (num_currentSong >= account.playlist.length - 1){
      num_currentSong = 0;
      console.log("Playlist done.");
    }
    else {
      num_currentSong += 1;
    }
    return dispatcher(account, num_currentSong)
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




