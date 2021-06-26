import { DrawAreas } from '../Areas/DrawAreas.js';
import polygonCenter from 'geojson-polygon-center';
import { DbConfig } from '../../config/db.config.js';
import { DatabaseUtils } from '../../utils/DatabaseUtils.js';
import { DateTime } from '../../utils/DateTime.js';

export class WeatherAPI {
    static collectionName = "weatherAPI";
    static weatherVars = {'temperature' : 't2'};

    static async saveWeatherDataToArea() {
        var centers = [];
        var center = {};
        var drawAreas = await DrawAreas.getDrawAreasFromDb();
        drawAreas = drawAreas[0].features;

        if (drawAreas && drawAreas.length) {
            drawAreas.forEach(function (value) {
                //calculate centroid point 
                center = polygonCenter(value.geometry);
                center.BGRI11 = value.properties.BGRI11;
                centers.push(center);
            });
        }
        return { "msg": "success", "data": centers, "code": 201 };
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
        if(!weatherVar){
            return { "msg": "Invalid weather data type", "code": 500 };
        }
        var date = DateTime.getCurrentDate();
        var result = await WeatherAPI.getWeatherData(date, weatherVar);
        return { "msg": "success", "data": result, "code": 201 };
    }
};

