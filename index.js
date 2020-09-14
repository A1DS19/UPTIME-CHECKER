const http = require('http');
const PORT = 3000 || process.env.PORT;

const server = http.createServer((req, res) => {
  res.end('Nuevo Server');
});

server.listen(PORT, () => console.log(`SERVIDOR INICIADO\nPUERTO: ${PORT}`));
