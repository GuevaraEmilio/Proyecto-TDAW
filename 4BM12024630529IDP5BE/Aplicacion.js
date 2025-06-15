const http = require('http');
const url = require('url');
const sequelize = require('./db');
const User = require('./User');

http.createServer(async function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.writeHead(200, { 'Content-Type': 'application/json' });

  let q = url.parse(request.url, true).query;
  let username = q.User;
  let password = q.password;

  console.log("user:", username);
  console.log("password:", password);

  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos con Sequelize");

    const foundUser = await User.findOne({ where: { username, password } });

    if (foundUser) {
      response.end(JSON.stringify({ status: 'yes', tipo: foundUser.type_user }));
    } else {
      response.end(JSON.stringify({ status: 'no', tipo: 'nodefinido' }));
    }

  } catch (err) {
    console.error("Error:", err);
    response.end(JSON.stringify({ status: 'error', error: err.message }));
  }

}).listen(9999, () => {
  console.log("Servidor corriendo en puerto 9999");
});
