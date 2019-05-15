const express = require('express');
// const bodyParser = require('body-parser');
const router = express.Router();

// requerimos los servicios de productos
const ProductosService = require('../../services/productos');

const passport = require('passport');
// validador de esquemas..usando libreria Joi
const { productoIdSchema, productoTagSchema, crearProductoSchema, updateProductoSchema } = require('../../utils/schemas/productos');
const validar = require('../../utils/middlewares/validacionHandler');

// Para el manejo de cache..
const cacheResponse = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time');


// jwt para implementar jwt a las rutas, y asi verificar si el usuario 
// contiene un jwt atentico.
require('../../utils/auth/strategies/jwt');

const productoService = new ProductosService(); // instanciamso el servicio, ya q es una clase


// listado de productos
router.get('/', async (req, res, next) => {
  // para el manejo de cache en modo produccion
  cacheResponse(res,FIVE_MINUTES_IN_SECONDS);
  const { tags } = req.query;// si viene query filtramos x el tags..
  try {
    const productos = await productoService.getProductos({ tags });
    //.json esto indica que vamos a devolver un json..
    res.status(200).json({
      // uso de mock: se le dice a datos q no vienen  de la bd..osea son datos estaticos.
      data: productos,
      message: 'listado de productos'
    });

  } catch (error) {
    next(error);
  }
});

//obtengo un producto individual
router.get('/:productoId', async (req, res, next) => {

    // para el manejo de cache en modo produccion
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);

  // obtengo el id producto de los parametros..
  const { productoId } = req.params;
  // console.log('req', req.params);
  try {
    const eliminarProducto = await productoService.getProducto({ productoId });

    //.json esto indica que vamos a devolver un json..
    res.status(200).json({
      // uso de mock: se le dice a datos q no vienen  de la bd..osea son datos estaticos.
      data: eliminarProducto, // indicamos el producto que queremos..osea en la posicion 0
      message: 'producto recuperado'
    });

  } catch (error) {
    next(error);
  }
});

// crea un producto 
router.post('/',
  validar(crearProductoSchema), // validamos el esquema antes de llamar a la ruta
  async (req, res) => {
    try {
      const { body: producto } = req;//body:producto esto es un alias..
      const postProducto = await productoService.createProducto({ producto });

      res.status(201).json({
        //.json esto indica que vamos a devolver un json..
        // uso de mock: se le dice a datos q no vienen  de la bd..osea son datos estaticos.
        data: postProducto,
        message: 'listado de productos'
      });

    } catch (error) {
      next(error);
    }
  });

// edicion en un producto..
router.put('/:productoId',
  passport.authenticate('jwt', { session: false }),//con esto indicamos q el usuario tiene q tener un jwt valido..
  validar({ productoId: productoIdSchema }, 'params'), // primero valida el id
  validar(updateProductoSchema), // luego valida el eschema 
  async (req, res, next) => {
    const { productoId } = req.params;
    const { body: producto } = req;    // si vamos a editar, necesitmos tmb los datos.

    try {
      const updateProd = await productoService.updateProducto({ productoId, producto });

      //.json esto indica que vamos a devolver un json..
      res.status(200).json({
        // uso de mock: se le dice a datos q no vienen  de la bd..osea son datos estaticos.
        data: updateProd,
        message: 'producto modificado'
      });

    } catch (error) {
      next(error);
    }
  });

// edicion en un producto..
router.patch('/:productoId', async (req, res, next) => {

  const { productoId } = req.params;
  const { body: producto } = req; // si vamos a editar, necesitmos tmb los datos.

  try {
    const patchProducto = await productoService.patchProducto({ productoId, producto });

    //.json esto indica que vamos a devolver un json..
    res.status(200).json({
      // uso de mock: se le dice a datos q no vienen  de la bd..osea son datos estaticos.
      data: patchProducto,
      message: 'producto modificado parcial'
    });

  } catch (error) {
    next(error);
  }
});

//elimino un producto 
router.delete('/:productoId',
  passport.authenticate('jwt', { session: false }),//con esto indicamos q el usuario tiene q tener un jwt valido..
  async (req, res, next) => {

    const { productoId } = req.params;
    try {
      const producto = await productoService.deleteProducto({ productoId });

      //.json esto indica que vamos a devolver un json..
      res.status(200).json({
        // uso de mock: se le dice a datos q no vienen  de la bd..osea son datos estaticos.
        data: producto,
        message: 'productos eliminado'
      });

    } catch (error) {
      next(error)
    }
  }
);

module.exports = router;