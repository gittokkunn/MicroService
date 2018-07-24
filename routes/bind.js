const io = require('socket.io-client');

exports.index = function(req, res) {
  var socket = io.connect('http://localhost:3003');
  socket.json.emit('get_bind_list_req');
  socket.on('get_bind_list_res', function(data) {
    console.log(data);
    res.render('bind/index.ejs', {binds: data});
  });
};

exports.proccall = function(req, res) {
  var socket = io.connect('http://localhost:3001');
  socket.json.emit('bind_string_req', {
    title: req.body.title,
    body: req.body.body
  });
  socket.on('bind_string_res', function(message) {
    console.log(message);
  });
  res.redirect('/bind');
}
