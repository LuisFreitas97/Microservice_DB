import { DbConfig } from '../config/db.config.js';
import { CheckJson } from '../utils/CheckJson.js';
import { DatabaseUtils } from '../utils/DatabaseUtils.js';

export class InsertJson {
    static async insertJsonInBd(req) {
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
        if(!collectionName){
            return { "msg": "invalid collection name", "code": 500 };
        }
        
        // var exists = await DatabaseUtils.existsCollectionName(db,collectionName);
        // if(exists){
        //     return { "msg": "collection name already exists", "code": 500 };
        // }

        const collection = db.collection(collectionName);

        // const result = await collection.insertOne(json);
        var error = false;
        await collection.insertMany(json, (err, res) => {
            if (err) error = true;

            else error = false;

            // console.log(err);
            
            // console.log("Number of documents inserted: " + res.insertedCount);
            });

        if(error)
            return { "msg": "error inserting data", "code": 500 };
        else
            return { "msg": "data inserted with success", "code": 201 };
    }
};

