import branchesRouter from "./routers/branches";
import express from "express";
import restaurantsRouter from "./routers/restaurants";
import tablesRouter from "./routers/tables";
import reservationRouter from "./routers/reservation";
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const db = require("./config/db/connectDatabase");
const cookieParser = require("cookie-parser");

// cors
const cors = require("cors");
const corsOptions = {
  origin: true,
  credentials: true,
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
