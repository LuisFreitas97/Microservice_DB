import { DbConfig } from '../config/db.config.js';
import { DatabaseUtils } from '../utils/DatabaseUtils.js';

export class Collection {
    static async getCollection(req) {
        var db = DbConfig.getDatabaseInstance();
        if (!db) {
            return { "msg": "cannot connect to database", "code": 500 };
        }
        //check if the query string is valid
        var collectionName = req.query.collectionName;
        if(!collectionName){
            return { "msg": "invalid collection name", "code": 500 };
        }

        var exists = await DatabaseUtils.existsCollectionName(db,collectionName);
        if(!exists){
            return { "msg": "collection not found", "code": 404 };
        }
        const collection = await db.collection(collectionName);
        var coll = await collection.find({}).toArray();
        return { "msg": "success", "data": coll, "code": 201 };
    }
};

