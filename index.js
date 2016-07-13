var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/webhook/', function (request, response) {
	if (request.query['hub.verify_token'] === 'Nobroker_Labs') {
		response.send(request.query['hub.challenge'])
	}
	response.send('Error, wrong token')
})

// API endpoint

app.post('/webhook', function (request, response){
	messaging_events = request.body.entry[0].messaging
	for (i=0; i < messaging_events.length; i++) {
		event = request.body.entry[0].messaging[i]
		sender = event.sender.id
		if (event.message && event.message.text) {
			text = event.message.text
			if (text === 'Aha') {
				sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Yo: " + text.substring(0, 200))
		}
		if (event.postback) {
			text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
			continue
		}
	}
	response.sendStatus(200)
})

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


