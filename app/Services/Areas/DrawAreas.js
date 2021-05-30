import { DbConfig } from '../../config/db.config.js';
import { DatabaseUtils } from '../../utils/DatabaseUtils.js';
// import { WeatherAPI } from '../Weather/WeatherAPI.js';

export class DrawAreas {
    static async getDrawAreas(req) {
        var data = await DrawAreas.getDrawAreasFromDb();
        if(!req.query.keepOrder){
            data = DrawAreas.changeCoordOrder(data[0].features);
        }else{
            data = data[0].features;
        }
        // Get weather data to area
        // for(drawArea of data){
        //     await WeatherAPI.getAreaWeatherData(drawArea.properties.BGRI11);
        // }

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
};

