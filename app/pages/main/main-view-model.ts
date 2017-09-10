import observable = require("data/observable");
import requestor = require("../../common/requestor");
import constants = require("../../common/api_constants");
import icons = require("../../common/icons");
import geolocation = require("nativescript-geolocation");
import moment = require('moment');
import utilities = require('../../common/utilities');
import locationStore = require('../../stores/location');

export class MainViewModel extends observable.Observable {
    constructor() {
        super();
        if (!geolocation.isEnabled()) {
            geolocation.enableLocationRequest()
                .then(
                this.setGeoData,
                (e) => {
                    alert(e.message);
                });
        } else {
            this.setGeoData();
        }

    }

    refresh() {
        this.setGeoData();
    }

    setGeoData() {
        var time_of_day = utilities.getTimeOfDay();
        this.set('background_class', time_of_day);
        this.setIcons();
        locationStore.getLocation().then((loc) => {
            if (loc) {
                this.set('is_loading', true);
                var url = `${constants.WEATHER_URL}${constants.CURRENT_WEATHER_PATH}?lat=${loc.latitude}&lon=${loc.longitude}&apikey=${constants.WEATHER_APIKEY}`;
                requestor.get(url).then((res: any) => {
                    var weather = res.weather[0].main.toLowerCase();
                    var weather_description = res.weather[0].description;
                    var temperature = res.main.temp;
                    var icon = icons.WEATHER_ICONS[time_of_day][weather];
                    var rain = '0';
                    if (res.rain) {
                        rain = res.rain['3h'];
                    }
                    this.set('icon', String.fromCharCode(icon));
                    this.set('temperature', `${utilities.describeTemperature(Math.floor(temperature))} (${utilities.convertKelvinToCelsius(temperature).toFixed(2)} °C)`);
                    this.set('weather', weather_description);
                    this.set('place', `${res.name}, ${res.sys.country}`);
                    this.set('wind', `${utilities.describeWindSpeed(res.wind.speed)} ${res.wind.speed}m/s ${utilities.degreeToDirection(res.wind.deg)} (${res.wind.deg}°)`);
                    this.set('clouds', `${res.clouds.all}%`);
                    this.set('pressure', `${res.main.pressure} hpa`);
                    this.set('humidity', `${utilities.describeHumidity(res.main.humidity)} (${res.main.humidity}%)`);
                    this.set('rain', `${rain}%`);
                    this.set('sunrise', moment.unix(res.sys.sunrise).format('hh:mm a'));
                    this.set('sunset', moment.unix(res.sys.sunset).format('hh:mm a'));
                    this.set('is_loading', false);
                });
            }
        },
            (e) => {
                this.set('is_loading', false);
                alert(e.message);
            });
    }

    setIcons() {
        var iconsNames = utilities.getIcons([
            'temperature', 'wind', 'cloud',
            'pressure', 'humidity', 'rain',
            'sunrise', 'sunset'
        ]);
        iconsNames.forEach((item) => {
            this.set(`${item.name}_icon`, item.icon);
        });
    }
}
