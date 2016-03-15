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

var Gpio = require('onoff').Gpio,
    led = new Gpio(135, 'out');

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
  
}


function toggleLED(value) {

  console.log('Toggle LED Called '+value);
	led.writeSync( (value?1:0) , function(error) {
          if(error) throw error;
             console.log('toggleLED: wrote ' + value + ' to pin #' + myPin);
             myLEDState = value;
    });
// console.log(' out of toggleLED');
}



/**
 * All start here
 */


console.log(' Starting LAB ---> Blink ARTIK Light Device \n');
start();

toggleLED(1);
sleep.sleep(3);
toggleLED(false);

process.on('SIGINT', exit);




