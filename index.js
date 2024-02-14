const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { noteRouter } = require("./routes/note.route");
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users" , userRouter)
app.use("/notes" , noteRouter)

app.get("/",(req,res)=>{
  res.send({msg:"Home Page"})
})

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`server is running at http://localhost:${process.env.port}`);
    console.log("NodeApp database is connected.");
  } catch (err) {
   console.log(err)
  }
});
