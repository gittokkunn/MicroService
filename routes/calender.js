const io = require('socket.io-client');

exports.index = function(req, res) {
  res.render('calender/index.ejs');
}
