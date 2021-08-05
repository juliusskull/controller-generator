controller-generator utiliza sequelize-auto y genera los controller del modelo creado
creando la siguiente estructura si se ejecuta correctamente:
./models
./constroller
./routes
./db
 
Para utilizar primero:
npm install

luego debe ejecutar:
node create -d nombreBaseDatos -h localhost -u root -p port -e mysql

Donde: 
-h, --host               IP/Hostname for the database.
-d, --database           Nombre de la base de datos
-u, --user               Username de la database.
-x, --pass               Password de la database. Debe tener privilegios
-p, --port               El puerto de la Base de datos (no  parasqlite). Ex:
-e, --dialect            dialect (ex: mysql)
