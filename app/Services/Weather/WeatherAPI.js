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
    
    static async getAreaWeatherData(req) {
        var db = DbConfig.getDatabaseInstance();
        if (!db) {
            return { "msg": "cannot connect to database", "code": 500 };
        }

        var bgri11 = "17062800111";
        var date = "2021-05-27T20:42:59+0100";
        var collectionName = WeatherAPI.collectionName;

        var exists = await DatabaseUtils.existsCollectionName(db, collectionName);
        if (!exists) {
            return { "msg": "collection not found", "code": 404 };
        }
        const collection = await db.collection(collectionName);
        var data = await collection.find({ BGRI11: bgri11, created: date }).toArray();
        return { "msg": "success", "data": data, "code": 201 };
    }
};

