var http = require("http");
export class ResponseSource {
    constructor(public success: boolean, public errorMessage: string, public response: any) {}
}

export function Get(url) {
    return http.getJSON(url).then(function (response : JSON) {
        return new ResponseSource(true, null,response);
    }, function (e: Error) {
        return new ResponseSource(false, e.message, null);
    });
}