import axios from 'axios';

export class Ajax {
    static async postRequest(url, data, headers={}, success, err) {
        var result;
        await axios.post(url, data, headers).then(response => {
            result = response;
            success(result.data);
        }).catch(error => {
            err(error);
        });
    }

    static async getRequest(url, config, success, err) {
        var result;
        await axios.get(url, config).then(response => {
            result = response;
            success(result.data);
        }).catch(error => {
            err(error);
        });
    }
};

