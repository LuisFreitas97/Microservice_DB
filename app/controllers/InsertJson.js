import { DbConfig } from '../config/db.config.js';
import { CheckJson } from '../utils/CheckJson.js';
import { DatabaseUtils } from '../utils/DatabaseUtils.js';

export class InsertJsonInBd {
    static insertJsonInBd(req) {
        //check if the data is valid
        if(!CheckJson.isValid(req)){
            return { "msg": "invalid data to insert", "code": 500 };
        }
        var json = req.body.data;
        var db = DbConfig.getDatabaseInstance();
        if (!db) {
            return { "msg": "cannot connect to database", "code": 500 };
        }

        var collectionName = req.body.collectionName;
        if(DatabaseUtils.existsCollectionName(db,collectionName)){
            return { "msg": "collection name already exists", "code": 500 };
        }

        if(!collectionName){
            return { "msg": "invalid collection name", "code": 500 };
        }

        const collection = database.collection(collectionName);

        const result = await collection.insertOne(json);

        return { "msg": "data inserted with success", "code": 201 };
    }
};

