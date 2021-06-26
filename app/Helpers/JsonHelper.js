export class JsonHelper {
    static convertJson(data) {
        var array = [];
        if (Object.prototype.toString.call(data) === '[object Object]') {
            array.push(data)
        } else if (Object.prototype.toString.call(data) === '[object Array]') {
            array = data;
        } else {
            return null;
        }
        return array;
    }
};

