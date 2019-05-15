const express = require('express');
const passport = require('passport');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const api = express.Router();

const { config } = require('../../config/index');

// basic strategy, para usar el tipo de estrategia que usaremos en passport.authenticate
// require(' ../../utils/auth/strategies/basic');
require('../../utils/auth/strategies/basic');

api.post('/token',async(req,res,next)=>{
  passport.authenticate('basic',(error,user)=>{
    try {
      // verifico si el usuario existe..
      if (error || !user) {
        next(boom.authenticate());// envio boom si no exite..
      }

      req.login(user, {session: false}, async (error)=>{
        
        if (error) {
          next(error);
        }
        // devolvemos solo el usario y email, no devolvemos datos sensible..
        const payload = {sub: user.username,email: user.email}
        // 
        const token = jwt.sign(payload,config.authJwtSecret,{
          expiresIn: '15min' // tiempo de expiracion del token..
        });
        // devolvemos estado 200 con el token..
        return res.status(200).json({access_token: token});
      });
    } catch (error) {
      next(error);
    }
  })(req,res,next);
});

module.exports = api;