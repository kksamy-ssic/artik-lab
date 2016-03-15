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
 var sami = "https://api.samsungsami.io/v1.1/messages";
 var bearer = "33b5e6833b88476890f410ee02dafb4b";
 var cloud_switch_id = "08027d8460e34a0db81c3268285da1e9";


// var ddid = "c15fae7f2e584eeebb3b0ef6fa917315";
/* 
 var serialport = require("serialport")
 var SerialPort = serialport.SerialPort;
 var sp = new SerialPort("/dev/ttyACM0", {
 	baudrate: 9600,
 	parser: serialport.parsers.readline("\n")
 });
 */

 var Client = require("node-rest-client").Client;
 var c = new Client();
  var Gpio = require('onoff').Gpio,
    button = new Gpio(121, 'in', 'both');
    gnd = new Gpio(123,'out');
    
var myButtonCount=0;
 var myButtonState=false;

function exit() {
  button.unexport();
  process.exit();
}

 function build_mesg (newState, ts) {
 
 	var args = {
 		headers: {
 			"Content-Type": "application/json",
 			"Authorization": "Bearer "+bearer 
 		},  
 		data: { 
     			"sdid": cloud_switch_id,
 			"ts": ts,
 			"type": "message",
 			"data": {
         			"state": newState
     			}
 		}
 	};
 	return args;
 }
 

function toggleButton(err, state){

  if( (myButtonCount++) %2 ) //the button, we have do not maintain the state memory, hence doing it in SW
  {

    myButtonState = myButtonState ? false : true ; // toggle my button state;
    console.log('my current Button State '+myButtonState);
    var args = build_mesg(myButtonState, new Date().valueOf());

    c.post(sami, args, function(data, response) {            
      console.log(data);
          });  
 
  }  
  //console.log('Button event '+state);

}

/*  End of console  ****/
  console.log('starting cloud switch'); 



button.watch(toggleButton);
process.on('SIGINT', exit);
