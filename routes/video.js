
var io = require('socket.io-client');


exports.index = function(req, res) {
  var socket = io.connect('http://localhost:3002');
  socket.json.emit('get_video_list_req');
  socket.on('get_video_list_res', function(data) {
    console.log('動画一覧を取得しました');
    console.log(data);
    res.render('videos/index.ejs', {videos: data});
  });
};

exports.select = function (req, res) {
  res.render('videos/select.ejs');
}

exports.show = function (req, res) {
  var socket = io.connect('http://localhost:3002');
  socket.json.emit('get_video_by_filename_req', {
    filename: req.params.filename
  });
  socket.on('get_video_by_filename_res', function(data) {
    console.log('動画を取得しました');
    console.log(data);
    res.render('videos/show.ejs', {video: data});
  });
}

exports.upload = function(req, res) {
  var data = req.file;
  console.log(data);
  var socket = io.connect('http://localhost:3002');
  socket.json.emit('upload_video_req', data);
  socket.on('upload_video_res', function() {
    console.log('動画を保存しました');
  });
  res.redirect('/videos');
}
