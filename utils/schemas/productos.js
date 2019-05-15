const Joi = require('joi');

const productoIdSchema  = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const productoTagSchema = Joi.array().items(Joi.string().max(10));
const crearProductoSchema = {
  producto_nombre: Joi.string().max(50).required(),
  producto_precio: Joi.number().min(1).max(1000000),
  producto_imagen: Joi.string().required(),
  tags: productoTagSchema
};
const updateProductoSchema = {
  producto_nombre : Joi.string().max(50),
  producto_precio: Joi.number().min(1).max(1000000),
  producto_imagen: Joi.string(),
  tags : productoTagSchema
};

module.exports = {
  productoIdSchema,productoTagSchema,crearProductoSchema,updateProductoSchema
};