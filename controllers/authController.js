import joi from "joi";
import bcrypt from "bcrypt";

import db from "./db.js";

export async function signUp(req, res) {
  const signupInfo = req.body;

  if (signupInfo.password !== signupInfo.confirmPassword) {
    res.sendStatus(400);
    return;
  }

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
    const encryptedPassword = bcrypt.hashSync(signupInfo.senha, 10);
    await db
      .collection("users")
      .insertOne({ ...signupInfo, password: encryptedPassword });
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
    console.log("Erro ao registrar", e);
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
    if (user && bcrypt.compareSync(login.password, user.password)) {
      const token = v4();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      res.send(token);
    } else res.sendStatus(404);
  } catch (e) {
    res.sendStatus(500);
    console.log("Erro ao entrar no app", e);
  }
}
