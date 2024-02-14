const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { noteRouter } = require("./routes/note.route");


const app = express();
app.use(express.json());


app.use("/users" , userRouter)
app.use("/notes" , noteRouter)


app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`server is running at http://localhost:${process.env.port}`);
    console.log("NodeApp database is connected.");
  } catch (err) {
   console.log(err)
  }
});
