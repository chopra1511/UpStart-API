const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const cors = require("cors");

const upstartRoute = require('./routes/upstart')

const PORT = process.env.PORT || 8000

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as necessary
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(upstartRoute.routes);



mongoose
  .connect(process.env.MONGODB_URI)
    .then(() => {
    app.listen(PORT);
    console.log("Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
