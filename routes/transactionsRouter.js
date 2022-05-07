import { Router } from "express";

import {
  postTransaction,
  getTransactions,
} from "./../controllers/transactionsController.js";

import { validateToken } from "./../middlewares/tokenMiddleware.js";

const transactionsRouter = Router();

transactionsRouter.use(validateToken);

transactionsRouter.get("/transactions", getTransactions);

transactionsRouter.post("/transactions", postTransaction);

export default transactionsRouter;
