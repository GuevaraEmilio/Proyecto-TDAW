const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const sequelize = require("./db");
const User = require("./User");
const Score = require("./Score");

const decoder = new StringDecoder("utf-8");

// Configurar las relaciones
User.hasMany(Score, { foreignKey: "userId", as: "scores" });
Score.belongsTo(User, { foreignKey: "userId", as: "user" });

http
  .createServer(async function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type"); // <-- agrega esta línea

    if (request.method === "OPTIONS") {
      response.writeHead(200);
      response.end();
      return;
    }

    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;

    try {
      await sequelize.authenticate();
      console.log("Conectado a la base de datos");

      // LOGIN (usado para autenticación si aplica)
      if (
        pathname === "/" &&
        method === "GET" &&
        parsedUrl.query.User &&
        parsedUrl.query.password
      ) {
        const { User: username, password } = parsedUrl.query;
        console.log("Intento de login:", username, password);
        try {
          const foundUser = await User.findOne({
            where: { username, password },
          });
          console.log("Resultado de búsqueda:", foundUser);
          response.writeHead(200, { "Content-Type": "application/json" });
          if (foundUser) {
            response.end(
              JSON.stringify({
                status: "yes",
                tipo: foundUser.type_user,
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
              })
            );
          } else {
            response.end(JSON.stringify({ status: "no", tipo: "nodefinido" }));
          }
        } catch (err) {
          console.error("Error en login:", err);
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ error: err.message }));
        }
        return;
      }

      // Rutas de puntajes
      // GET /highscores: devuelve top 10 puntajes globales
      // GET /score
      // GET /score
      else if (pathname === "/score" && method === "GET") {
        const scores = await Score.findAll({
          include: [{ model: User, as: "user", attributes: ["username"] }],
          order: [["score", "DESC"]],
          limit: 10,
        });

        const formattedScores = scores.map((s) => ({
          username: s.user.username,
          score: s.score,
        }));

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(formattedScores));
      }

      //Scores
      else if (
        pathname === "/score/user" &&
        method === "GET" &&
        parsedUrl.query.id
      ) {
        const userId = parsedUrl.query.id;

        try {
          const scores = await Score.findAll({
            where: { userId },
            include: [{ model: User, as: "user", attributes: ["username"] }],
            order: [["score", "DESC"]],
            limit: 10,
          });

          const formatted = scores.map((s) => ({
            username: s.user.username,
            score: s.score,
          }));

          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(formatted));
        } catch (err) {
          console.error("Error al obtener puntajes del usuario:", err);
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(JSON.stringify([]));
        }
      }

      //Método POST para scores
      else if (pathname === "/scores" && method === "POST") {
        let body = "";
        request.on("data", (chunk) => (body += decoder.write(chunk)));
        request.on("end", async () => {
          body += decoder.end();
          try {
            const { userId, score } = JSON.parse(body);

            if (!userId || score == null) {
              response.writeHead(400, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ error: "Faltan datos: userId o score" })
              );
              return;
            }

            const newScore = await Score.create({ userId, score });
            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify(newScore));
          } catch (err) {
            console.error("Error en POST /score:", err);
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({ error: "Error interno al guardar puntaje" })
            );
          }
        });
      }

      // REGISTRO de usuario
      else if (pathname === "/register" && method === "POST") {
        let body = "";
        request.on("data", (chunk) => (body += decoder.write(chunk)));
        request.on("end", async () => {
          body += decoder.end();
          const data = JSON.parse(body);

          const existing = await User.findOne({
            where: { username: data.username },
          });
          if (existing) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "El usuario ya existe" }));
            return;
          }

          const newUser = await User.create(data);
          response.writeHead(201, { "Content-Type": "application/json" });
          response.end(JSON.stringify(newUser));
        });
      }

      // LISTAR USUARIOS
      else if (pathname === "/users" && method === "GET") {
        const users = await User.findAll();
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(users));
      }
      // CREAR USUARIO
      else if (pathname === "/users" && method === "POST") {
        let body = "";
        request.on("data", (chunk) => (body += decoder.write(chunk)));
        request.on("end", async () => {
          body += decoder.end();
          const data = JSON.parse(body);
          const newUser = await User.create(data);
          response.writeHead(201, { "Content-Type": "application/json" });
          response.end(JSON.stringify(newUser));
        });
      }
      // ACTUALIZAR USUARIO
      else if (pathname.startsWith("/users/") && method === "PUT") {
        const id = pathname.split("/")[2];
        let body = "";
        request.on("data", (chunk) => (body += decoder.write(chunk)));
        request.on("end", async () => {
          body += decoder.end();
          const data = JSON.parse(body);
          await User.update(data, { where: { id } });
          response.writeHead(200);
          response.end(JSON.stringify({ status: "updated" }));
        });
      }
      // ELIMINAR USUARIO
      else if (pathname.startsWith("/users/") && method === "DELETE") {
        const id = pathname.split("/")[2];
        await User.destroy({ where: { id } });
        response.writeHead(200);
        response.end(JSON.stringify({ status: "deleted" }));
      }
      // Ruta no válida
      else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Ruta no válida" }));
      }
    } catch (err) {
      console.error("❌ Error:", err);
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: err.message }));
    }
  })
  .listen(9999, () => {
    console.log("🚀 Servidor corriendo en puerto 9999");
  });
