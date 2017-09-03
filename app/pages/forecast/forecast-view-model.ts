import observable = require("data/observable");
import requestor = require("../../common/requestor");
import constants = require("../../common/api_constants");
import geolocation = require("nativescript-geolocation");
import icons = require("../../common/icons");
import moment = require('moment');
import utilities = require('../../common/utilities');
import locationStore = require('../../stores/location');

export class ForecastViewModel extends observable.Observable {

  constructor() {
    super();
    let location = locationStore.getLocation();
    let locationPromise;
    if (location) {
      locationPromise = Promise.resolve(location);
    }
    else {
      locationPromise = geolocation.getCurrentLocation({
        desiredAccuracy: 3,
        updateDistance: 10,
        maximumAge: 20000,
        timeout: 20000
      });
    }
    locationPromise.then(
      (loc) => {
        var url = `${constants.WEATHER_URL}${constants.WEATHER_FORECAST_PATH}?cnt=6&lat=${location.latitude}&lon=${location.longitude}&apikey=${constants.WEATHER_APIKEY}`;
        var time_of_day = utilities.getTimeOfDay();
        this.set('is_loading', true);
        this.set('background_class', time_of_day);
        this.setIcons();

        requestor.get(url).then((response) => {
          this.set('is_loading', false);
          var forecast = this.getForecast(response);
          this.set('forecast', forecast);
        });
      },
      (e) => {
        alert(e.message);
      }
    );
  }

  private getForecast(response) {
    var forecast = [];
    var list = response.list.splice(1);
    list.forEach((item) => {
      forecast.push({
        day: moment.unix(item.dt).format('MMM DD (ddd)'),
        icon: String.fromCharCode(icons.WEATHER_ICONS['day'][item.weather[0].main.toLowerCase()]),
        temperature: {
          day: `${utilities.describeTemperature(item.temp.day)}`,
          night: `${utilities.describeTemperature(item.temp.night)}`
        },
        wind: `${item.speed}m/s`,
        clouds: `${item.clouds}%`,
        pressure: `${item.pressure} hpa`,
        description: item.weather[0].description
      })
    });

    return forecast;
  }

  private setIcons() {
    var icons = utilities.getIcons(['temperature', 'wind', 'cloud', 'pressure']);
    icons.forEach((item) => {
      this.set(`${item.name}_icon`, item.icon);
    });
  }

}