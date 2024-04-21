import { Router } from "express";
import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "../controller/branches.controller";

const branchesRouter: Router = Router();

branchesRouter.get("/", getBranches);
branchesRouter.post("/", createBranch);
branchesRouter.put("/:id", updateBranch);
branchesRouter.put("/:id", deleteBranch);

export default branchesRouter;
