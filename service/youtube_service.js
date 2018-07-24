var service = require('express')(),
    server = require('http').Server(service),
    io = require('socket.io')(server),
    ioClient = require('socket.io-client'),
    fs = require('fs'),
    youtubedl = require('youtube-dl');

server.listen(3005);

const DL_PATH = '../public/downloads/';

// 動画ダウンロード
function download_video(data) {
  var video = youtubedl(data['url'],
  ['--format=18'],
  { cwd: __dirname });
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info.filename);
    console.log('size: ' + info.size);
  });
  video.pipe(fs.createWriteStream(DL_PATH + data['filename']));
}

io.on('connection', function (socket) {
  socket.on('download_video_req', function (data) {
    console.log(data);
    download_video(data);
    socket.emit('download_video_res');
  });
});
