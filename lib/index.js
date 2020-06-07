import express from "express";
import socketio from "./socketio";
import http from "http";
import router from "./router";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV === "development";

const corsOptions = {
  origin: true,
};

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));

socketio(server);

app.use(router);

server.listen(PORT, () =>
  console.log(
    `${
      isDevelopment ? "Development" : "Production"
    } Server has started on port ${PORT}`
  )
);
