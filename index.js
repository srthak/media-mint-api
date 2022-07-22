const express = require("express");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;
const cors = require("cors");
const User = require("./models/user");

const app = express();
const port = process.env.PORT;

mongoose.connect(url, { useNewUrlParser: true });

const con = mongoose.connection;

con.on("open", function () {
  console.log("connected...");
});
app.use(express.json());

app.use(cors());
let page = 0;

app.post("/storeUserInMyDatabase", async (req, res) => {
  try {
    fetch(`https://gorest.co.in/public-api/users?page=${page}&limit=10`)
      .then((response) => response.json())
      .then((data) => {
        page++;
        User.insertMany(data.data, (err, response) => {
          res.send({ page: page });
        });
      });
  } catch (e) {
    res.send("Error");
  }
});

app.get("/getUserFromMyDatabase", async (req, res) => {
  try {
    const users = await User.find()
      .limit(10)
      .skip(parseInt((req.query.page - 1) * 10));
    res.send({ users: users, page: page });
  } catch (e) {}
});

app.get("/getAllUsersFromMyDatabase", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.send({ users: users });
  } catch (e) {}
});

app.patch("/updateUser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log(user);
    res.send(user);
  } catch (e) {}
});

app.listen(port, () => {
  console.log("Server started");
});
