const Joi = require('joi');
const boom = require('boom');


function validar(data,schema){
  const {error} = Joi.validate(data, schema);
  return error;
}

// vamos a validar() datos, osea evitar de q nos enviend a nuestro enpo datos que no corresponda al esquema q tenemos..
function validacionHandler(schema, check = 'body'){// funcion de tipo closures..
  return function(req, res, next){
    const error= validar(req[check],schema);
    error ? next(boom.badRequest(error)) : next();
  };
}
module.exports = validacionHandler;