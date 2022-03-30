const { Builder, By, Key, until } = require('selenium-webdriver');
const { fs } = require('file-system');
const { Result } = require('selenium-webdriver/io/exec');
const https = require('https');
const axios = require('axios');

const fetch = require('node-fetch');

let driver;

async function main() {

    driver = await new Builder().forBrowser("chrome").build();

    await driver.get('https://de.wikipedia.org/wiki/Wikipedia:Hauptseite');
    await sleep(3000);


    let logo;


    logo = await driver.findElement(By.className("mw-wiki-logo"));
    //console.log(logo);

    let klasse;

    klasse = await logo.getAttribute('href');

    console.log(klasse);

    //let lala;

   // lala = await Promise.all(klasse);

    //console.log(lala);


}

main();






function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 