// servicios..conexion con la bd de mongo..

const productosMocks =require('../utils/mocks/productos');
// para la conexion de mongo..
const MongoLib = require('../lib/mongo');


class ProductosService{
  constructor(){
    this.collection = 'productos';// que coleccion vamos a consultasr..
    this.mongoDB = new MongoLib(); // creamos una instancia, 
  }

  // arg: es un objeto para q en el futuro si necesito escalar,sea mas facil..
  async getProductos({tags}){// esto es asincrono..osea vamos a consumir una libreria de bd q no nos va a responder inmediatamente. 
    // es la forma de crean un query, preg si tags existe creamos un query( propiedad:{ $in: variable}) -> {} es un objeto 
    const query = tags && { tags: {$in: tags}}; 
    const productos = await this.mongoDB.getAll(this.collection,query);
    return productos || []; // si no tenemos productos devuelve vacio..
    // return Promise.resolve(productosMocks);
  }
  async getProducto({productoId}){
    const producto = await this.mongoDB.get(this.collection, productoId);
    return producto || {};
  }
  
  async createProducto({producto}){
    // crea un producto..
    const createProd = await this.mongoDB.create(this.collection,producto);
    return createProd || {};
  }

  async updateProducto({productoId, producto}){
    // actualiza un producto..
    // console.log('body: ', producto);
    const updateProductoId = await this.mongoDB.update(this.collection,productoId,producto);
    return updateProductoId;
  }

  async deleteProducto({productoId}){
    // actualiza un producto..
    const deleteProd  = await this.mongoDB.delete(this.collection,productoId);
    return deleteProd;
  }

}

module.exports= ProductosService;