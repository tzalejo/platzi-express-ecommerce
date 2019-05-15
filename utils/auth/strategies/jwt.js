// implementamos jwt a nuestrar rutas para verificar 
// si quien tiene el jwt es un usuario autorizado o no..
// implementamos estrategia jwt(similar a la strategia basic)
// oritentada a si jwt esta bien firmado y si puedo sacar la informacion del usuario

const passport = require('passport');
const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const boom = require('boom');
const {config}  = require(' ../../../config/index');
const MongoLib = require('../../../lib/mongo');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (tokenPayload,cb)=>{
      const mongoDB = new MongoLib();
      try {
        // traemos el usuario, con tokenPayload.sub(sub de mi jwt)
        const [user] = await mongoDB.getAll('users',{username:tokenPayload.sub});
        
        // retornamos error si no existe el usuario..
        if (!user) {
          return cb(boom.unauthorized(), false); 
        }

        // devolvemos el usuario
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

