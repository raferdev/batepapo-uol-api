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
    await db.collection("messages").insertOne({
      from: name.name,
      to: "Todos",
      text: "entra na sala...",
      time: dayjs().format("HH:mm:ss"),
    });
    console.log("deu bom");
  } catch (e) {
    console.log(e);
    res.status(422);
  }
  res.send("foi enviado o bagulho");
});
app.get("/participants", async (req, res) => {
  try {
    const participants = await db.collection('login').find().toArray()
    res.status(201).send(participants);
  } catch (e) {
    res.status(422).send('deu ruim ao procurar os participantes')
    console.log('deu xabu',e)
  }
});
app.post('/messages',async (req,res) => {
  const massage = req.body;
  const user = req.headers.user;
  const messageScheme =  Joi.object({
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().required()
  });
  const validate = messageScheme.validate(massage,{ abortEarly: false });
  if(!validate) {
    return res.status(422).send(validate.error.details.massage)
  }
  try {
  const validaUser =  await db.collection('login').findOne();
  if(!validaUser) {
    console.log('usuario nao encontrando');
    return res.status(422).send('usuario não encontrado');
  }
  } catch(e) {
    console.log('deu ruim ao procurar o nome');
    res.status(422).send('deu ruim ao procurar o nome');
  }
  try {
    await db.collection('messages').insertOne({from:user,...massage,time:dayjs().format("HH:mm:ss")})
    res.sendStatus(201);
  } catch(e) {
    console.log(e);
    res.sendStatus(422);
  }
});
app.get('/messages',async (req,res)=>{
  const {user} = req.header;
  const limit = parseInt(req.query.limit);
  try {
    const messages = await db.collection('messages').find().toArray();
    res.status(201).send(messages);
  } catch(e) {
    console.log('deu ruim pra pegar as msgs');
    res.sendStatus(422)
  };
});
app.listen(5000);
