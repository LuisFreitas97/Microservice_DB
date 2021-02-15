export class DatabaseUtils {
    static existsCollectionName(db,collName) {
        db.listCollections().toArray(function(err, collInfos) {
            // collInfos is an array of collection info objects that look like:
            // { name: 'test', options: {} }
            var exists = false;
            collInfos.forEach(element => {
                if(element.name === collName){
                    exists = true;
                }
            });
            return exists;
        });
    }
};

