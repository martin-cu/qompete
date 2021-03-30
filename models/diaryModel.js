var mysql = require('./connectionModel');
mysql = mysql.connection;

exports.deleteDiary = function(query, next) {
	var sql = "delete from journal_mood where ?; delete from journal_rose where ?; delete from journal_thorn where ?; delete from journal_bud where ?;";
	sql = mysql.format(sql, query);
	sql = mysql.format(sql, query);
	sql = mysql.format(sql, query);
	sql = mysql.format(sql, query);

	while(sql.includes(',')) {
		sql = sql.replace(',', ' and ');
	}
	console.log(sql);
	mysql.query(sql, next);
}

exports.addRTB = function(type, query, next) {
	var sql = "insert into ? (user_id, date, content) values";
	sql = mysql.format(sql, type);
	sql = sql.replace("'", ' ');
	sql = sql.replace("'", ' ');
	for (var i = 0; i < query.length; i++) {
		sql += query[i];
		if (i < query.length - 1)
			sql += ', ';
	}

	mysql.query(sql, next);
}

exports.addMood = function(query, next) {
	var sql = "insert into journal_mood (user_id, date, mood_id) values ";
	for (var i = 0; i < query.length; i++) {
		sql += query[i];
		if (i < query.length - 1)
			sql += ', ';
	}
	mysql.query(sql, next);
}

exports.addReminder = function(query, next) {
	var sql = "insert into reminders (user_id, date, time, `repeat`, title) values ";
	sql += query;

	mysql.query(sql, next);
}

exports.getReminder = function(query, next) {
	var sql = "select time_format(time, '%H:%i') as formattedTime, r.* from reminders as r where ?";
	sql = mysql.format(sql, query);
	sql = sql.replace(',', ' and');
	sql = sql.replace(',', ' and');
	sql = sql.replace(',', ' and');
	sql = sql.replace('and', ',');
	sql = sql.replace('and', ',');
	mysql.query(sql, next)
}

exports.deleteReminder = function(query, next) {
	var sql = "delete from reminders where ?";
	sql = mysql.format(sql, query);
	
	mysql.query(sql, next);
}

exports.getMarkedDates = function(query, next) {
	var sql = 'select date_format(t.date, "%e") as days from ( select date from journal_mood where user_id = 1 union select date from journal_rose where user_id = 1 union select date from journal_thorn where user_id = 1 union select date from journal_bud where user_id = 1 union select date from reminders where user_id = 1 ) as t group by t.date';
	mysql.query(sql, next);
}

exports.getMoodList = function(next) {
	var sql = 'select * from moods';
	mysql.query(sql, next);
}

exports.getChosenMoods = function(query, next) {
	var sql = 'select * from moods where ';
	for (var i = 0; i < query.length; i++) {
		sql += 'id = '+query[i];
		if (i < query.length - 1)
			sql += ' or ';
	}
	mysql.query(sql, next);
}

exports.getDiaryMood = function(query, next) {
	var sql = 'select * from journal_mood as jm join moods as m on m.id = jm.mood_id where ?';
	sql = mysql.format(sql, query);
	sql = sql.replace(',', ' and');
	mysql.query(sql, next);
}

exports.getDiaryRTB = function(type, query, next) {
	var sql = 'select * from ? where ?';
	sql = mysql.format(sql, type);
	sql = sql.replace("'", ' ');
	sql = sql.replace("'", ' ');
	sql = mysql.format(sql, query);
	sql = sql.replace(',', ' and');
	mysql.query(sql, next);
}
