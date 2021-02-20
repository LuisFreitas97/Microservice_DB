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
        console.log("existe fora: " + exists);
        if(!exists){
            return { "msg": "collection not found", "code": 404 };
        }
        console.log("antes");
        const collection = await db.collection(collectionName);
        console.log("a meio");

        // var result = {};
        var coll = await collection.find({}).toArray();
        console.log("depois" + coll);
        // coll.toArray(function (err, result) {
        //     if (err) {
        //         result = { "msg": "invalid collection name", "code": 500 };
        //     } else {
        //         result = { "msg": "success", "data": result, "code": 201 };
        //     }
        // });
        return { "msg": "success", "data": coll, "code": 201 };
    }
};

