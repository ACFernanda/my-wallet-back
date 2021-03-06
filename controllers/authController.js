import joi from "joi";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

import db from "./../db.js";

export async function signUp(req, res) {
  const signupInfo = req.body;
  if (signupInfo.password !== signupInfo.confirmPassword) {
    res.sendStatus(400);
    return;
  }

  delete signupInfo.confirmPassword;

  const signupInfoSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = signupInfoSchema.validate(signupInfo, {
    abortEarly: false,
  });
  if (error) {
    res.status(422).send(error.details.map((detail) => detail.message));
    return;
  }

  try {
    const encryptedPassword = bcrypt.hashSync(signupInfo.password, 10);
    await db
      .collection("users")
      .insertOne({ ...signupInfo, password: encryptedPassword });
    res.sendStatus(201);
  } catch (e) {
    res.status(500).send("Erro criando usuário.");
    console.log("Erro criando usuário.", e);
  }
}

export async function signIn(req, res) {
  const login = req.body;
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = loginSchema.validate(login, { abortEarly: false });
  if (error) {
    res.status(422).send(error.details.map((detail) => detail.message));
    return;
  }

  try {
    const user = await db.collection("users").findOne({ email: login.email });
    const username = user.name;
    if (!user) return res.sendStatus(404);
    if (user && bcrypt.compareSync(login.password, user.password)) {
      const token = v4();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      res.status(200).send({ token, username });
    } else res.sendStatus(404);
  } catch (e) {
    res.sendStatus(500);
    console.log("Erro ao entrar no app", e);
  }
}
