// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const cors = require("cors");

const ControllerFactory = require("./factories/controllerFactory");
const database = require("./Db/database");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

const port = 8000;

database.connect().then(() => {
  ControllerFactory.createController(app, "Answers").setupRoutes();
  ControllerFactory.createController(app, "Main").setupRoutes();
  ControllerFactory.createController(app, "Questions").setupRoutes();
  ControllerFactory.createController(app, "Tags").setupRoutes();
  ControllerFactory.createController(app, "Users").setupRoutes();
  ControllerFactory.createController(app, "Comments").setupRoutes();

  const server = app.listen(port, () => {
    console.log(`Server online. Database instance connected`);
  });

  // Handle server termination (CTRL+C)
  process.on("SIGINT", () => {
    server.close(() => {
      database.disconnect();
      process.exit(0);
    });
  });

  // Listening for the server close event
  server.on("close", () => {
    console.log("Server closed. Database instance disconnected");
  });
});
