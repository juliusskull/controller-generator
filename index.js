const express = require('express')

var bodyParser = require("body-parser");
jwt = require('jsonwebtoken');

const app = express()
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

  
  var router = require("./routes/index");
  router(app);
 
