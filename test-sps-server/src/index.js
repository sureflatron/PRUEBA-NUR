const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const app = express();
require('dotenv').config();


app.use(cors());



app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 4000; // Definir la variable PORT
app.use(routes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  });
