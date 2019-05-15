// conexion de mongo
const { MongoClient, ObjectId } = require('mongodb'); // conexiones, query, etc
const { config } = require('../config');

//debug
const debug = require('debug')('app:mongo');

// cuando usamos pass con caracteres especiales por ellos codificamos estos caracteres
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

const DB_NAME = config.dbName;
// authSource en nuevas versiones de mongo necesita esta especificacion

// const MONGO_URI  = `mongodb+srv://platzi_express-user:1MCFgxfbhrO46yxV@cluster0-ktsvw.mongodb.net/test?retryWrites=true`;
const MONGO_URI  = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true`;
// console.log('mi uri', MONGO_URI);
class MongoLib { //
  
  constructor(){
    //  crear un cliente(de la libreria mongoclient) 
    this.client = new MongoClient(MONGO_URI,{useNewUrlParser: true});
    this.dbName = DB_NAME; // lo usaremos mas adelante el nombre d la bd..
  }

  connect(){
    // retornamos un promesa..por ellos asyn await mas adelante..
    return new Promise((resolve,reject)=>{
      // metodo de mongoclient(this.client)
      this.client.connect(error=>{
        if (error) {
          reject(error);
        }
        debug('Conectado con exito a Mongo', this.dbName);
        // resolvemos con el client conectado a l bd que le pasamos..
        resolve(this.client.db(this.dbName)); 
      });
    });
  }

  // listar todas los items de productos
  getAll(collection,query){
    return this.connect().then(db =>{
      return db
        .collection(collection)
        .find(query)
        .toArray();
    })
  }

  get(collection,id){
    return this.connect().then(db =>{
      return db
        .collection(collection)
        .findOne({_id: ObjectId(id)}); // cuando hacemso query x id , mongo trata los id con ObjectId, para hacer la busqueda sin problema. 
    });
  }
  create(collection,data){
    return this.connect()
    .then(db=>{
      return db
        .collection(collection)
        .insertOne(data);
    })
    .then(result=>result.insertedId);
  }

  update(collection,id,data){
    return this.connect()
      .then(db=>{
        return db
          .collection(collection)
          .updateOne({_id: ObjectId(id)},{$set: data},{upsert:true});
      })
      .then(result => result.upsertedId || id);
  }

  delete(collection,id){
    return this.connect()
      .then(db =>{
        return db
          .collection(collection)
          .deleteOne({_id: ObjectId(id)});
      })
      .then(() => id);
  }
}
module.exports = MongoLib;