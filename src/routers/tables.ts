import { Router } from "express";
import {
  createTable,
  deleteTable,
  getTables,
  updateTable,
} from "../controller/tables.controller";

const tablesRouter: Router = Router();

tablesRouter.get("/", getTables);
tablesRouter.post("/", createTable);
tablesRouter.put("/:id", updateTable);
tablesRouter.put("/:id", deleteTable);

export default tablesRouter;
