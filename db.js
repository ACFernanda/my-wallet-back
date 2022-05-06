import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
  db = mongoClient.db("mywallet");
  console.log(chalk.bold.green("Banco de dados conectado."));
} catch (error) {
  console.log("Erro ao se conectar ao banco de dados.", error);
}

export default db;
