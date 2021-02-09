import mongoClient from 'mongodb';
const { MongoClient } = mongoClient;

import dotenv from 'dotenv';
dotenv.config();


export class DbConfig {
    constructor(){
        this.url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_URL + ':' + process.env.DB_PORT + '/ThesisDB?authSource=admin';
    }

    connectToDB(){
        MongoClient.connect(this.url, { useUnifiedTopology: true}, function(err, db) {   //here db is the client obj
            if (err) throw err;
            else {
                console.log("Connected to database");
                db.close();
                /*var dbase = db.db("ThesisDB"); //here
                dbase.createCollection("testCollection", function(err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
                    db.close();   //close method has also been moved to client obj
                });*/
            }
        });
    }

};

