//-h, --host               IP/Hostname for the database.
//-d, --database           Database name
// -u, --user               Username for database.
//-x, --pass               Password for database. If specified without providing
//-p, --port               Port number for database (not for sqlite). Ex:
//-e, --dialect            The dialect/engine(ex: mysql)
//example
// node create -d controlGastos -h localhost -u root -p 3306 -e mysql
// el siguiente script crea la siguiente estructura si esta todo ok
// constroller
// models
// routes
// db

var host ,database, user,port;
var pass='';
var dialect= 'mysql';
fs = require('fs');

/** toma los argumentos de la consola, esta forma tiene problemas cuando un paametro viene null */
process.argv.forEach(function (val, index, array) {
  
    if(index>0){
         if(process.argv[index-1]=='-h'){
             host = val;
         }
         if(process.argv[index-1]=='-d'){
            database = val;
        }
        if(process.argv[index-1]=='-u'){
            user = val;
        }
        if(process.argv[index-1]=='-x'){
            pass = val;
        }
        if(process.argv[index-1]=='-p'){
            port = val;
        }
    }
   

 
  });

const Sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');
var sequelize;
if(host && database && user && port)
{
      sequelize = getConection();    

      sequelize.authenticate()
      .then(() => {
        console.log('--Conectado---');     
        //creo la estructura del modelo 
        createEstructura(sequelize) ;

      }
        )
      .catch(err => {
        console.log('No se conecto:'+err)
      })
}
/** //creo la estructura del modelo  */
async  function createEstructura(sequelize){
    //creo la estructura del modelo 
    console.log('creando modelo:');
    const options = { caseFile: 'l', caseModel: 'p', caseProp: 'c' };
    const auto = new SequelizeAuto(sequelize, null, null, options);
    await auto.run();
    console.log('------ok');  
    sequelize.authenticate()
    .then(() => {
         _createEstructura(sequelize);
    }).catch(err => {
      console.log('No se conecto*:'+err);
      sequelize = getConection();
      _createEstructura(sequelize);
    });
}
function getConection(){
   return new Sequelize(database, user, pass, {
        host: host,
        dialect: dialect,
      }) ;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
 /* genera un endPoint por ahora solo */ 
function getController(name,param){
  
    p=[];
    sp= '';
    valores= '{ }';
    /**verifico si tiene los campos de la tabla */
    if(param){
        sp= 'attributes:';
        p= JSON.stringify(param);
        valores= `{${sp} ${p} }`;
    }
    _name = '';    
    name.split('_').forEach(a=>{     
      _name += capitalizeFirstLetter(a);
    });
    return `var models = require("../db/db");

    exports.list_all_${_name} = function(req, res) {
        models.${_name}.findAll( ${valores} )
        .then(v => {
          var jsonString = JSON.stringify(v);       
          res.send(v);
        
        })
        .catch(err => {
          console.log(err)
        })
    }; `

}
async function _createEstructura(sequelize){
  
   //creo la estructura del modelo 
   var initModels = require("./models/init-models");
   var models = initModels(sequelize);
   console.log('------ ini modelo'); 
   // create database
   createDB('./db');
   //create  controller
   var tablas = [];
   await Object.keys(models).forEach(function (modelName) {
  
      console.log(`tabla:${modelName}`)
      tablas.push(modelName);
      models[modelName].findAll({  })
       .then(users => {
         var campos = null;
         if(users.length>0){
          campos =[]; 
          for(var k in users[0]['dataValues']){
            
            campos.push(k);
          }
        }
        createFile('./controllers',`${modelName.toLowerCase()}Controller.js`,getController(modelName,campos));
        
       })
       .catch(err => {
         console.log(err)
       });
       
     
   }); 
   console.log('---- create route:'+tablas.length);
   // por ultimo crea el route usando la variable tabla
   createRoutes('routes',tablas);
   console.log('--listo');
}
function createFile(controllerPath,name,content){
    try {
        //const controllerPath= './controller2';
        if (!fs.existsSync(controllerPath)){
            fs.mkdirSync(controllerPath);
        }
         
        const data = fs.writeFileSync(controllerPath+ '/'+name, content)
   
    } catch (err) {
    console.error(err)
    } 
}
/** crea la carpeta y el archivo db donde se almacena la configuracion de la base */
function createDB(controllerPath){

    const content= `const Sequelize = require('sequelize');

    var initModels = require("../models/init-models");
    const sequelize = new Sequelize('${database}', '${user}', '${pass}', {
        host: '${host}',
        dialect: '${dialect}',
      })
    var models = initModels(sequelize);
    
    module.exports = models;`;
    createFile(controllerPath,'db.js',content);
}
/** crea a el routes  instanciando los controllers */
function createRoutes(controllerPath,tablas){
    var contenido=`\n`;
    tablas.forEach(a=>{
        contenido+=`//--${a}---\n`;
        contenido+=`var ${a.toLowerCase()}Controller = require("../controllers/${a.toLowerCase()}Controller");\n`;
        contenido+=`app.route('/${a.toLowerCase()}').get(${a.toLowerCase()}Controller.list_all_${a});\n`;
        contenido+=`\n`;
        contenido+=`\n`;
    });
    const content= `'use strict';
    module.exports = function(app) {
        ${contenido}    
    }`;
    createFile(controllerPath,'index.js',content);
}