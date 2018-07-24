
var io = require('socket.io-client'),
    fs = require('fs');


exports.index = function(req, res) {
  res.render('youtube/index.ejs');
};

exports.list = function(req, res) {
  fs.readdir('./public/downloads/', function(err, files){
      if (err) throw err;
      console.log(files);
      res.render('youtube/list.ejs', {files: files});
  });
};

exports.show = function(req, res) {
  res.render('youtube/show.ejs', {filename: req.params.filename})
}

exports.setURL = function (req, res) {
  res.render('youtube/setURL.ejs');
}

exports.download = function (req, res) {
  var socket = io.connect('http://localhost:3005');
  socket.json.emit('download_video_req', {
    url: req.body.url,
    filename: req.body.filename
  });
  socket.on('download_video_res', function() {
    console.log('動画をダウンロードしました');
    res.redirect('/youtube');
  });
}
