var Client = require("node-rest-client").Client
var fs = require('fs');
var exists = require('fs-exists-sync');

var c = new Client();
var restUrl = "https://api.artik.cloud/v1.1/messages"
var token = "21c87f5aae7a48e9a7497bfbdf823fb4" 
var srcDeviceId = '991d281b787942008a472163cbc508a2' 


function build_mesg (newState, ts) {
	//console.log('build_mesg',newState)
 
 	var args = {
 		headers: {
 			"Content-Type": "application/json",
 			"Authorization": "Bearer "+token 
 		},  
 		data: { 
     		"sdid": srcDeviceId, 
 			"ts": ts,
 			"type": "message",
 			"data": { 
 				"temp" : newState }
 		}
 	};
 	return args;
 }
 

function postData (state, ts) {

    var args = build_mesg(state, ts);
    //console.log(args.data.data.temp);
    //console.log(args.data.data.);

    c.post(restUrl, args, function(data, response) {            
    	console.log(data);
        }); 
}

var file_cnt=0;
function postSensorData () {
	//var state = [ 27.27,27.29,27.23,27.29,27.33,27.25,27.27,27.29,27.23,27.18,27.18,27.23,27.25,27.27,27.25,27.27,27.22,27.22,27.27,27.25 ]
    var opFile = './'+ 'out_'+file_cnt+'.json';
    console.log('reading file:',opFile);

    var sensor_data; 
    var my_data; 

    if(exists(opFile))
    {

	   	sensor_data = JSON.parse(fs.readFileSync(opFile, 'utf8'));
	   	//console.log('temp:['+sensor_data.temp)
	   	console.log('temp:['+sensor_data.ts*1000)
		postData(sensor_data.temp, sensor_data.ts*1000);
		//postData(my_data++, sensor_data.ts);
	   	
	   	file_cnt++;	
    }

}

/**
 * All start here
 */
console.log(' Starting temp monitor  \n' );
//counter =0;

var periodicPost = setInterval( postSensorData, (15*1000) );


