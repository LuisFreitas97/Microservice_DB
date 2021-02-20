import express from 'express';
import { InsertJson } from '../controllers/InsertJson.js';
import { Collection } from '../controllers/Collection.js';
import asyncHandler  from 'express-async-handler';

export const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

// Rota para inserir um json na base de dados
router.post("/insertJsonData", asyncHandler(async (req, res, next) => {
  var result = await InsertJson.insertJsonInBd(req);
  res.json(result);
}));

router.get("/collection", asyncHandler(async (req, res, next) => {
  var result = await Collection.getCollection(req);
  res.json(result);
}));