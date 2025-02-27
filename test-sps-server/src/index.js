const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const app = express();
require('dotenv').config();


app.use(cors());



app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(routes);
app.listen(process.env.PORT, () => {
  console.log("Server is running on http://localhost:{$PORT}");
});
