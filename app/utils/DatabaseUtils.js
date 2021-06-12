export class DatabaseUtils {
    static async existsCollectionName(db, collName) {
        var exists = false;
        var collections = await db.listCollections().toArray();
        collections.forEach(coll => {
            if (coll.name == collName) {
                exists = true;
            }
        });
        return exists;
    }
};

