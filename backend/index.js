import e from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import Jwt, { decode } from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = e();
app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.post("/signup", async (req, resp) => {
  const userData = req.body;

  if (userData.email && userData.password) {
    const db = await connection();
    console.log("Database:", db.databaseName);
    const collection = await db.collection("users");
    const result = await collection.insertOne(userData);
    console.log(result);
    if (result) {
      Jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
        resp.send({ message: "signup done", success: true, token: token });
      });
    }
  } else {
    resp.send({ message: "signup fail", success: false });
  }
});

app.post("/login", async (req, resp) => {
  const userData = req.body;

  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection("users");
    const result = await collection.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (result) {
      Jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
        resp.send({ message: "login done", success: true, token: token });
      });
    } else {
      resp.send({ message: "user not found", success: false });
    }
  } else {
    resp.send({ message: "signup fail", success: false });
  }
});

app.post("/add-task", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.insertOne(req.body);
  if (result) {
    resp.send({ message: "new task added", success: true, result: result });
  } else {
    resp.send({ message: "task not added", success: false });
  }
});

app.get("/tasks", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.find().toArray();
  if (result) {
    resp.send({ message: "task list fetched", success: true, result: result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

function verifyJWTToken(req, resp, next) {
  console.log("verifyJWTToken", req.cookies["token"]);
  const token = req.cookies["token"];
  Jwt.verify(token, "Google", (error, decoded) => {
    if (error) {
      return resp.send({
        msg: "invalid token",
        success: false,
      });
    }
    next();
  });
}

app.get("/task/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const id = req.params.id;
  const result = await collection.findOne({ _id: new ObjectId(id) });
  if (result) {
    resp.send({ message: "task fetched", success: true, result: result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.put("/update-task", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const { _id, ...fields } = req.body;
  const update = { $set: fields };
  console.log(fields);

  const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);

  if (result) {
    resp.send({ message: "task data updated", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.delete("/delete/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const id = req.params.id;
  const collection = await db.collection(collectionName);

  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result) {
    resp.send({ message: "task deleted", success: true, result: result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.delete("/delete-multiple", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const ids = req.body;
  const deleteTaskIds = ids.map((item) => new ObjectId(item));

  const collection = await db.collection(collectionName);
  const result = await collection.deleteMany({ _id: { $in: deleteTaskIds } });
  if (result) {
    resp.send({ message: "task deleted", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.listen(3200);
