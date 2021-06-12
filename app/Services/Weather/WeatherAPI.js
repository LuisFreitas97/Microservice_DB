import { DrawAreas } from '../Areas/DrawAreas.js';
import polygonCenter from 'geojson-polygon-center';
import { DbConfig } from '../../config/db.config.js';
import { DatabaseUtils } from '../../utils/DatabaseUtils.js';

export class WeatherAPI {
    static collectionName = "weatherAPI";

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

        // var bgri11 = "17062800111";
        // var date = "2021-05-27T06:00:00+0000";
        var collectionName = WeatherAPI.collectionName;

        var exists = await DatabaseUtils.existsCollectionName(db, collectionName);
        if (!exists) {
            return { "msg": "collection not found", "code": 404 };
        }
        const collection = await db.collection(collectionName);
        var data = await collection.findOne({ BGRI11: bgri11, datetime: date });
        if (!data) { return {}; }
        var index = data.datetime.indexOf(date);
        var weatherData = { atts: data.atts, data: data.data[index] };

        return weatherData;

        // return { "msg": "success", "data": weatherData, "code": 201 };
    }

    static async getWeatherData(date) {
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
        var data = await collection.find({ datetime: date }).toArray();
        if (!data) { return []; }

        var result = [];

        for (let weather of data) {
            var index = weather.datetime.indexOf(date);
            result.push({ BGRI11: weather.BGRI11, atts: weather.atts, data: weather.data[index] });
        }

        return result;

        // return { "msg": "success", "data": weatherData, "code": 201 };
    }
};

