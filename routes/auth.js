const router = require('express').Router();
const userController = require('../controller/userController.js');
const chatController = require('../controller/chatController.js');
const journalController = require('../controller/journalController.js');

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

router.get('/home', userController.getUser);

router.get('/chat', (req, res) => {
  res.render('chat', {
  	time: timestamp
  });
});

router.post('/ajaxchat', chatController.ajaxChat);
router.get('/ajaxres:msg', chatController.ajaxRes);

router.get('/ajaxGetDiary', journalController.ajaxGetDiary);
router.get('/journal', journalController.getJournal);
router.post('/diary', journalController.postJournal);
router.post('/reminder', journalController.postReminders);
router.get('/deleteReminder:id', journalController.deleteReminder);

router.get('/', (req, res) => {
  res.render('lockscreen', {
    time: timestamp
  });
});

module.exports = router;