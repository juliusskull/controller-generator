'use strict';
    module.exports = function(app) {
 
    const auth= require('../auth/auth');

    
    app.route('/autenticar').post(auth.authentication);
    //--Gastos---
    var gastosController = require("../controllers/gastosController");

    app.route('/gastos')
            .get(auth.rp(app),gastosController.list_all_Gastos)
            .post(auth.rp,gastosController.create_a_Gastos)
            .put(auth.rp,gastosController.update_a_Gastos);
    app.route('/gastos/filter').post(gastosController.list_filter_Gastos)


    
    }