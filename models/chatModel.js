const mongoose = require('./connectionModel');

const chatMsgSchema = new mongoose.Schema({
    content: { type: String },
    author: { type: String, required: true }
  }
);

const chatMsg = mongoose.model('comments', chatMsgSchema);

exports.create = function(obj, next) {
  const chat = new chatMsg(obj);

  chat.save(function(err, chat) {
    next(err, chat);
  });
};