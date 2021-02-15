import express from 'express';
import { InsertJson } from '/app/controllers/insertJson.js';

export const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
  });

  // Rota para inserir um json na base de dados
  router.post("/insertJsonData", (req, res) => {
    InsertJson.InsertJsonInBd();
    res.json({ message: "Data inserted" });
  });