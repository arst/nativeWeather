import geolocation = require("nativescript-geolocation");
let location: Location;

export class Location {
    constructor(public latitude: number, public longitude: number) { }
};

export function getLocation(): Promise<Location> {
    if (location) {
        return Promise.resolve(location);
    } else {
        let locationPromise: Promise<Location> = new Promise<Location>(function (resolve, reject) {
            geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                updateDistance: 10,
                maximumAge: 20000,
                timeout: 20000
            }).then(function (geoResponse) {
                location = new Location(geoResponse.latitude, geoResponse.longitude);
                resolve(location);
            }, function (e) {
                reject(e);
            })
        });
        return locationPromise;
    }
}
