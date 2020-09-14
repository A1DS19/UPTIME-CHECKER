const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const PORT = 3000 || process.env.PORT;

const server = http.createServer((req, res) => {
  //Tomar url y parsearla
  const parsedUrl = url.parse(req.url, true);

  //Tomar el path de la url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //Tomar el queryString del url
  const queryStringObject = parsedUrl.query;

  //Tomar metodo de request
  const reqMethod = req.method.toLowerCase();

  //Tomar headers como objeto
  const headers = req.headers;

  //Tomar el payload de request
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    res.end('Funciona?');
    console.log(buffer);
  });
});

server.listen(PORT, () => console.log(`SERVIDOR INICIADO\nPUERTO: ${PORT}`));
