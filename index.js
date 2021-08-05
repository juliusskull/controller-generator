const express = require('express')

var bodyParser = require("body-parser");
const app = express()
const port = 3000;


  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  var router = require("./routes/index");
  router(app);