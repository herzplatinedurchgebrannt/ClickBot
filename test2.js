const { Builder, By, Key, until } = require('selenium-webdriver');
const { fs } = require('file-system')

let driver;

let accounts = [1,3,5];
let playlists = ["song1", "song2", "song3"];

const accountsNew = JSON.parse(fs.readFileSync("./accounts.json", {encoding:'utf8', flag:'r'}));
const playlistsNew = JSON.parse(fs.readFileSync("./playlist.json", {encoding:'utf8', flag:'r'}));

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

for (let i = 0; i < accountsNew.spotify.length; i++){
  accountsArray[i] = new Account(accountsNew.spotify[i].email, accountsNew.spotify[i].passwort, playlistsNew.spotify[i].link);
}
console.log(accountsArray)





const syncWait = ms => {
  const end = Date.now() + ms
  while (Date.now() < end) continue
}

async function asyncWait(waitTime){
  const end = Date.now() + ms
  while (Date.now() < end) continue
}

async function test(waitTime){
  syncWait(waitTime);
  return true;
}

async function playSong(waitTime, song){
  console.log("start Song... " + song);
  syncWait(waitTime);
  console.log("end song");
  return true;
}







async function main() {
  for (let i = 0; i < accountsArray.length; i++){
  
    // login stuff -> if successful -> state = TRUE

    // wait until account is playing song
    console.log("login account "+ accounts[i]);
    accountsArray[i].driver = await new Builder().forBrowser("chrome").build();


    
    const sessionUser = accountsArray[i].email;
    const sessionPasswort = accountsArray[i].passwort;
    const sessionSong = accountsArray[i].playlist;
    


    
    await accountsArray[i].driver.get('https://www.spotify.com');

    await sleep(3000);
    await accountsArray[i].driver.findElement(By.id('onetrust-accept-btn-handler')).click();
    
    //await click('Cookies akzeptieren');
    await accountsArray[i].driver.findElement(By.xpath("//*[text()='" + "Cookies akzeptieren" + "']")).click();


    //await click('Anmelden');
    await accountsArray[i].driver.findElement(By.xpath("//*[text()='" + "Anmelden" + "']")).click();



    await sleep(1000);
    await accountsArray[i].driver.findElement(By.id('login-username')).sendKeys(sessionUser, Key.RETURN);
    await accountsArray[i].driver.findElement(By.id('login-password')).sendKeys(sessionPasswort, Key.RETURN);

    await sleep(1000);
    await accountsArray[i].driver.get(sessionSong);

    await sleep(5000);
    await accountsArray[i].driver.findElements(By.className("A8NeSZBojOQuVvK4l1pS")).then(function(elements){
        elements.forEach(function (element) {
            element.click();
            element.getText().then(function(text){
                console.log(text);
            });
        });
    });

    await sleep(2000);

    //await test(5000);

    //console.log(accountsArray);
    
    /*
    try{    
      let isOkay = await test(5000);

      if (isOkay == true){
        console.log("--------------------------------")
        console.log("start ACCOUNT " + accounts[i]);
  
        // play songs
        for (let j = 0; j < playlists.length; j++){
          try{
            let songDone = await playSong(2000, playlists[j]);
            if (!songDone){
              break;
            }
          }
          catch(e){
            console.log(e);
          }
        }
      }
      else {
        console.log("break");
        break;
      }
    }
    catch(e){
      console.log(e);
    }
    */
  }

}

main();


/*
async function loginSpotify(email, password){
  const sessionUser = email;
  const sessionPasswort = passwort;

  await accountsArray[0].driver.get('https://www.spotify.com');

  await sleep(3000);
  await driver.findElement(By.id('onetrust-accept-btn-handler')).click();

  await click('Cookies akzeptieren');
  await click('Anmelden');

  await sleep(1000);
  await driver.findElement(By.id('login-username')).sendKeys(sessionUser, Key.RETURN);
  await driver.findElement(By.id('login-password')).sendKeys(sessionPasswort, Key.RETURN);

  await sleep(1000);

  return true;
}


async function playSongSpotify(song){

  const sessionSong = song;

  await driver.get(sessionSong);

  await sleep(3000);
  await driver.findElements(By.className("A8NeSZBojOQuVvK4l1pS")).then(function(elements){
      elements.forEach(function (element) {
          element.click();
          element.getText().then(function(text){
              console.log(text);
          });
      });
  });
}
*/


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 


async function click(text){
  
  await driver.findElement(By.xpath("//*[text()='" + text + "']")).click();
  console.log(text)
}