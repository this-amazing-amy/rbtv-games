const http = require('http')
const path = require('path');
const fs = require('fs');

var server = http.createServer(function(req, res) {
  fs.createReadStream(path.join(__dirname, 'dist', req.url))
    .on('error',function(){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(fs.readFileSync(path.join(__dirname, 'dist/index.html')));
  }).pipe(res);
});

server.listen(process.env.PORT || 80, () => { console.log('Listening...')});
