import { DbConfig } from '../../config/db.config.js';
import { DatabaseUtils } from '../../utils/DatabaseUtils.js';

export class DrawAreas {
    static async getDrawAreas() {
        // var db = DbConfig.getDatabaseInstance();
        // if (!db) {
        //     return { "msg": "cannot connect to database", "code": 500 };
        // }
        // var collectionName = "drawAreas";

        // var exists = await DatabaseUtils.existsCollectionName(db, collectionName);
        // if (!exists) {
        //     return { "msg": "collection not found", "code": 404 };
        // }
        // const collection = await db.collection(collectionName);
        // var data = await collection.find({}).toArray();
        var data = await DrawAreas.getDrawAreasFromDb();
        data = DrawAreas.changeCoordOrder(data[0].features);

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

