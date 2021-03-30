var userModel = require('../models/userModel.js');
const dataformatter = require('../public/js/dataformatter.js');

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

exports.getUser = function(req, res) {
	var query = {
		user_id: 1
	};

	userModel.getUser(query, function(err, user_res) {
		if (err)
			throw err;
		else {
			var desc;

			if (user_res[0].score >= 0 && user_res[0].score <= 30) {
				desc = 'Neutral';
			}
			else if (user_res[0].score < 0 && user_res[0].score >= 30) {
				desc = 'Productive';
			}
			else {
				desc = 'Unsatisfactory';
			}

			html_data = {
				user: user_res[0],
				time: timestamp,
				desc: desc
			}
			res.render('home', html_data);
		}
	});
}