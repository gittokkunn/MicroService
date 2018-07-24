
// TODO: メールサービスと通信
var io = require('socket.io-client');

exports.index = function(req, res) {
  res.render('mail/index.ejs');
};

// メール作成
exports.new = function(req, res) {
  res.render('mail/new.ejs');
};

// メール送信
exports.send = function(req, res) {
  var socket = io.connect('http://localhost:3004');
  socket.json.emit('send_mail_req', {
    title: req.body.title,
    body: req.body.body
  });
  socket.on('send_mail_res', function() {
    console.log('メールを送信しました');
    res.redirect('/mail');
  });
};
