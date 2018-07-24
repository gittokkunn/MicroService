
// TODO: メールサービスと通信
var app = require('../app'),
    io  = require('socket.io-client'),
    request = require('request');

function call_api(url, callback) {
  request.get({
    url: url,
    headers: {
      "content-type": "application/json"
    },
  }, function (error, response, body){
    result = JSON.parse(body);
    callback(result);
  });
}

exports.index = function(req, res) {
  url = "http://localhost:3000/api";
  call_api(url, function (result) {
    res.render('main.ejs', {result: result});
  })
};
