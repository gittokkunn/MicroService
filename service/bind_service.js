var service = require('express')();
var server = require('http').Server(service);
var io = require('socket.io')(server);
const ioClient = require('socket.io-client');
server.listen(3001);

var mongodb = require('mongodb');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

// 文字列連結
function bind_string(str1, str2) {
  return str1 + str2;
}
// 文字列送信
function emit_string(message) {
  var socket_client = ioClient.connect('http://localhost:3003');
  socket_client.json.emit('save_bindString_req', {
    message: message
  });
  socket_client.on('save_bindString_res', function() {
    console.log('文字列を保存しました');
  });
}

io.on('connection', function (socket) {
  socket.on('bind_string_req', function (data) {
    console.log(data);
    var message = bind_string(data['title'], data['body']);
    emit_string(message);
    socket.emit('bind_string_res', message);
  });
});
