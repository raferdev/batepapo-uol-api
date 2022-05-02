// imports
import express from "express";
import cors from "cors";
import Joi from "joi";
import dayjs from "dayjs";
import { MongoClient } from "mongodb";
// levantar servidor e conexão mongoDB
const mongoClient = new MongoClient("mongodb://localhost:27017");
const app = express();
//
mongoClient.connect();
app.use(cors());
app.use(express.json());
//
let db = mongoClient.db("batepapo_uol");
app.post("/participants", async (req, res) => {
  const name = req.body;
  const nameSchema = Joi.object({
    name: Joi.string().required(),
  });
  const getNameValidation = nameSchema.validate(name, { abortEarly: false });
  if (getNameValidation.error) {
    res.status(422).send(getNameValidation.error.details);
    return;
  }
  try {
    const newUser = await db.collection("login").findOne({ name: name.name });
    if (newUser) {
      res.status(409).send("Deu ruim, já tem esse nome...");
      return;
    }
    await db.collection("login").insertOne({ ...name, lastStatus: Date.now() });
    await db.collection("login").insertOne({
      from: name.name,
      to: "Todos",
      text: "entra na sala...",
      time: dayjs().format("HH:mm:ss"),
    });
    console.log("deu bom");
  } catch (e) {
    console.log(e);
  }
  res.send("foi enviado o bagulho");
});
app.get("/participants", async (req, res) => {
  try {
    const participants = await db.collection('login').find().toArray()
    console.log(participants);
  } catch (e) {
    console.log('deu xabu',e)
  }
});
app.listen(5000);
