const express = require('express');

const app = express();

const port = 3000;


app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Ajustamos el puerto del front 
}));





const taskRouter= require("./routes/TaskRouter");

app.use('/', taskRouter);



const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

  

module.exports ={app, server};
