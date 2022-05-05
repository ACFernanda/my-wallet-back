import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter";
import transactionsRouter from "./routes/transactionsRouter";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

app.use(authRouter);

app.use(transactionsRouter);

// REVISAR O QUE TEM NO .ENV
const port = process.env.PORT;
app.listen(port, () => {
  console.log(chalk.bold.green(`Running on http://localhost:${port}`));
});
