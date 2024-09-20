const express = require('express');

const app = express();

const port = 3000;

//

app.use(express.json());

require("dotenv").config();
const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASSWORD +
  "@" +
  process.env.DB_SERVER +
  "/" +
  process.env.DB_NAME +
  "?retryWrites=true&w=majority";
async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Ajustamos el puerto del front 
}));







const taskRouter= require("./routes/TaskRouter");

app.use('/', taskRouter);



const server = app.listen(port, () => {
    console.log(`Hello ${process.env.DB_NAME +" " + process.env.DB_SERVER} Server is running on port ${port}`);
});

  

module.exports ={app, server};
