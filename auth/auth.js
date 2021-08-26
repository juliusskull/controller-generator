exports.rp = function(app) {

config = require('./config.js');      


const express = require('express');

const rutasProtegidas = express.Router(); 
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['authorization'];
   
    if (token) {
      jwt.verify(token,  config.llave, (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    } 
  });  


  return rutasProtegidas;
}
exports.jwt= function(){
    jwt = require('jsonwebtoken');
    return jwt;
}
exports.val= function(){
    return true;
};

exports.authentication =  function(req, res){
    if(req.body.usuario === "asfo" && req.body.contrasena === "holamundo") {
      const payload = {
      check:  true
      };
      const token = jwt.sign(payload, config.llave, {
        expiresIn: 1440
      });
      res.json({
        mensaje: 'Autenticación correcta',
        token: token
      });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrectos"})
    }
}