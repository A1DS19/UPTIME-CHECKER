//Crear y exportar variables de configuracion

const enviorments = {};

//Staging(default) ambiente
enviorments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
};

//Production ambiente
enviorments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
};

//Determinar cual ambiente exportar
const currentENV =
  typeof process.env.NODE_ENV == 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : console.log(
        'VARIABLE DE DESARROLLO NO DEFINIDA\nPOR DEFECTO SERA AMBIENTE "staging"\n'
      );

//Revisar que los ambientes existan aqui
const enviormentToExport =
  typeof enviorments[currentENV] == 'object'
    ? enviorments[currentENV]
    : enviorments.staging;

module.exports = enviormentToExport;
