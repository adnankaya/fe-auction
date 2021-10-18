export class ApiUrl {

    url: string;

    constructor() {
        const baseUrl = location.origin;
        if (baseUrl.indexOf('localhost') > 0) {
            this.url = 'http://127.0.0.1:8001/api/v1/';
        } else {
            this.url = 'http://adnankayace.blogspot.com/api/v1/';
        }
    }
}
