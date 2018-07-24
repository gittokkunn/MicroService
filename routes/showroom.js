
var io = require('socket.io-client'),
    fs = require('fs');


exports.index = function(req, res) {
  res.render('showroom/index.ejs');
};

exports.list = function(req, res) {
  fs.readdir('./public/showrooms/', function(err, files){
      if (err) throw err;
      console.log(files);
      res.render('showroom/list.ejs', {files: files});
  });
};

exports.show = function(req, res) {
  res.render('showroom/show.ejs', {filename: req.params.filename})
}

exports.setURL = function (req, res) {
  res.render('showroom/setURL.ejs');
}

exports.download = function (req, res) {
  var socket = io.connect('http://localhost:3006');
  socket.json.emit('download_stream_req', {
    url: req.body.url,
    filename: req.body.filename
  });
  socket.on('download_stream_res', function() {
    console.log('動画をダウンロードしました');
    res.redirect('/showroom');
  });
}

exports.setNort = function (req, res) {
  res.render('showroom/setNort.ejs');
}

exports.nortification = function (req, res) {
  var socket = io.connect('http://localhost:3007');
  socket.json.emit('check_onLive_req', {
    id: req.body.id,
    status: req.body.status
  });
  socket.on('check_onLive_res', function() {
    console.log('配信通知を設定しました');
    res.redirect('/showroom');
  });
}
