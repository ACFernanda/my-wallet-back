import db from "./db.js";

export async function postTransaction(req, res) {
  const { value, desciption, type } = req.body;
  const { authorization } = req.header;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const session = await db.collections("sessions").findOne({ token });
  if (!session) {
    return res.sendStatus(401);
  }
}

app.get("/transactions", (req, res) => {
  // buscando transações
});

app.post("transactions", (req, res) => {
  // adicionar transação no formato:
  // { value, description, type, day }
});
