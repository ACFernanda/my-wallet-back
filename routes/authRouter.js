import { Router } from "express";
import { signIn, signUp } from "./../controllers/authController.js";

const authRouter = Router();

// { name, email, password, confirmPassword }
// fazer validação pra ver se o e-mail já existe
authRouter.post("/sign-up", signUp);

// email, password
authRouter.post("/sign-in", signIn);

// ADICIONAR LOGOUT !!! !!! !!!

export default authRouter;
