var http = require('http');

function compute() {
  for (let i = 0; i < 1e7; i++) {}
  console.log('lap xong roi');
}
process.nextTick(compute);

http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
  })
  .listen(5000, '127.0.0.1');
