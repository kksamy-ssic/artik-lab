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

 var Gpio = require('onoff').Gpio,
    button = new Gpio(121, 'in', 'both');
    gnd = new Gpio(123,'out');
    led = new Gpio(135,'out');

    ledx = new Gpio(134,'out');
    ledx = new Gpio(129,'out');
    ledx = new Gpio(127,'out');
    ledx = new Gpio(126,'out');
    ledx = new Gpio(125,'out');
 
var myButtonCount=0;
 var myButtonState=false;

function exit() {
  button.unexport();
  led.unexport();
  process.exit();
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


function toggleButton(err, state){

  if( (myButtonCount++) %2 ) //the button, we have do not maintain the state memory, hence doing it in SW
  {

    myButtonState = myButtonState ? false : true ; // toggle my button state;
    console.log('my current Button State '+myButtonState);
 
  }  
  //console.log('Button event '+state);
  toggleLED(myButtonState);
}

/*  End of console  ****/
  console.log('starting cloud switch'); 



button.watch(toggleButton);
process.on('SIGINT', exit);
