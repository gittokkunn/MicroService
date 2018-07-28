// Library
var express        = require('express'),
    app            = express(),
    ejs            = require('ejs'),
    bodyParser     = require('body-parser'),
    connect        = require('connect'),
    methodOverride = require('method-override'),
    connect        = require('connect'),
    cookieParser   = require('cookie-parser'),
    expressSession = require('express-session'),
    csrf           = require('csurf'),
    multer         = require('multer');

// Routes
var main = require('./routes/main'),
    post = require('./routes/post'),
    member = require('./routes/member'),
    bind = require('./routes/bind'),
    video = require('./routes/video'),
    mail = require('./routes/mail'),
    youtube = require('./routes/youtube'),
    twitter = require('./routes/twitter'),
    calender = require('./routes/calender'),
    showroom = require('./routes/showroom'),
    api = require('./routes/api');

// multer設定 (ファイル保存)
var storage = multer.diskStorage({
  // ファイルの保存先を指定
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  // ファイル名を指定(オリジナルのファイル名を指定)
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });


// Viewエンジンをejsに設定
app.engine = ('ejs', ejs.renderFile);
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(expressSession({secret: 'dldjfo'}));
// ファイル保存
app.use(upload.single('file'));

app.use(csrf());
app.use(function(req, res, next) {
  res.locals.csrftoken = req.csrfToken();
  next();
});
app.use(express.static('public'));


// ホーム
app.get('/', function(req, res) {
  res.render('index.ejs', {title: 'Webアプリ'});
});

// メインページ
app.get('/main', main.index);

// ブログ
//app.get('/posts', post.index);
//app.get('/posts/:id([0-9]+)', post.show);
//app.get('/posts/new', post.new);
//app.post('/posts/create', post.create);
//app.get('/posts/:id/edit', post.edit);
//app.put('/posts/:id', post.update);
//app.delete('/posts/:id', post.destroy);

// 文字列連結
app.get('/bind', bind.index);
app.post('/bind/proccall', bind.proccall);

// 動画
app.get('/videos', video.index);
app.get('/videos/select', video.select);
app.post('/videos/upload', video.upload);
app.get('/videos/:filename', video.show);

// メール
app.get('/mail', mail.index);
app.get('/mail/new', mail.new);
app.post('/mail/send', mail.send);

// Youtube
app.get('/youtube', youtube.index);
app.get('/youtube/list', youtube.list);
app.get('/youtube/setURL', youtube.setURL);
app.post('/youtube/download', youtube.download);
app.get('/youtube/:filename', youtube.show);

// SHOWROOM
app.get('/showroom', showroom.index);
app.get('/showroom/list', showroom.list);
app.get('/showroom/setURL', showroom.setURL);
app.get('/showroom/setNort', showroom.setNort);
app.post('/showroom/download', showroom.download);
app.post('/showroom/nortification', showroom.nortification);
app.get('/showroom/:filename', showroom.show);

// API
app.get('/api', api.index);

// カレンダー
app.get('/calender', calender.index);

// Twitter
app.get('/twitter', twitter.index);

// エラー処理
app.use(function(err, req, res, next) {
  res.send(err.message);
});

app.listen(3000);
console.log("server starting...");
