var service = require('express')(),
    server = require('http').Server(service),
    io = require('socket.io')(server),
    ioClient = require('socket.io-client'),
    client = require('cheerio-httpcli'),
    CronJob = require('cron').CronJob;

server.listen(3007);
const prof_url = 'https://www.showroom-live.com/room/profile?room_id=';
const live_url = 'https://www.showroom-live.com';

var cronTime = "*/5 * * * *"; // ５分おきに実行
function set_chk_job(id) {
  var chk_job = new CronJob({
    cronTime: cronTime
    //指定時に実行したい関数
    , onTick: nort_onLive(id)
    // , onComplete: function() {
    //   console.log('onComplete!')
    // }
    , start: false
    , timeZone: "Asia/Tokyo"
  });
  return chk_job;
}

var chk_job = null;

// 配信中かの情報を取得
function chk_onLive(url, callback) {
  client.fetch(url, function (err, $, res) {
    var icon = $('.room-profile-action-icon').attr('class');
    var class_list = icon.split(' ');
    if (or_active(class_list)) {
      callback(1);
    }else callback(0);
  });
}
// ライブ中か確認
function or_active(class_list) {
  var active = "is-active";
  if (class_list.indexOf(active)>=0) {
    return 1;
  }else return 0;
}

// ルームの名前を取得
function get_room_info(url, callback) {
  client.fetch(url, function (err, $, res) {
    var roomName = $('.room-profile-head-main h2.room-profile-head-name').text();
    var livePATH = $('.l-room-profile-head-action-menu').find('a').attr('href');
    var live_info = {
      name: roomName,
      url: live_url+livePATH
    }
    callback(live_info);
  });
}


// メールで通知
function nort_onLive_req(data) {
  var socket_client = ioClient.connect('http://localhost:3004');
  socket_client.json.emit('nort_onLive_req', {
    title: 'ライブ配信開始のお知らせ',
    body: data['name'] + 'のライブ配信が始まりました！'
  });
  console.log(data);
  socket_client.on('nort_onLive_res', function() {
    console.log('ライブが始まりました');
  });
}

// 配信開始を通知
function nort_onLive(id) {
  url = prof_url + id;
  chk_onLive(url, function(result) {
    if(result) {
      get_room_info(url, function(info) {
        nort_onLive_req(info);
      });
    }
  });
}

io.on('connection', function (socket) {
  socket.on('check_onLive_req', function (data) {
    var id = data['id'];
    var status = data['status'];
    console.log(data);
    chk_job = set_chk_job(id);
    if (status) chk_job.start();
    else chk_job.stop();
    socket.emit('check_onLive_res');
  });
});
