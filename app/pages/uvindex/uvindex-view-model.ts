import observable = require("data/observable");
import requestor = require("../../common/requestor");
import constants = require("../../common/api_constants");
import geolocation = require("nativescript-geolocation");
import icons = require("../../common/icons");
import moment = require('moment');
import utilities = require('../../common/utilities');
import locationStore = require('../../stores/location');

export class UVindexViewModel extends observable.Observable {

  constructor() {
    super();
    this.refreshUVdata();
  }

  refresh() {
    this.refreshUVdata();
  }

  private refreshUVdata() {
    let location = locationStore.getLocation().then(
      (loc) => {
        var url = `${constants.WEATHER_URL}${constants.UVINDEX_PATH}?lat=${loc.latitude}&lon=${loc.longitude}&apikey=${constants.WEATHER_APIKEY}`;
        var time_of_day = utilities.getTimeOfDay();
        this.set('is_loading', true);
        this.set('background_class', time_of_day);
        requestor.get(url).then((response : any) => {
          this.set('is_loading', false);
          let uvindex = Number.parseFloat(response.value);
          let uvlevel : utilities.UvLevelViewModel = utilities.getUVLevelViewModel(uvindex);
          this.set('uvindex', uvindex);
          this.set('uvlevel', uvlevel.uvleveltext);
          this.set('uvlevelclass', uvlevel.uvlevelclass);
        });
      },
      (e) => {
        alert(e.message);
      }
    );
  }
}