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

  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collections("sessions").findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    await db.collections("transactions").insertOne({
      userId: session.userId,
      value,
      description,
      type,
      day: dayjs(Date.now).format("DD/MM"),
    });

    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
    console.log("Erro ao cadastrar transação", e);
  }
}

export async function getTransactions(req, res) {
  // buscando transações
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await db.collections("sessions").findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collections("users").findOne({
      _id: session.userId,
    });

    if (user) {
      const transactions = await db
        .collections("transactions")
        .findMany({ userId: user._id })
        .toArray();
      res.status(200).send(transactions);
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.sendStatus(500);
    console.log("Erro ao carregar transações", e);
  }
}
