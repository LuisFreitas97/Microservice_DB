import { DrawAreas } from '../Areas/DrawAreas.js';
import { DbConfig } from '../../config/db.config.js';
import { DatabaseUtils } from '../../utils/DatabaseUtils.js';
import { DateTime } from '../../utils/DateTime.js';
import { Ajax } from '../../request/ajax.js';
import qs from 'qs';
import { InsertJson } from '../../controllers/InsertJson.js';
import {JsonHelper} from '../../Helpers/JsonHelper.js';

import dotenv from 'dotenv';
dotenv.config();

export class WeatherAPI {
    static collectionName = "weatherAPI";
    static weatherVars = { 'temperature': 't2' };

    static async saveWeatherDataToArea(req) {
        var result;
        var apiBody = {};
        var headers = { "auth": { "username": process.env.WEATHER_USER, "password": process.env.WEATHER_PASS }, "content-type": "application/x-www-form-urlencoded" };
        var error = false;

        var drawAreas = await DrawAreas.getDrawAreasFromDb();

        for (const drawArea of drawAreas) {
            // Get weather data from API
            apiBody.coord = drawArea.center.coordinates[0] + "," + drawArea.center.coordinates[1];
            apiBody.vars = req.body.vars;
            console.log(apiBody);
            Ajax.postRequest(process.env.WEATHER_API, qs.stringify(apiBody), headers, function (data) {
                data.BGRI11 = drawArea.properties.BGRI11;
                data = JsonHelper.convertJson(data);
                // InsertJson.insertJsonDataInBd(data, WeatherAPI.collectionName);
            }, function (error) {
                console.log(error);
                error = true;
            });
        }
        if (error) {
            result = { 'msg': "internal error", 'code': 500 };
        } else {
            result = { "msg": "success", "data": "success", "code": 201 };
        }
        return result;
    }

    static async getAreaWeatherData(bgri11, date) {
        var db = DbConfig.getDatabaseInstance();
        if (!db) {
            return { "msg": "cannot connect to database", "code": 500 };
        }

        var collectionName = WeatherAPI.collectionName;

        var exists = await DatabaseUtils.existsCollectionName(db, collectionName);
        if (!exists) {
            return { "msg": "collection not found", "code": 404 };
        }
        const collection = await db.collection(collectionName);
        var data = await collection.findOne({ BGRI11: bgri11, datetime: date });
        if (!data) { return {}; }
        var index = data.datetime.indexOf(date);
        var weatherData = { BGRI11: data.BGRI11, atts: data.atts, data: data.data[index] };

        return weatherData;

        // return { "msg": "success", "data": weatherData, "code": 201 };
    }

    static async getWeatherData(date, weatherVar) {
        var db = DbConfig.getDatabaseInstance();
        if (!db) {
            return { "msg": "cannot connect to database", "code": 500 };
        }

        var collectionName = WeatherAPI.collectionName;

        var exists = await DatabaseUtils.existsCollectionName(db, collectionName);
        if (!exists) {
            return { "msg": "collection not found", "code": 404 };
        }

        const collection = await db.collection(collectionName);
        var data = await collection.find({ datetime: date, vars: weatherVar }).toArray();
        if (!data) { return []; }

        var result = [];

        for (let weather of data) {
            var index = weather.datetime.indexOf(date);
            result.push({ BGRI11: weather.BGRI11, atts: weather.atts, data: weather.data[index] });
        }

        return result;
    }

    static async getWeatherDataByType(req) {
        // check request params
        var weatherVar = req.query.vars;
        if (!weatherVar) {
            return { "msg": "Invalid weather data type", "code": 500 };
        }
        var date = DateTime.getCurrentDate();
        var result = await WeatherAPI.getWeatherData(date, weatherVar);
        return { "msg": "success", "data": result, "code": 201 };
    }
};

