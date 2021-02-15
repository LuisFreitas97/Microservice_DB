export class CheckJson {
    static isValid(req) {
        //check if the data is valid
        if(!req.body || !req.body.data){
            return false;
        }
        return true;
    }
};

