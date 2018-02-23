const http = require('http')
const Gun = require('gun')
const path = require('path');
const fs = require('fs');

var server = http.createServer(function(req, res){
  if (Gun.serve(req, res)){ return } // filters gun requests!
  fs.createReadStream(path.join(__dirname, 'dist', req.url))
    .on('error',function(){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(fs.readFileSync(path.join(__dirname, 'dist/index.html')));
  }).pipe(res);
});

server.listen(process.env.PORT || 80);
