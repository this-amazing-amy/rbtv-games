const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  fs.createReadStream(path.join(__dirname, 'dist', req.url))
    .on('error', () => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(path.join(__dirname, 'dist/index.html')));
    }).pipe(res);
});

server.listen(process.env.PORT || 80, () => { console.log('Listening...'); });
