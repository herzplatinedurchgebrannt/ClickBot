const {Builder, By, Key, until} = require('selenium-webdriver');
let driver;

//<button data-testid="play-button" aria-label="Play" class="Button-qlcn5g-0 bqeOGM"><div class="ButtonInner-sc-14ud5tc-0 hgKCcx encore-bright-accent-set"><span aria-hidden="true" class="IconWrapper__Wrapper-sc-1hf1hjl-0 iWTrNM"><svg role="img" height="28" width="28" viewBox="0 0 24 24" class="Svg-sc-1bi12j5-0 hDgDGI"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path></svg></span></div></button>

let dealAlarm = 'https://open.spotify.com/artist/2ZHNNNUkWlcboai09BqLRa';
//onetrust-accept-btn-handler
openGoogle();

async function openGoogle(){
    driver = await new Builder().forBrowser("chrome").build();
    /*
    await driver.get('http://www.google.com');
    await click('Ich stimme zu');
    await driver.findElement(By.name('q')).sendKeys('Developer Akademie', Key.RETURN);

    await click('Developer Akademie - Karriere');
    await click('Auswahl erlauben');*/

    
    await driver.get('https://www.spotify.com');
    //await driver.findElement(By.id('onetrust-accept-btn-handler')).click();
    //await click('Cookies akzeptieren');
    //await driver.findElement(By.className('Qt5xfSWikz6CLU8Vobxs jzic9t5dn38QUOYlDka0')).click();

    await sleep(3000);
    await driver.findElement(By.id('onetrust-accept-btn-handler')).click();
    
    await click('Cookies akzeptieren');
    await click('Anmelden');

    await sleep(1000);
    await driver.findElement(By.id('login-username')).sendKeys('herzplatine@web.de', Key.RETURN);
    await driver.findElement(By.id('login-password')).sendKeys('herzplatine', Key.RETURN);


    await sleep(1000);

    await driver.get(dealAlarm);

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
