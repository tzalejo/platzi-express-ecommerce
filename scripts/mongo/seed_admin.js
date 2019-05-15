// script para generar un usuario admin..
const bcrypt =  require('bcrypt');
const chalk = require('chalk');
const MongoLib = require('../../lib/mongo');
const { config } = require('../../config');
//debug
const debug = require('debug')('app:admin');
// para construir el usuario admin
function buildAdminUser(password){
  return {
    password,
    username: config.authAdminUsername,
    email: config.authAdminEmail
  }

}

// crea un usuario admin
async function createAdminUser(mongoDB){
  // creqo un pass hasheado
  const hashedPassword = await bcrypt.hash(config.authAdminPassword,10);
  // creamos el usuario usando mongoLib dnd pasamos la colletion(users) y la construccion del usuario Admin.
  const userId = await mongoDB.create('users',buildAdminUser(hashedPassword));
  // devolvemos el id del usuario..
  return userId;
}
async function hasAdminUser(mongoDB){
  // realiza una busqueda del usuario 
  const adminUser = await mongoDB.getAll("users",{
    username: config.authAdminUsername
  });
  return adminUser && adminUser.length;
}

// seedAdmin 
async function seedAdmin(){
  try {
    // instancio 
    const mongoDB = new MongoLib();
    // verifico si ya tengo creado un usuario admin..
    if (await hasAdminUser(mongoDB)) {
      // muestro por consolo un cartel..con chalk me muestra con color el cartel..
      console.log(chalk.yellow('El Usuario Admin ya esta creado.'));
      return process.exit(1);// termino el proceso..
    }
    const adminUserId = await createAdminUser(mongoDB);
    console.log(chalk.green('Se creo el Usuario Admin con el id = ', adminUserId));
    return process.exit(0);

  } catch (error) {
    debug(chalk.red(error));
    return process.exit(1);
    
  }
}
// ejecutmaos este escript para generar un usuario y password 
seedAdmin();