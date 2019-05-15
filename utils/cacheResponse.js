// para el manejo de cache..solo vamos aplicar cache cuand estmos en modo produccion..
// porque en desarrollo puede causar problema.

const { config } = require('../config');

function cacheResponse(res, segundo){
  // si mi configuracion es distinto de desarrollo
  if (!config.dev) {
    // agrego un header .. indicamos cuando va a estar el cache..
    res.set('Cache-Control',`public, max-age=${segundo}`);
  }
}
module.exports = cacheResponse;