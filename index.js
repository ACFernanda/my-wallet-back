import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import transactionsRouter from "./routes/transactionsRouter.js";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

app.use(authRouter);

app.use(transactionsRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(chalk.bold.green(`Running on http://localhost:${port}`));
});
