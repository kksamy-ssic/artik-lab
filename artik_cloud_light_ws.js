/*
 * Copyright (C) 2016 Samsung Electronics Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var myLEDState = 0;

var webSocketUrl = "wss://api.samsungsami.io/v1.1/websocket?ack=true";
var cloud_light_id = "c15fae7f2e584eeebb3b0ef6fa917315"; // update the id, every time the device is attached to the user account
var bearer = "54506706e7d3467190f263ca69b4ae7c"; // Update the bearer information each time you login to the cloud


var WebSocket = require('ws');
var isWebSocketReady = false;
var ws = null;

var Gpio = require('onoff').Gpio,
    led = new Gpio(135, 'out'),
    led2 = new Gpio(134, 'out'),
    led3 = new Gpio(129, 'out'),
    led4 = new Gpio(127, 'out'),
    led5 = new Gpio(126, 'out'),
    led6 = new Gpio(125, 'out');

var sleep = require('sleep');

function exit() {
  led.unexport();
  process.exit();
}

/**
 * Gets the current time in millis
 */
function getTimeMillis(){
    return parseInt(Date.now().toString());
}

/**
 * Create a websocket connection and setup GPIO pin
 */
function start() {

  console.log("Hello World....");
  
  //Create the WebSocket connection
  isWebSocketReady = false;
  ws = new WebSocket(webSocketUrl);
  ws.on('open', function() {
      console.log("WebSocket connection is open ....");
      register();
  });
  ws.on('message', function(data) {
      console.log("Received message: " + data + '\n');
       handleRcvMsg(data);
  });
  ws.on('close', function() {
       console.log("WebSocket connection is closed ....");
  });

  myButtonState = false;
}


function toggleLED(value) {

  console.log('Toggle LED Called '+value);
	led.writeSync( (value?1:0) , function(error) {
          if(error) throw error;
             console.log('toggleLED: wrote ' + value + ' to pin #' + myPin);
             myLEDState = value;
             sendStateToSami();
    });
// console.log(' out of toggleLED');
}




/***********************************************************************************************/
/**
 * Sends a register message to /websocket endpoint
 */
function register(){
    console.log("Registering device on the WebSocket connection");
    try{
        var registerMessage = '{"type":"register", "sdid":"'+cloud_light_id+'", "Authorization":"bearer '+bearer+'", "cid":"'+getTimeMillis()+'"}';
        console.log('Sending register message ' + registerMessage + '\n');
        ws.send(registerMessage, {mask: true});
        isWebSocketReady = true;
    }
    catch (e) {
        console.error('Failed to register messages. Error in registering message: ' + e.toString());
    }
  
}


/**
 * Send one message to SAMI
 */
function sendStateToSami(){
    try{
        ts = ', "ts": '+getTimeMillis();
        var data = {
              "state": myLEDState
            };
        var payload = '{"sdid":"'+cloud_light_id+'"'+ts+', "data": '+JSON.stringify(data)+', "cid":"'+getTimeMillis()+'"}';
        console.log('Sending payload ' + payload + '\n');
        ws.send(payload, {mask: true});
    } catch (e) {
        console.error('Error in sending a message: ' + e.toString() +'\n');
    }    
}


/**
 * Handle Actions
   Example of the received message with Action type:

   {
   "type":"action","cts":1451436813630,"ts":1451436813631,
   "mid":"37e1d61b61b74a3ba962726cb3ef62f1",
   "sdid":"fde8715961f84798a841be23480b8ce5",
   "ddid":"fde8715961f84798a841be23480b8ce5",
   "data":{"actions":[{"name":"setOn","parameters":{}}]},
   "ddtid":"dtf3cdb9880d2e418f915fb9252e267051","uid":"650a7c8b6ca44730b077ce849af64e90","mv":1
   }

 */
function handleRcvMsg(msg){
    var msgObj = JSON.parse(msg);
    if (msgObj.type != "action") return; //Early return;

    var ddid = msgObj.ddid; // To identify the device id for the intended device
    var actions = msgObj.data.actions;
    var actionName = actions[0].name; //assume that there is only one action in actions
    console.log("The received action is " + actionName);

    if(ddid == cloud_light_id)
    {
      var newState;
      if (actionName.toLowerCase() == "seton") {
        newState = 1;
      }
      else if (actionName.toLowerCase() == "setoff") {
        newState = 0;
      } else {
      
      console.log('Do nothing since receiving unrecoganized action ' + actionName);
      return;
      }
      toggleLED(newState);
    }
}


/**
 * All start here
 */


console.log(' Starting LAB ---> ARTIK Cloud Light Device \n');
start();


//toggleLED(1);

//toggleLED(false);

process.on('SIGINT', exit);




