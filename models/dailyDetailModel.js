const mongoose = require('./connection');

const dailyDetailsSchema = new mongoose.Schema({
    user: { type: String, required: true },
    dailyDetailsname: { type: String },
    notes: [{
      note: { type: String }
    }],
    moods: [{
      moodArray:  { type: String, required: true }
    }],
    rose: [{
      roseArray: { type: String }
    }],
    thorn: [{
      thornArray: { type: String }
    }],
    bud: [{
      budArray: { type: String }
    }]
  }
);

const dailyDetails = mongoose.model('dailyDetail', dailyDetailsSchema);

// Saving a dailyDetails given the validated object
exports.create = function(obj, next) {
  const dailyDetails = new dailyDetails(obj);

  dailyDetails.save(function(err, dailyDetails) {
    next(err, dailyDetails);
  });
};

exports.getCount = function(req, next) {
  dailyDetails.find(req, function(err, post) {

  }).count(function(err, count) {
    next(err, count);
  });
};

// Retrieving a dailyDetails based on ID
exports.getAll = function(id, next) {
  dailyDetails.find(id, function(err, dailyDetails) {
    next(err, dailyDetails);
  });
};

// Retrieving just ONE dailyDetails based on a query (first one)
exports.getOne = function(query, next) {
  dailyDetails.findOne(query, function(err, dailyDetails) {
    next(err, dailyDetails);
  });
};

exports.findOneAndUpdate = function(query, update, opt, next) {
  dailyDetails.findOneAndUpdate(query, update, opt, function(err, dailyDetails) {
    next(err, dailyDetails);
  });
};

exports.deleteOne = function(filter, next) {
  dailyDetails.remove(filter, function(err, status) {
    next(err, status);
  });
}