import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import { signIn, signUp } from "./controllers/authController";
import {
  postTransaction,
  getTransactions,
} from "./controllers/transactionsController";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

// { name, email, password, confirmPassword }
// fazer validação pra ver se o e-mail já existe
app.post("/sign-up", signUp);

// email, password
app.post("/sign-in", signIn);

app.get("/transactions", getTransactions);
// buscando transações

app.post("transactions", postTransaction);
// adicionar transação no formato:
// { value, description, type, day }

// REVISAR O QUE TEM NO .ENV
const port = process.env.PORT;
app.listen(port, () => {
  console.log(chalk.bold.green(`Running on http://localhost:${port}`));
});
