import express from "express";
const app = express();
import mongoose from "mongoose";
import { login, register, getUser } from "./Controller/AuthController";
const bodyParser = require("body-parser");
import cors, { CorsOptions } from "cors";
const jsonParser = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

import "dotenv/config";

app.use(
  cors({
    origin: "https://user-auth-4kb0.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.post("/login", jsonParser, login);

app.post("/register", jsonParser, register);

app.get("/user/:id", getUser);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

mongoose
  .connect(`${process.env.DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions & {
    useNewUrlParser: true;
  })
  .then(async () => {
    console.log("Successfully connected to MongoDB Atlas!");
    const db = mongoose.connection.db;
  })
  .catch((err) => {
    console.log(err.message);
  });

//d
