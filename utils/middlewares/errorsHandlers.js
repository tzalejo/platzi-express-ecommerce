// me permite mostrar los errores en una forma mas amigable, y tmb los  codigos de errores
// tiene una forma semantica mas amigable..
const boom = require('boom');

const { config } = require('../../config');
const Sentry = require('@sentry/node');
const debug = require('debug')('app:error');
const esRequesAjaxOApi = require('../../utils/esRequesAjaxOApi');
// sentry: de esta manera cualquier error q ocurra en nuestra app desplegada en producccion
// estara registrada en Sentry y podremos revisarlos y corregirlos proactivamente.
Sentry.init({ dsn: `https://${config.sentryDns}@sentry.io/${config.sentryId}`});

// para manejar el error 
function conErrorStack(err, stack){
  if (config.dev) { // si estoy en desarrollo, 
    // 
    return { ...err,stack }// esto es equivalente hacer Object.assign({},err,stack)
  }
}

// middlewares para mostar los log de los errores..
function logErrors(err,req,res,next){
  // console.log('middleword: logErrors');
  Sentry.captureException(err);
  debug(err.stack);
  next(err);// con next hago es pasar al siguiente middlewares
}

//
function wrapErrores(err, req, res, next){
  if(!err.isBoom){ //si el error esta instanciado..
    // utilizo sentry..
    Sentry.captureException(err);
    next(boom.badImplementation(err)); // error 500
  }
  // utilizo sentry..
  Sentry.captureException(err);
  // error boom...enviamos el err..
  next(err);
}

function  clienteErrorHandler(err,req,res,next){
  // catch errores de ajax request
  // verifica si la llamada fue con header especial ,
  // console.log('middleword: clienteErrorHandler');

  const  {
    output: {statusCode, payload}
  } = err;
  // cathc los errores por el request es de tipo ajax o por un error streaming
  if(esRequesAjaxOApi(req) || req.headersSent ){
    //
    res.status(statusCode).json(conErrorStack(payload,err.stack));
  }else{
    next(err);
  }
}

function errorHandler(err,req,res,next){
  const {
    output: {statusCode,payload}
  } = err;
  // console.log('statusCode: ',statusCode);
  res.status(statusCode);
  res.render('error',conErrorStack(payload,err.stack));
  
}

module.exports = {
  logErrors,
  wrapErrores,
  errorHandler,
  clienteErrorHandler
}