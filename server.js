import express from 'express';
import bodyParser from 'body-parser';
import cors  from "cors";
import { DbConfig } from './app/config/db.config.js';
import {router} from './app/routes/web.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '50mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// simple route
/*app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});*/

app.use('/',router);

// make db connection
// var db = new DbConfig();
DbConfig.connectToDB();

// set port, listen for requests
const PORT = process.env.SERVICE_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});