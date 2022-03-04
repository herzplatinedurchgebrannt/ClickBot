const {Builder, By, Key, until} = require('selenium-webdriver');
const {fs} = require('file-system')

let driver;
//let dealAlarm = 'https://open.spotify.com/artist/2ZHNNNUkWlcboai09BqLRa';

const accounts = JSON.parse(fs.readFileSync("./accounts.json", {encoding:'utf8', flag:'r'}));
const playlist = JSON.parse(fs.readFileSync("./playlist.json", {encoding:'utf8', flag:'r'}));

startSpotify(accounts.spotify[0],playlist.spotify[0]);


async function startSpotify(account, song){

    console.log(account);
    console.log(song);

    const sessionUser = account.email;
    const sessionPasswort = account.passwort;
    const sessionSong = song.link;

    driver = await new Builder().forBrowser("chrome").build();
    
    await driver.get('https://www.spotify.com');

    await sleep(3000);
    await driver.findElement(By.id('onetrust-accept-btn-handler')).click();
    
    await click('Cookies akzeptieren');
    await click('Anmelden');

    await sleep(1000);
    await driver.findElement(By.id('login-username')).sendKeys(sessionUser, Key.RETURN);
    await driver.findElement(By.id('login-password')).sendKeys(sessionPasswort, Key.RETURN);


    await sleep(1000);

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


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 


async function click(text){
    await driver.findElement(By.xpath("//*[text()='" + text + "']")).click();
}
