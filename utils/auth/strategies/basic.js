// voy a verificar si el usuario y pass q llega estan en la bd entonces devuelvo este 
// usuario sino devuelvo un error

const passport = require('passport'); // es un middleware que maneja diferente estrategia de autenticacion para nodejs
const { BasicStrategy } = require('passport-http'); // con este modulo atenticamo mediante http utilizando esquemas basicos.
const boom  = require('boom');
const bcrypt = require('bcrypt');
const mongoLib = require('../../../lib/mongo');

passport.use(
  // hacemos una autenticacion basicStrategy, es que cuando hacemo una peticion de tipo auth basic nos trae el user y pass
  new BasicStrategy( async(username, password, cb)=>{
    const mongoDB = new mongoLib();
    try {
      // obtenemos el user 
      const [user] = await mongoDB.getAll('users', {username});

      // si el usuario no existe, devolvemos un erro de q el usuario no esta autorizado.
      if (!user) {
        // devolvmeos error, no bueno y es mas no hay que hacerlo, de indicar si el usuario existe o no..
        return cb(boom.unauthorized(),false);
      }
      // compara el password con user.password hasheado, para ello usamos el bcrypt.
      if (!(await bcrypt.compare(password,user.password))) {
        // retornamos error si la comparacion es falsa.
        return cb(boom.unauthorized(),false);
      }
      // 
      return cb(null, user);

    } catch (error) {
      return cb(error);
    }
  })
);

