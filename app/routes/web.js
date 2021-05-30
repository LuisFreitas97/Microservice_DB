import express from 'express';
import { InsertJson } from '../controllers/InsertJson.js';
import { Collection } from '../controllers/Collection.js';
import { DrawAreas } from '../Services/Areas/DrawAreas.js';
import { WeatherAPI } from '../Services/Weather/WeatherAPI.js';
import asyncHandler  from 'express-async-handler';

export const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

// Rota para inserir um json na base de dados
router.post("/insertJsonData", asyncHandler(async (req, res, next) => {
  var result = await InsertJson.insertJsonInBd(req);
  res.status(result.code).json(result.msg);
}));

router.get("/collection", asyncHandler(async (req, res, next) => {
  var result = await Collection.getCollection(req);
  res.status(result.code).json(result);
}));

router.get("/drawAreas", asyncHandler(async (req, res, next) => {
  var result = await DrawAreas.getDrawAreas(req);
  res.status(result.code).json(result);
}));

router.get("/centers", asyncHandler(async (req, res, next) => {
  var result = await WeatherAPI.saveWeatherDataToArea();
  res.status(result.code).json(result);
}));

router.get("/areaWeatherInfo", asyncHandler(async (req, res, next) => {
  var result = await WeatherAPI.getAreaWeatherData(req);
  res.status(result.code).json(result);
}));