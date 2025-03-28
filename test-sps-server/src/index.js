const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const app = express();
require('dotenv').config();


//pp.use(cors());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 4000; // Definir la variable PORT
app.use(routes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  });
