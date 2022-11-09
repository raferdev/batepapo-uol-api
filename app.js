// imports
import "dotenv/config";
import express from "express";
import cors from "cors";
import Joi from "joi";
import dayjs from "dayjs";
import chalk from "chalk";
import { MongoClient, ObjectId } from "mongodb";
// levantar servidor e conexão mongoDB
const mongoClient = new MongoClient(process.env.MONGO_URI);
const app = express();
mongoClient.connect();
app.use(cors());
app.use(express.json());
let db = mongoClient.db("batepapo_uol");

app.post("/participants", async (req, res) => {
  const name = req.body;
  const nameSchema = Joi.object({
    name: Joi.string().required(),
  });
  const validationName = nameSchema.validate(name, { abortEarly: false });
  if (validationName.error) {
    return res.status(422).send(validationName.error.details);
  }
  try {
    const newUser = await db.collection("login").findOne(name);
    if (newUser) {
      return res.status(409).send("Deu ruim, já tem esse nome...");
    }
    await db.collection("login").insertOne({ ...name, lastStatus: Date.now() });
    await db.collection("messages").insertOne({
      from: name.name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: dayjs().format("HH:mm:ss"),
    });
  } catch (e) {
    res.status(422).send(e);
  }
  res.sendStatus(201);
});
app.get("/participants", async (req, res) => {
  try {
    const participants = await db.collection("login").find().toArray();
    res.status(201).send(participants);
  } catch (e) {
    res.status(422).send("deu ruim ao procurar os participantes");
    console.log("deu xabu", e);
  }
});
app.post("/messages", async (req, res) => {
  const message = req.body;
  const user = req.headers.user;
  const messageScheme = Joi.object({
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().valid("message", "private_message").required(),
  });
  const validationMessage = messageScheme.validate(message, {
    abortEarly: false,
  });
  if (validationMessage.error) {
    return res.status(422).send(validationMessage.error.details);
  }
  try {
    const validaUser = await db.collection("login").findOne({name:user});
    if (!validaUser) {
      return res.status(422).send("usuario não encontrado");
    }
  } catch (e) {
    return res.status(422).send("deu ruim ao procurar o nome");
  }
  try {
    await db
      .collection("messages")
      .insertOne({ from: user, ...message, time: dayjs().format("HH:mm:ss") });
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(422);
  }
});
app.get("/messages", async (req, res) => {
  const user = req.headers.user;
  const limit = parseInt(req.query.limit);
  try {
    const messages = await db
      .collection("messages")
      .find({$or:[{to: {$in:["Todos",user]}},
      {from: user}]})
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();
    res.send(messages);
  } catch (e) {
    console.log(e)
    res.sendStatus(422);
  }
});
app.post("/status", async (req, res) => {
  const user = req.headers.user;
  try {
    const userLogin = await db.collection("login").findOne({ name: user });
    if (!userLogin) {
      return res.sendStatus(404);
    }
    await db.collection("login").updateOne(
      { name: user },
      {
        $set: { lastStatus: Date.now() },
      }
    );
    res.sendStatus(200);
  } catch (e) {
    res.status(422).send(e);
  }
});
app.delete("/messages/:message_id", async (req, res) => {
  const user = req.headers.user;
  const { message_id } = req.params;
  try {
    const search = await db
      .collection("messages")
      .findOne({ _id: new ObjectId(message_id) });
    if (!search) {
      return res.sendStatus(404);
    }
    if (!(search.from === user)) {
      return res.sendStatus(401);
    }
    await db
      .collection("messages")
      .deleteOne({ _id: new ObjectId(message_id) });
    res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(422);
  }
});
app.put("/messages/message_id", async (req, res) => {
  const { message_id } = req.params;
  const messageUp = req.body;
  const user = req.headers.user;
  const messageScheme = Joi.object({
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().valid("message", "private_message").required(),
  });
  const messageUpvalidate = messageScheme.validate(messageUp,{ abortEarly: false });
  if(messageUpvalidate.error) {
    return res.status(422).send(messageUpvalidate.error.details);
  }
  try {
  const search = await db
  .collection("messages")
  .findOne({ _id: new ObjectId(message_id) });
if (!search) {
  return res.sendStatus(404);
}
if (!(search.from === user)) {
  return res.sendStatus(401);
}
await db
  .collection("messages")
  .updateOne({ _id: new ObjectId(message_id) }, {$set:messageUp});
res.sendStatus(200);
} catch (e) {
return res.sendStatus(422);
}});

async function userActivity() {
  try {
    const userOut = [];
    const messageOut = [];
    const users = await db.collection("login").find().toArray();
    users.forEach((user) => {
      let last = parseInt(Date.now());
      let status = parseInt(user.lastStatus);
      let time = last - status;
      if (time > 10) {
        userOut.push(user.name);
      }
    });
    if (userOut.length > 0) {
      await db.collection("login").deleteMany({ name: { $in: userOut } });
      userOut.forEach((user) => {
        messageOut.push({
          from: user,
          to: "Todos",
          text: "sai da sala...",
          type: "status",
          time: dayjs().format("HH:mm:ss"),
        });
      });
      await db.collection("messages").insertMany([...messageOut]);
    }
  } catch (e) {
    console.log(chalk.red("deu ruim ao deletar usuarios inativos"), e);
  }
}
setInterval(userActivity, 15000);
app.listen(process.env.PORT_HOST, ()=> {
  console.log(`Hello i'm running on port = ${process.env.PORT_HOST}`)
});
