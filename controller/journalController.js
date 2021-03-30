var diaryModel = require('../models/diaryModel.js');
var userModel = require('../models/userModel.js');
const dataformatter = require('../public/js/dataformatter.js');

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var stemmer = natural.PorterStemmer;
var Analyzer = natural.SentimentAnalyzer;
var analyzer = new Analyzer('English', stemmer, 'afinn');
var classifier = new natural.BayesClassifier();

var date = new Date();
var time = date.getHours();
var minutes = date.getMinutes();
var mt = '';

if (parseInt(time) >= 13) {
    mt = 'PM';
    time -= 12;
}
else {
    mt = 'AM';
}

if (minutes < 10) {
    minutes = '0'+minutes.toString();
}

var timestamp = time.toString()+':'+minutes.toString()+' '+mt;

var html_data;

exports.ajaxGetDiary = function(req, res) {
	var query = {
		user_id: 1,
		date: dataformatter.formatDate(new Date(req.query.date), 'YYYY-MM-DD')
	};
	
	diaryModel.getDiaryMood(query, function(err, mood) {
		if (err)
			throw err;
		else {
			diaryModel.getDiaryRTB('journal_rose', query, function(err, rose) {
				if (err)
					throw err;
				else {
					diaryModel.getDiaryRTB('journal_thorn', query, function(err, thorn) {
						if (err)
							throw err;
						else {
							diaryModel.getDiaryRTB('journal_bud', query, function(err, bud) {
								if (err)
									throw err;
								else {
									html_data = {
										mood: mood,
										rose: rose,
										thorn: thorn, 
										bud: bud,
										time: timestamp
									};

									res.send({ diary: html_data });
								}
							});
						}
					});
				}
			});
		}
	});
}

exports.getJournal = function(req, res) {
	var query = {
		user_id: 1,
		date: '2021-03-05'
	}
	diaryModel.getMarkedDates('', function(err, markedDays) {
		if (err)
			throw err;
		else {
			diaryModel.getMoodList(function(err, moodList) {
				if (err)
					throw err;
				else {
					diaryModel.getDiaryMood(query, function(err, mood) {
						if (err)
							throw err;
						else {
							diaryModel.getDiaryRTB('journal_rose', query, function(err, rose) {
								if (err)
									throw err;
								else {
									diaryModel.getDiaryRTB('journal_thorn', query, function(err, thorn) {
										if (err)
											throw err;
										else {
											diaryModel.getDiaryRTB('journal_bud', query, function(err, bud) {
												if (err)
													throw err;
												else {
													diaryModel.getReminder(query, function(err, reminders) {
														if (err)
															throw err;
														else {
															var arr = [];
															for (var i = 0; i < markedDays.length; i++) {
																arr.push(markedDays[i].days);
															}
															html_data = {
																moodList: moodList,
																mood: mood,
																rose: rose,
																thorn: thorn, 
																bud: bud,
																time: timestamp,
																marked: arr,
																reminders: reminders
															};

															res.render('journal', html_data);
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

exports.postJournal = function(req, res) {
	var moodList = req.body.moodList;
	var date = req.body.date;
	var rose = req.query.rose, thorn = req.query.thorn, bud = req.query.bud;
	var arr = [];
	var mood_query = [];

	diaryModel.deleteDiary({ date: date, user_id: 1 }, function(err, result) {
		if (err)
			throw err;
		else {
			
		}
	});

	if (moodList != undefined || moodList != null) {
		for (var i = 0; i < moodList.length; i++) {
			arr.push('('+1+',"'+date+'",'+moodList[i]+')');
		}
		diaryModel.addMood(arr, function(err, mood_res) {
			if (err)
				throw err;
			else {
				diaryModel.getChosenMoods(moodList, function(err, mood_list_res) {
					if (err)
						throw err;
					else {
						var m, a;
						var arr = [];
						var t = 0;
						for (var i = 0; i < mood_list_res.length; i++) {
							m = stemmer.tokenizeAndStem(mood_list_res[i].mood_name);
							a = analyzer.getSentiment(m);
							arr.push(a);
							t += a;
						}

						userModel.addUserScore({ user_id: 1 }, t, function(err, score_res) {
							if (err)
								throw err;
							else {

							}
						});
					}
				});
			}
		});
		arr = [];
	}

	if (rose != '') {
		rose = rose.split(',');
		for (var i = 0; i < rose.length; i++) {
			arr.push('('+1+',"'+date+'","'+rose[i]+'")');
		}
		diaryModel.addRTB('journal_rose', arr, function(err, rose_res) {
			if (err)
				throw err;
			else {

			}
		});
		arr = [];
	}

	if (thorn != '') {
		thorn = thorn.split(',');
		for (var i = 0; i < thorn.length; i++) {
			arr.push('('+1+',"'+date+'","'+thorn[i]+'")');
		}
		diaryModel.addRTB('journal_thorn', arr, function(err, rose_res) {
			if (err)
				throw err;
			else {

			}
		});
		arr = [];
	}

	if (bud != '') {
		bud = bud.split(',');
		for (var i = 0; i < bud.length; i++) {
			arr.push('('+1+',"'+date+'","'+bud[i]+'")');
		}
		diaryModel.addRTB('journal_bud', arr, function(err, rose_res) {
			if (err)
				throw err;
			else {

			}
		});
		arr = [];
	}

	res.redirect('/journal');
}

exports.postReminders = function(req, res) {
	var time = req.body.timepicker;
	while (time.includes(' ')) {
		time = time.replace(' ','');
	}
	var query = '('+1+',"'+req.body.date1+'","'+time+'","'+req.body.repeat+'","'+req.body.title+'")';

	diaryModel.addReminder(query, function(err, result) {
		if (err)
			throw err;
		else {
			res.redirect('/journal');
		}
	});
}

exports.deleteReminder = function(req ,res) {
	diaryModel.deleteReminder({ reminder_id: req.params.id }, function(err, result) {
		if (err)
			throw err;
		else {
			res.redirect('/journal');
		}
	});
}