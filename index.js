'use strcit';
const express = require('express');
const path = require('path');
const productosRouter = require('./routes/views/productos');
const productosApiRouter = require('./routes/api/productos');
const bodyParser = require('body-parser');// para procesar cuerpos que viene en formato json
const { logErrors, wrapErrores, errorHandler, clienteErrorHandler } = require('./utils/middlewares/errorsHandlers');
const esRequesAjaxOApi = require('./utils/esRequesAjaxOApi');
const authApiRouter = require('./routes/api/auth');
// configuramos el http hedears
const helmet = require('helmet');

const boom = require('boom');
// para debugear
const debug = require('debug')('app:server');

// inicializamos app
const app = express();
// middleware:

app.use(helmet()); // helmet ya tiene condfiguracion por defecto..
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());// para procesar cuerpos que viene en formato json

// archivos estatico
// defino mi  carpeta estatica y le indico la direccion, el cual crea una ruta de acceso inmediato a todo
// los archivos estaticos, imagenes o scripts, y asi poder acceder a ellos desde cualquier lugar sin importar la ubicacion 
app.use('/static',express.static(path.join(__dirname,'public')));

// definimos la carpeta de vistas
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');//pug:motor de plantilla de alto rendimiento..

// ruta 
app.use('/productos',productosRouter);
app.use('/api/productos', productosApiRouter);
app.use('/api/auth',authApiRouter);

app.get('/',(req,res)=>{ // redirecter
  res.redirect('/productos');
});

// pagina 404, siempre al ultimo de las rutas..
// middleware 404 no es considerado un middleware de error, sino un middleware comun..
// y como ninguna ruta respondio es cuando no encuentra la pagina..
app.use(function(req,res,next){
  // voy a verificar si mostrar api 404 o pagina 404
  if(esRequesAjaxOApi(req)){
    //  como vamos a recibir un error de tipo boom, lo instanciamos
    const {
      output:{ statusCode, payload }
    } =boom.notFound(); // instanciamos el objeto boom..
    res.status(statusCode).json(payload);
  }
  // redireccionamos a la pagina 404..
  res.status(404).render('404');
})

// ejecutamos los middleware para verificar si hay algun error y cachtearlo(error handlers)
app.use(logErrors);
app.use(wrapErrores);
app.use(clienteErrorHandler);
app.use(errorHandler);

const server = app.listen(app.get('port'),()=>{
  debug(`Escuchando en http://localhost:${app.get('port')}`);
});


