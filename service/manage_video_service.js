var service = require('express')();
var server = require('http').Server(service);
var io = require('socket.io')(server);
const ioClient = require('socket.io-client');

server.listen(3002);

// 動画情報送信
function emit_video(data) {
  var socket_client = ioClient.connect('http://localhost:3003');
  socket_client.json.emit('save_video_req', data);
  socket_client.on('save_video_res', function() {
    console.log('動画を保存しました');
  });
}

// 動画一覧取得リクエスト送信
function get_video_list(callback) {
  var socket_client = ioClient.connect('http://localhost:3003');
  socket_client.emit('get_video_list_req');
  socket_client.on('get_video_list_res', function(data) {
    console.log('動画一覧を取得しました');
    callback(data);
  });
}

// 単一動画取得リクエスト送信
function get_video_by_filename(data, callback) {
  var socket_client = ioClient.connect('http://localhost:3003');
  socket_client.emit('get_video_by_filename_req', data);
  socket_client.on('get_video_by_filename_res', function(data) {
    console.log('動画を取得しました');
    callback(data);
  });
}

// 動画の更新通知送信
function nort_video_upload_req(data) {
  var socket_client = ioClient.connect('http://localhost:3004');
  socket_client.json.emit('nort_video_upload_req', {
    title: '新着動画のお知らせ',
    body:  data['filename'] + 'がアップロードされました！'
  });
  socket_client.on('upload_video_res', function() {
    console.log('通知しました');
  });
}

io.on('connection', function (socket) {
  // 動画アップロード
  socket.on('upload_video_req', function (data) {
    emit_video(data);
    nort_video_upload_req(data);
    console.log(data);
    socket.emit('upload_video_res');
  });

  // 動画一覧取得
  socket.on('get_video_list_req', function() {
    get_video_list(function(items) {
      socket.emit('get_video_list_res', items);
    })
  });

  // 単一動画取得
  socket.on('get_video_by_filename_req', function(data) {
    get_video_by_filename(data, function(item) {
      socket.emit('get_video_by_filename_res', item);
    });
  });
});
