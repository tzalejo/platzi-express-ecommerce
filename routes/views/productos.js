'use strict';
const express = require('express');
const router = express.Router();

// Para el manejo de cache..
const cacheResponse = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS } = require('../../utils/time');

// Para la variable dev..(desarrollo o produccion)
const {config} = require('../../config');

const ProductosServices = require('../../services/productos');
const productoServices = new ProductosServices();
router.get('/',async (req, res, next)=>{

  // indicamos el cache y losm mintuos q va a durar..
  cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
  
  const {tags } = req.params;
  try {
    //throw new Error('esto es un error');// produzco un error manual..
    const productos = await productoServices.getProductos({tags});
    // la variable dev es para indicar si estamos en modo desarrollo o produccion, y asi agregar .css minificado o no..
    res.render('productos',{ productos,dev: config.dev });
    
  } catch (error) {
    next(error)
  }
});
module.exports = router;