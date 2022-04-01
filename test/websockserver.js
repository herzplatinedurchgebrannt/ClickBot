

const GpioServo = require('pigpio').Gpio;

const motor = new GpioServo(10, {mode: GpioServo.OUTPUT});

let pulseWidth = 1000;
let increment = 100;

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(17, 'out'); //use GPIO pin 4, and specify that it is output

var i2c = require('i2c-bus'),
  i2cBus = i2c.openSync(1),
  oled = require('oled-i2c-bus');

var opts = {
  width: 128,
  height: 64,
  address: 0x3C
};

var font = require('oled-font-5x7');

var oled = new oled(i2cBus, opts);
oled.clearDisplay();

//LED.writeSync(1); //set pin state to 1 (turn LED on)

// Node.js WebSocket server script


const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 9898 });

wss.on("connection", ws => {
  LED.writeSync(1); 
  ws.send(pulseWidth);
  ws.on("message", message => {

    try {
      const data = JSON.parse(message);

      switch( data.type ){
        case "pos":
          pulseWidth = data.value;
          motor.servoWrite(pulseWidth);
          console.log(`Position: ${pulseWidth}`);
          break;
          
        case "display":
          oled.clearDisplay();
          oled.setCursor(1, 1);
          oled.writeString(font, 1, data.value, 1, true);
          console.log(`Display: ${data.value}`);
          break;

        case "message":
          console.log(data.value);
          break;

        default:
      }

    } 
    catch(e) {
      console.log(`Something went wrong: ${e.message}`);

    }


  });
  ws.on('close', function(reasonCode, description) {
    console.log('Client has disconnected.');
    oled.clearDisplay();
    LED.writeSync(0); 
});
});



/*
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
    httpServer: server
});*/

/*
wsServer.on('request', function(request) 
{
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) 
    { 


      try {
        const teste = JSON.parse(message);
        console.log(teste);

      } catch(e){
        console.log("Something went wrong");


      }

      if (message.utf8Data == "ON")
      {
        LED.writeSync(1); 
        console.log("an");
      }
      else if (message.utf8Data == "OFF")
      {
        LED.writeSync(0); 
        console.log("aus");
      }
      else if (message.utf8Data == "Plus")
      {
        console.log("Plus");
        pulseWidth += 100;
        if (pulseWidth > 2500){
          pulseWidth = 2500;
          console.log("maximum");
        }
        motor.servoWrite(pulseWidth);
        console.log("Pos: " + pulseWidth);
      }
      else if (message.utf8Data == "Minus")
      {
        console.log("Minus");
        pulseWidth -= 100;
        if (pulseWidth < 500){
          pulseWidth = 500;
          console.log("minimum");
        }
        motor.servoWrite(pulseWidth);
        console.log("Pos: " + pulseWidth);
      }
      else
      {
        console.log("display");
        oled.clearDisplay();
        oled.setCursor(1, 1);
        oled.writeString(font, 1, message.utf8Data, 1, true);
      }
      console.log('Received Message:', message.utf8Data);
      connection.sendUTF('Hi this is WebSocket server!');
    });




    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

function turnoff()
{
    LED.write(0); //set pin state to 1 (turn LED on)
    LED.unexport(); // Unexport GPIO to free resources
    
}

process.on("SIGINT", turnoff);
*/
