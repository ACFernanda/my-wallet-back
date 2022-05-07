import joi from "joi";
import dayjs from "dayjs";
import db from "./../db.js";

export async function postTransaction(req, res) {
  // adicionar transação no formato:
  // { userId, value, description, type, day }
  const { value, description, type } = req.body;

  const postSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().valid("input", "output").required(),
  });

  const { error } = postSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(422).send(error.details.map((detail) => detail.message));
    return;
  }

  const { user } = res.locals;
  const day = dayjs().format("DD/MM");
  try {
    await db.collection("transactions").insertOne({
      ...req.body,
      userId: user._id,
      day,
    });
    res.sendStatus(201);
  } catch (e) {
    res.status(500).send("Erro ao cadastrar transação");
    console.log("Erro ao cadastrar transação", e);
  }
}

export async function getTransactions(req, res) {
  try {
    const { user } = res.locals;
    const transactions = await db
      .collection("transactions")
      .find({ userId: user._id })
      .toArray();
    res.status(200).send(transactions);
  } catch (e) {
    res.status(500).send("Erro ao carregar transações");
    console.log("Erro ao carregar transações", e);
  }
}
