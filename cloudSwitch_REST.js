var sami = "https://api.samsungsami.io/v1.1/messages";
 var bearer = "Bearer 54506706e7d3467190f263ca69b4ae7c";
 var sdid = "08027d8460e34a0db81c3268285da1e9";


 var ddid = "c15fae7f2e584eeebb3b0ef6fa917315";
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
 			"Authorization": bearer 
 		},  
 		data: { 
     			"sdid": sdid,
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
