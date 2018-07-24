var service = require('express')();
var server = require('http').Server(service);
var io = require('socket.io')(server);
var promise = require('bluebird');
server.listen(3003);

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var db = null;
var col = null;
const url = 'mongodb://localhost:27017';
const dbName = 'microService';

function connect_db() {
  MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to server");
    db = client.db(dbName);
  });
}

connect_db();

function disconnect_db(client) {
  client.close();
}

// 文字列保存
function insert_message(col, message) {
  col.insert({message: message});
  console.log('保存しました');
}
// 動画保存
function insert_video(col, data) {
  col.insert({
    fieldname: data['fieldname'],
    originalname: data['originalname'],
    encoding: data['encoding'],
    mimetype: data['mimetype'],
    destination: data['destination'],
    filename: data['filename'],
    path: data['path'],
    size: data['size']
  });
  console.log('保存しました');
}

// 動画情報取得
function get_video_list(col, callback) {
  col.find({}).toArray( function (err, items){
    if (err) {
      console.log("error");
    }else {
      console.log('success');
      callback(items);
    }
  });
}

// 単一動画取得
function get_video_by_filename(col, filename, callback) {
  col.findOne({filename: filename}, function (err, item) {
    if (err) {
      console.log("error");
    }else {
      console.log('success');
      callback(item);
    }
  });
}

// 文字列一覧取得
function get_bind_list(col, callback) {
  col.find({}).toArray( function (err, items) {
    if (err) {
      console.log("error");
    }else {
      console.log('success');
      callback(items);
    }
  });
}

io.on('connection', function (socket) {
  ////////////// 連結文字列関連 ////////////////////
  // 連結文字列を保存
  socket.on('save_bindString_req', function (data) {
    console.log(data['message']);
    col = db.collection('bind_string');
    insert_message(col, data['message']);
    socket.emit('save_bindString_res', data);
  });
  // 連結文字列一覧取得
  socket.on('get_bind_list_req', function() {
    col = db.collection('bind_string');
    get_bind_list(col, function(items) {
      console.log(items);
      socket.emit('get_bind_list_res', items);
    });
  });
  ////////////// 動画関連 /////////////////////////////
  // 動画保存
  socket.on('save_video_req', function (data) {
    console.log(data);
    col = db.collection('video');
    insert_video(col, data);
    socket.emit('save_video_res');
  })
  // 動画一覧取得
  socket.on('get_video_list_req', function() {
    col = db.collection('video');
    get_video_list(col, function(items) {
      socket.emit('get_video_list_res', items);
    });
  });
  // 単一動画取得
  socket.on('get_video_by_filename_req', function(data) {
    col = db.collection('video');
    filename = data['filename']
    console.log(filename);
    get_video_by_filename(col, filename, function(item) {
      console.log(item);
      socket.emit('get_video_by_filename_res', item);
    });
  });
});
