const http = require('http');
const url = require('url');
const sequelize = require('./db');
const User = require('./User');

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');

http.createServer(async function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (request.method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  }

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const method = request.method;

  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos con Sequelize");

    // GET /users - Listar todos
    if (pathname === '/users' && method === 'GET') {
      const users = await User.findAll();
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(users));
    }

    // POST /users - Crear nuevo
    else if (pathname === '/users' && method === 'POST') {
      let body = '';
      request.on('data', chunk => body += decoder.write(chunk));
      request.on('end', async () => {
        body += decoder.end();
        const data = JSON.parse(body);
        const newUser = await User.create(data);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(newUser));
      });
    }

    // PUT /users/:id - Actualizar usuario
    else if (pathname.startsWith('/users/') && method === 'PUT') {
      const id = pathname.split('/')[2];
      let body = '';
      request.on('data', chunk => body += decoder.write(chunk));
      request.on('end', async () => {
        body += decoder.end();
        const data = JSON.parse(body);
        await User.update(data, { where: { id } });
        response.writeHead(200);
        response.end(JSON.stringify({ status: 'updated' }));
      });
    }

    // DELETE /users/:id - Eliminar usuario
    else if (pathname.startsWith('/users/') && method === 'DELETE') {
      const id = pathname.split('/')[2];
      await User.destroy({ where: { id } });
      response.writeHead(200);
      response.end(JSON.stringify({ status: 'deleted' }));
    }

    // GET /?User=...&password=... - Login
    else if (pathname === '/' && parsedUrl.query.User && parsedUrl.query.password) {
      const { User: username, password } = parsedUrl.query;
      const foundUser = await User.findOne({ where: { username, password } });
      response.writeHead(200, { 'Content-Type': 'application/json' });
      if (foundUser) {
        response.end(JSON.stringify({ status: 'yes', tipo: foundUser.type_user }));
      } else {
        response.end(JSON.stringify({ status: 'no', tipo: 'nodefinido' }));
      }
    }

    else {
      response.writeHead(404);
      response.end(JSON.stringify({ error: 'Ruta no válida' }));
    }

  } catch (err) {
    console.error("Error:", err);
    response.writeHead(500);
    response.end(JSON.stringify({ error: err.message }));
  }

}).listen(9999, () => {
  console.log("Servidor corriendo en puerto 9999");
});


http.createServer(async function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (request.method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  }

  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const method = request.method;

  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos con Sequelize");

    // Endpoint registro - POST /register
    if (pathname === '/register' && method === 'POST') {
      let body = '';
      request.on('data', chunk => body += decoder.write(chunk));
      request.on('end', async () => {
        body += decoder.end();
        const data = JSON.parse(body);

        // Validar si ya existe usuario con ese username o email
        const existingUser = await User.findOne({ 
          where: { username: data.username } 
        });
        if (existingUser) {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ error: "El usuario ya existe" }));
          return;
        }

        // Crear usuario nuevo
        const newUser = await User.create(data);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(newUser));
      });
    }

    // GET /users - Listar todos
    else if (pathname === '/users' && method === 'GET') {
      // ... código existente ...
    }

    // POST /users - Crear nuevo
    else if (pathname === '/users' && method === 'POST') {
      // ... código existente ...
    }

    // PUT /users/:id - Actualizar usuario
    else if (pathname.startsWith('/users/') && method === 'PUT') {
      // ... código existente ...
    }

    // DELETE /users/:id - Eliminar usuario
    else if (pathname.startsWith('/users/') && method === 'DELETE') {
      // ... código existente ...
    }

    // GET /?User=...&password=... - Login
    else if (pathname === '/' && parsedUrl.query.User && parsedUrl.query.password) {
      // ... código existente ...
    }

    else {
      response.writeHead(404);
      response.end(JSON.stringify({ error: 'Ruta no válida' }));
    }

  } catch (err) {
    console.error("Error:", err);
    response.writeHead(500);
    response.end(JSON.stringify({ error: err.message }));
  }

}).listen(9999, () => {
  console.log("Servidor corriendo en puerto 9999");
});
