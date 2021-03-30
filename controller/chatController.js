var userModel = require('../models/userModel.js');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var stemmer = natural.PorterStemmer;
var Analyzer = natural.SentimentAnalyzer;
var analyzer = new Analyzer('English', stemmer, 'afinn');
var classifier = new natural.BayesClassifier();
// natural.BayesClassifier.load('classifier.json', null, function (err, classifier) {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log(classifier.docs);
//   //console.log(classifier.classify('did the tests pass?'))
// })

var data_set = {
	a: { class: 'vent listen', data: 
		[
			'i have so much i need to do',
			'i have so much i need to do',
			"i'm frustrated with the situation happening",
			"i'm tired, i have so many requirements",
			"i feel like i'm losing focus",
			"i feel drained out"
		]
	},
	b: { class: 'vent opportunity', data:
		[
			"my work keeps on piling up",
			"our my friends family professors boss expect too much"
		]
	},
	c: { class: 'question general', data:
		[
			"what should i do?",
			"why should i do?",
			"how should i do it?",
			"what are you doing?",
		]
	},
	d: { class: 'question stress', data:
		[
			"what can i do to ease my stress?"
		]
	},
	e: { class: 'greeting', data:
		[
			"hello cat are you busy",
			"hi cat what are you doing",
			"hello charlie",
			"hi charlie",
			"hi"
		]
	},
	d: { class: 'end', data:
		[
			"Thank you. It means a lot to me"
		]
	}
	// e: { class: 'response greeting', data:
	// 	[
	// 		""
	// 	]
	// }
}

var msg, classify;
for (i = 0; i < Object.keys(data_set).length; i++) {
	for (var x = 0; x < data_set[Object.keys(data_set)[i]].data.length; x++) {
		
		classify = data_set[Object.keys(data_set)[i]].class;

		if (stemmer.tokenizeAndStem(data_set[Object.keys(data_set)[i]].data[x]).length == 0) {
			msg = tokenizer.tokenize(data_set[Object.keys(data_set)[i]].data[x]);
			//msg = data_set[Object.keys(data_set)[i]].data[x];
		}
		else {
			msg = data_set[Object.keys(data_set)[i]].data[x];
		}
		classifier.addDocument(msg, classify);
	}
}

classifier.train();

// console.log(classifier.docs);

var intents = classifier.getClassifications(tokenizer.tokenize('What does it mean to have a mental illness?'));
intents.sort(function(a, b) {
	return b.value - a.value;
});

if (intents[0].value < 0.8)
	intents[0] = "I can't seem to understand the statement please try again";

// console.log(intents[0]);

exports.ajaxChat = function(req, res) {
	var m = stemmer.tokenizeAndStem('What does it mean to have a mental illness?');
	var a = analyzer.getSentiment(m);

	res.send();
}

exports.ajaxRes = function(req, res) {
	var m = stemmer.tokenizeAndStem(req.params.msg);
	var a = analyzer.getSentiment(m);
	var msg = '';
	var t_intent = 0;
	var t_length = 0;
	var reply;
	if (m.length == 0) {
		msg = req.params.msg;
	}
	else {
		msg = m;
	}
	console.log(msg);
	var intents = classifier.getClassifications(msg);
	intents.sort(function(a, b) {
		return b.value - a.value;
	});
	console.log(intents);
	for (var i = 1; i < intents.length; i++) {
		t_intent += intents[i].value;
		t_length++;
	}
	if (t_intent/t_length < .2) {
		reply = intents[0].label;
		if (intents[0].label == 'vent listen') {
			reply = 'Huh… Hey, you’ve been pretty down lately? Do you want to talk about it?';
		}
		else if (intents[0].label == '') {
			reply = '';
		}
		else if (intents[0].label == 'end') {
			reply = null;
		}
	}
	else {
		reply = "I can't seem to understand the statement could you rephrase it again?";
	}

	if (msg[0] == 'no')
		reply = 'Alright, I just want you to know that I’m always here for you and you’re always worth listening to… Take care always Issha';

	res.send({ cat_res: reply });
}