
// para leer .env usaremos la libreria .env : npm i -S dotenv

// lo que hago es carga las variables de entorno desde .env, las variables 
// de entorno son solo variables que existen en el sistema operativo, y es un mecanismo 
// de seguridad para que nadien pueda tomar esos valores..
require('dotenv').config(); 

const config = {
  // para indicar si estamos en modo desarrollo o produccion
  dev: process.env.NODE_ENV !== 'production',
  // variables para conexion mongo_atlas
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  
  // variables para sentry.
  sentryDns: process.env.SENTRY_DNS,
  sentryId:  process.env.SENTRY_ID,
  
  // auth
  authAdminUsername :  process.env.AUTH_ADMIN_USERNAME,
  authAdminPassword :  process.env.AUTH_ADMIN_PASSWORD,
  authAdminEmail    :  process.env.AUTH_ADMIN_EMAIL,
  authJwtSecret     :  process.env.AUTH_JWT_SECRET

};
module.exports = { config };