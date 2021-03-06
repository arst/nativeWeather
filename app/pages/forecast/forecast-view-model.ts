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
    this.refreshForecastData();
  }

  refresh() {
    this.refreshForecastData(true);
  }

  private refreshForecastData(forceLocationRefresh: boolean = false) {
    locationStore.getLocation(forceLocationRefresh).then((loc) => {
      var url = `${constants.WEATHER_URL}${constants.WEATHER_FORECAST_PATH}?cnt=6&lat=${loc.latitude}&lon=${loc.longitude}&apikey=${constants.WEATHER_APIKEY}`;
      var time_of_day = utilities.getTimeOfDay();
      this.set('is_loading', true);
      this.set('background_class', time_of_day);
      this.setIcons();

      requestor.Get(url).then((response: requestor.ResponseSource) => {
        if(response.success) {
          this.set('is_loading', false);
          var forecast = this.getForecast(response.response);
          this.set('forecast', forecast);
        } else {
          alert(response.errorMessage);
        }
      });
    },
      (e) => {
        alert(e.message);
      });
  }

  private getForecast(response) {
    var forecast = [];
    var list = response.list.splice(1);
    list.forEach((item) => {
      forecast.push({
        day: moment.unix(item.dt).format('MMM DD (ddd)'),
        icon: String.fromCharCode(icons.WEATHER_ICONS['day'][item.weather[0].main.toLowerCase()]),
        temperature: {
          day: `${utilities.describeTemperature(item.main.temp)}`,
          night: `${utilities.describeTemperature(item.main.temp)}`
        },
        wind: `${item.wind.speed}m/s`,
        clouds: `${item.clouds.all}%`,
        pressure: `${item.main.pressure} hpa`,
        description: item.weather[0].description
      })
    });

    return forecast;
  }

  private setIcons() {
    var icons = utilities.getIcons(['temperature', 'wind', 'cloud', 'pressure']);
    icons.forEach((item) => {
      this.set(`${item.name}_icon`, item.icon);
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  );
  }

}