import { DbConfig } from '../../config/db.config.js';
import { DatabaseUtils } from '../../utils/DatabaseUtils.js';
import { WeatherAPI } from '../Weather/WeatherAPI.js';
import { DateTime } from '../../utils/DateTime.js';
import polygonCenter from 'geojson-polygon-center';

export class DrawAreas {
    static async getDrawAreas(req) {
        var data = await DrawAreas.getDrawAreasFromDb();
        if (!req.query.keepOrder) {
            data = DrawAreas.changeCoordOrder(data);
        } else {
            data = data;
        }
        var date = DateTime.getCurrentDate();
        var weatherData = await WeatherAPI.getWeatherData(date, WeatherAPI.weatherVars.temperature);
        var weatherObj;

        if (weatherData && weatherData.length) {
            data.forEach(function (drawArea, i) {
                weatherObj = weatherData.find(element =>
                    element.BGRI11 === drawArea.properties.BGRI11
                );
                drawArea.weatherData = weatherObj;
            });
        }

        return { "msg": "success", "data": data, "code": 201 };
    }
    static async getDrawAreasFromDb() {
        var db = DbConfig.getDatabaseInstance();
        if (!db) {
            return { "msg": "cannot connect to database", "code": 500 };
        }
        var collectionName = "drawAreas";

        var exists = await DatabaseUtils.existsCollectionName(db, collectionName);
        if (!exists) {
            return { "msg": "collection not found", "code": 404 };
        }
        const collection = await db.collection(collectionName);
        var data = await collection.find({}).toArray();
        return data;
    }
    static changeCoordOrder(data) {
        data.forEach(function (value) {
            value.geometry.coordinates.forEach(function (value) {
                value.forEach(function (coords, key) {
                    value[key] = [coords[1], coords[0]];
                });
            });
        });
        return data;
    }
    static async calculateDrawAreasCenter() {
        var drawAreas = await DrawAreas.getDrawAreasFromDb();
        var center = {};
        var db = DbConfig.getDatabaseInstance();
        if (!db) {
            return { "msg": "cannot connect to database", "code": 500 };
        }
        var collectionName = "drawAreas";

        var exists = await DatabaseUtils.existsCollectionName(db, collectionName);
        if (!exists) {
            return { "msg": "collection not found", "code": 404 };
        }
        const collection = await db.collection(collectionName);

        for (const value of drawAreas) {
            //calculate centroid point 
            center = polygonCenter(value.geometry);

            collection.update(
                { "properties.BGRI11": value.properties.BGRI11 },
                {
                    $set: {
                        center: center,
                    }
                }
            )
        }
        return { "msg": "Centers calculated with success", "code": 201 };
    }
};

