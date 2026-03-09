const { env } = require("./config/env");
const { connectToDatabase } = require("./config/db");
const { createApp } = require("./app");
const http = require("http");
const { Server } = require("socket.io");

async function main() {
  let dbConnected = false;
  if (!env.MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.warn(
      "MONGODB_URI is not set. API will start without database access."
    );
  } else {
    await connectToDatabase(env.MONGODB_URI);
    dbConnected = true;
  }

  const app = createApp({ dbConnected });
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        callback(null, origin || env.CLIENT_ORIGIN || true);
      },
      credentials: true,
    },
  });

  // Attach io to app to use in routes
  app.set("io", io);

  io.on("connection", (socket) => {
    // eslint-disable-next-line no-console
    console.log("Client connected:", socket.id);

    socket.on("join-admin", () => {
      socket.join("admin-room");
      // eslint-disable-next-line no-console
      console.log("Socket joined admin-room:", socket.id);
    });

    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

