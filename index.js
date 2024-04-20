const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const router  = require("./routes/index");
require("dotenv").config();

// applying middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/", router);


app.listen(process.env.RUNNING_PORT, () => {
    console.log("App Is Listen On 3000")
})