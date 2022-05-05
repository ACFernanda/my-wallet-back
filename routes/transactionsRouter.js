import { Router } from "express";

import {
  postTransaction,
  getTransactions,
} from "./../controllers/transactionsController.js";

const transactionsRouter = Router();

transactionsRouter.get("/transactions", getTransactions);
// buscando transações

transactionsRouter.post("transactions", postTransaction);
// adicionar transação no formato:
// { value, description, type, day }

export default transactionsRouter;
