var service = require('express')(),
    server = require('http').Server(service),
    io = require('socket.io')(server),
    mailer = require('nodemailer'),
    ioClient = require('socket.io-client');

server.listen(3004);

//SMTPの設定
var smtpConfig = {
    //Webサービスを使う場合
    service: 'Gmail',
    auth: {
        host: 'smtp.gmail.com',
        user: '********@gmail.com',
        secure: true,
        pass: '********',
        port: 465
    }
};

// メール設定
function create_mail_opt(data) {
  // TODO: ユーザ対応
  var to = 'user <********@yahoo.co.jp>';
  //メールの内容
  var mailOpt = {
      from: 'admin <********@gmail.com>',
      to: to,
      subject: data['title'],
      html: data['body'] //HTMLタグが使えます
  };
  return mailOpt
}


// メール送信
function send_mail(data) {
  //SMTPの接続
  var transporter = mailer.createTransport(smtpConfig);
  var mailOptions = create_mail_opt(data);
  //メールの送信
  transporter.sendMail(mailOptions, function(err, res){
      //送信に失敗したとき
      if(err){
          console.log(err);
      //送信に成功したとき
      }else{
          console.log('Message sent: ' + res.message);
      }
      //SMTPの切断
      transporter.close();
  });
}


io.on('connection', function (socket) {
  // フォームの内容を送信
  socket.on('send_mail_req', function (data) {
    console.log(data);
    send_mail(data);
    socket.emit('send_mail_res');
  });
  // 動画のアップロード通知
  socket.on('nort_video_upload_req', function(data) {
    console.log(data);
    send_mail(data);
    socket.emit('nort_video_upload_res');
  });
  // ライブ配信開始通知
  socket.on('nort_onLive_req', function(data) {
    console.log(data);
    send_mail(data);
    socket.emit('nort_onLive_res');
  });


});
