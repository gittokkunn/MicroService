const io = require('socket.io-client'),
      fs = require('fs');

exports.index = function(req, res) {
  fs.readdir('./public/downloads/', function(err, files){
      if (err) throw err;
      var json = {
        files: files,
        api_name: "youtube_list"
      }
      var json_str = JSON.stringify(json)
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.send(json_str);
  });

};
