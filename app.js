var express = require('express');
var app = express();
var request = require('request');
var mongoose = require('mongoose'); 		

//connect to local mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/test');

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		
	app.use(express.logger('dev')); 						
	app.use(express.bodyParser()); 							
	app.use(express.methodOverride()); 						

});

//attach lister to connected event
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});

app.post('/selfie', function(req, res){	
	request( req.body.nextUrl , function (error, response, body) {
	  if (!error && response.statusCode == 200) { 
	    res.send(body)
	  }else{
	  	console.log(error);
	  	res.send(error); 
	  }

	});
	console.log('fetched pics');
});

var Selfie = mongoose.model('Selfie', {
		url : String,
		numYes: Number, 
		numNo: Number,
		notASelfie: Number,
		parentData: Object,
		batchUrl: String
});

app.post('/selfie/vote', function(req, res){	
	Selfie.create({
		url : req.body.url,
		numYes : req.body.numYes,
		numNo : req.body.numNo,
		notASelfie : req.body.notASelfie,
		parentData : req.body.parentData,
		batchUrl : req.body.batchUrl
	}, function (err, selfie){
		if(err)
			res.send(err); 
		res.send("biscuits"); 
	}); 
}); 

app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); 
});

app.listen(3000);
console.log('Listening on port 3000');



