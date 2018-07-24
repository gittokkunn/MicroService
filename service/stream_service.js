var service = require('express')(),
    server = require('http').Server(service),
    io = require('socket.io')(server),
    ioClient = require('socket.io-client'),
    fs = require('fs'),
    streamlink = require('streamlink'),
    exec = require('child_process').exec;

server.listen(3006);

const DL_PATH = '../public/showrooms/';

// ストリームを保存
function exec_streamlink(url, filename, callback) {
  exec(`streamlink ${url} best -o ${filename}.ts`, (err, stdout, stderr) => {
    if (err) { console.log(err); }
    console.log(stdout);
    callback(stdout);
  });
}

// 保存されたファイルを変換
function convert_binary_to_video(filename, callback) {
  var cmd = `ffmpeg -i ${filename}.ts -vcodec libx264 -acodec aac -flags +loop-global_header -bsf:v h264_mp4toannexb -f segment -hls_list_size 0 -segment_format mpegts -segment_time 10 -segment_list ${filename}.m3u8 ${filename}_%04d.ts`
  exec(cmd, (err, stdout, stderr) => {
    if (err) { console.log(err); }
    console.log(stdout);
    callback(stdout);
  });
}
// 分割ファイルを連結
function bind_segment(filename, callback) {
  var cmd = `ffmpeg -i "${filename}.m3u8" -c copy ${filename}.ts`;
  exec(cmd, (err, stdout, stderr) => {
    if (err) { console.log(err); }
    console.log(stdout);
    callback(stdout);
  });
}

// ストリームダウンロード
function download_stream(data) {
  var url = data['url'];
  var filename = data['filename'];
  var filepath = DL_PATH + filename;
  exec_streamlink(url, filepath, function(stdout) {
    convert_binary_to_video(filepath, function (stdout) {
      bind_segment(filepath, function (res) {
        console.log(res);
      });
    });
  });
}

function exec_streamlink(url, filename, callback) {
  exec(`streamlink ${url} best -o ${filename}.ts`, (err, stdout, stderr) => {
    if (err) { console.log(err); }
    console.log(stdout);
    callback(stdout);
  });
}

io.on('connection', function (socket) {
  socket.on('download_stream_req', function (data) {
    console.log(data);
    download_stream(data);
    socket.emit('download_stream_res');
  });
});
