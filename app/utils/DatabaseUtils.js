export class DatabaseUtils {
    static async existsCollectionName(db, collName) {
        var exists = false;
        var collections = await db.listCollections().toArray();
        collections.forEach(coll => {
            // console.log(coll.name);
            // console.log(collName);
            if (coll.name == collName) {
                exists = true;
            }
        });
        // return db.listCollections().toArray(function (err, collInfos) {
        //     // collInfos is an array of collection info objects that look like:
        //     // { name: 'test', options: {} }
        //     collInfos.forEach(element => {
        //         console.log(element.name);
        //         console.log(collName);
        //         if (element.name == collName) {
        //             exists = true;
        //         }
        //     });
        //     return exists;
        // });
        // console.log(exists);
        return exists;
    }
};

