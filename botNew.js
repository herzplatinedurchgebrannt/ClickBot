const { Builder, By, Key, until } = require('selenium-webdriver');
const { fs } = require('file-system');
const { Result } = require('selenium-webdriver/io/exec');

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
//console.log(accountsArray[0].playlist[0].link)

let counterPlays = 0;

// replace w. regex
const stringPause = 'aria-label="Pause"';
const stringPlay = 'aria-label="Play"';

const playTimeSpotify = 45000;


async function main() {

  for (let i = 0; i < accountsArray.length; i++){
  
    // wait until account is playing song
    console.log("Logging in account: " + accountsArray[i].email + "...");
    accountsArray[i].driver = await new Builder().forBrowser("chrome").build();

    const startSong = 0;

    try{
      if (accountsArray[i].state = "stop"){
        let loginState = await loginSpotify(accountsArray[i]);

        if (loginState){
          accountsArray[i].state = "logged"
        }
      }
      dispatcher(accountsArray[i],startSong);
    }
    catch(e){
      console.log("Exception: " + e);
    }
  }
}

main();






async function loginSpotify(account){

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
    return true;
  }

  catch(e)
  {
    console.log("Login error: " + account.email);
    console.log("Exception " + e);
    return false;
  }
}



async function dispatcher(account, num){
  
  await playSong(account, account.playlist[num].link);
  
  if (num >= accountsArray.length){
    num = 0;
    console.log("Playlist done.");
  }
  else {
    num += 1;
  }
  return dispatcher(account, num)
}


async function playSong(account, song){
  await sleep(1000);
  
  // open songlink Url & wait
  await account.driver.get(song);
  await sleep(2000)
  
  // rewind song => find button & click
  await account.driver.findElements(By.className("FKTganvAaWqgK6MUhbkx")).then(function(elements){
    elements.forEach(function (element) {
      element.click(); 
    });
  });
  
  // play song => find button & click & check if song is playing (otherwise repeat play routine)

  let isPlaying = false;

  while (isPlaying == false){
    await pressPlayButton(account);
    await(2000)
    isPlaying = await checkPlayButton(account);
    console.log("is playing: -----" + isPlaying)
  }
  console.log("check ok!")
  
  // wait for minimal time to 
  await sleep(playTimeSpotify);
  
  counterPlays += 1;
  console.log("Total session plays: " + counterPlays);
  
  //return playSong(driver, song);
}

async function pressPlayButton(account){

  console.log("Play fkt " + account.email)
  await sleep(1000);
  await account.driver.findElements(By.className("A8NeSZBojOQuVvK4l1pS")).then(function(elements)
  {
    elements.forEach(function (element) 
    {
      element.click();
    })
  })
}

async function checkPlayButton(account){

  let result;

  console.log("Check fkt " + account.email)
  await sleep(1000);
  await account.driver.findElements(By.className("A8NeSZBojOQuVvK4l1pS")).then(function(elements)
  {
    elements.forEach(function (element) 
    {
      //element.click();
  
      element.getAttribute('outerHTML').then(function(text)
      {
        //console.log(text);
        
        let buttonOuterHtml = text;
        
        if (buttonOuterHtml.includes(stringPause)){
          //console.log("running! " + account.email)
          result = true;
        }
        else if (buttonOuterHtml.includes(stringPlay)){
          //console.log("not playing - repeat function! " + account.email);
          result = false;
        }
        else {
          //console.log("No button state found - please check if process is running!")
          result = false;
        }
      })
    })
  })
  return result;
}




function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

// currently not used:
async function click(text){
  
  await driver.findElement(By.xpath("//*[text()='" + text + "']")).click();
  console.log(text)
}