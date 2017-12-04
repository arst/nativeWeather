import observable = require("data/observable");
import requestor = require("../../common/requestor");
import constants = require("../../common/api_constants");
import geolocation = require("nativescript-geolocation");
import icons = require("../../common/icons");
import moment = require('moment');
import utilities = require('../../common/utilities');
import locationStore = require('../../stores/location');

interface AirPollutionInformationViewModel {
    precision: number;
    pressure: number;
    value: number;
}

interface AirPollutionModelViewModelData {
  time: string;
  data: Array<AirPollutionInformationViewModel>;
}

export class AirPollutionModelViewModel extends observable.Observable {
  public pollutionLevel: number;

  constructor() {
    super();
    this.refreshAirPollutionData();
  }

  refresh() {
    this.refreshAirPollutionData(true);
  }

  private refreshAirPollutionData(forceLocationRefresh: boolean = false) {
    let location = locationStore.getLocation(forceLocationRefresh).then(
      (loc) => {
        var url = `${constants.POLLUTION_URL}${constants.AIRPOLLUTION_PATH}/v1/co/${loc.latitude},${loc.longitude}/current.json?&appid=${constants.WEATHER_APIKEY}`;
        this.set('is_loading', true);
        requestor.Get(url).then((response : requestor.ResponseSource) => {
          if(response.success) {
            this.set('is_loading', false);
            this.pollutionLevel = Number.parseFloat(response.response.value);
          } else {
            alert(response.errorMessage);
          }
        });
      },
      (e) => {
        alert(e.message);
      }
    );
  }
}