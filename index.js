const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

//Instaciar server http
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () =>
  console.log(
    `SERVIDOR INICIADO\nPUERTO HTTP: ${config.httpPort}\nAMBIENTE: ${config.envName}`
  )
);

//Instaciar server https
const httsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httsServerOptions, (req, res) => {
  unifiedServer(req, res);
});
httpsServer.listen(config.httpsPort, () =>
  console.log(
    `SERVIDOR INICIADO\nPUERTO HTTPS: ${config.httpsPort}\nAMBIENTE: ${config.envName}`
  )
);

//Unir logica de server http y https
const unifiedServer = (req, res) => {
  //Tomar url y parsearla
  const parsedUrl = url.parse(req.url, true);

  //Tomar el path de la url
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //Tomar el queryString del url
  const queryStringObject = parsedUrl.query;

  //Tomar metodo de request
  const method = req.method.toLowerCase();

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

    //Escojer el handler del request
    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound;

    //Contruir objeto para enviar a handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };
    //Devolver ruta del request a el handler en el objeto router
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == 'number' ? statusCode : 200;
      payload = typeof payload == 'object' ? payload : {};

      //Convertir payload a string
      const payloadString = JSON.stringify(payload);

      //Devolver respuesta/El header devuelve json enves texto
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

const handlers = {};

handlers.notFound = (data, callback) => {
  //Callback devuelve 404 y ya
  callback(404);
};

handlers.ping = (data, callback) => {
  callback(200);
};

const router = {
  ping: handlers.ping,
};
