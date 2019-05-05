const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: './dist'
  });
})

server.listen(3500, () => {
});