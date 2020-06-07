import express from "express";
import socketio from "./socketio";
import http from "http";
import router from "./router";
import cors from "cors";
import { NODE_ENV } from "./envs";

const PORT = process.env.PORT || 5000;
const isProduction = NODE_ENV === "production";

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
      isProduction ? "Production" : "Development"
    } Server has started on port ${PORT}`
  )
);
