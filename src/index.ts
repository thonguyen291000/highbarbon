import branchesRouter from "./routers/branches";
import express from "express";
import restaurantsRouter from "./routers/restaurants";
import tablesRouter from "./routers/tables";
import reservationRouter from "./routers/reservation";
import trackRouter from "./routers/tracks";
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const db = require("./config/db/connectDatabase");
const cookieParser = require("cookie-parser");

// cors
const cors = require("cors");
const whitelist = [
  "https://662d36b252d90ffd49907696--flourishing-swan-3e332f.netlify.app",
  "http://localhost:5173",
];
const corsOptions = {
  origin: function (origin: string, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());

//Router
app.use("/api/branches", branchesRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/tables", tablesRouter);
app.use("/api/reservation", reservationRouter);
app.use("/api/track", trackRouter);

//Connect Database
db.connectDatabase();

let PORT: undefined | string;
process.env.STATUS === "production"
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

const httpServer = require("http").createServer(app);
httpServer.listen(PORT, function () {
  console.log(`Server in ${process.env.STATUS} mode, listening on ${PORT}`);
});

export default app;
