import observable = require("data/observable");
import requestor = require("../../common/requestor");
import constants = require("../../common/api_constants");
import geolocation = require("nativescript-geolocation");
import icons = require("../../common/icons");
import moment = require('moment');
import utilities = require('../../common/utilities');
import locationStore = require('../../stores/location');

interface UvModelViewData {
  uvLevelText: string;
  uvLevelFromColor: string,
  uvLevelToColor: string,
  uvLevelIcon: string
}

export class UVindexViewModel extends observable.Observable {

  constructor() {
    super();
    this.refreshUVdata();
  }

  refresh() {
    this.refreshUVdata(true);
  }

  private refreshUVdata(forceLocationRefresh: boolean = false) {
    let location = locationStore.getLocation(forceLocationRefresh).then(
      (loc) => {
        var url = `${constants.WEATHER_URL}${constants.UVINDEX_PATH}?lat=${loc.latitude}&lon=${loc.longitude}&apikey=${constants.WEATHER_APIKEY}`;
        var time_of_day = utilities.getTimeOfDay();
        this.set('is_loading', true);
        this.set('background_class', time_of_day);
        requestor.Get(url).then((response : requestor.ResponseSource) => {
          if(response.success) {
            this.set('is_loading', false);
            let uvindex = Number.parseFloat(response.response.value);
            let data : UvModelViewData = this.getViewData(uvindex);
            let icon = icons.WEATHER_ICONS['sun'][data.uvLevelIcon];
            this.set('uvIndex', uvindex);
            this.set('uvLevelIcon', String.fromCharCode(icon));
            this.set('uvLevelText', data.uvLevelText);
            this.set('uvLevelColor', data.uvLevelFromColor + ',' + data.uvLevelToColor);
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

  private getViewData(uvindex: number) : UvModelViewData {
    let uvleveltext : string = null;
    let uvcolorfrom : string = null;
    let uvcolorto: string = null;
    let uvlevelIcon: string = null;
    
    if(uvindex <= 2){
        uvleveltext = 'low';
        uvcolorfrom ="#008000";
        uvcolorto = "#FFFF00";
        uvlevelIcon = 'low';
    }
    else if(uvindex > 2 && uvindex <= 5 ){
      uvleveltext = 'moderate';
      uvcolorfrom ="#FFD801";
      uvcolorto = "#FFFF00";
      uvlevelIcon = 'moderate';
    }
    else if(uvindex > 5 && uvindex <= 7){
      uvleveltext = 'high';
      uvcolorfrom ="#FF6301";
      uvcolorto = "#FFFF00";
      uvlevelIcon = 'high';
    }
    else if(uvindex > 7 && uvindex <= 10){
      uvleveltext = 'very high';
      uvcolorfrom ="#FF0101";
      uvcolorto = "#FFFF00";
      uvlevelIcon = 'full';
    }
    else{
      uvleveltext = 'extreme';
      uvcolorfrom ="#8a01ff";
      uvcolorto = "#FFFF00";
      uvlevelIcon = 'full';
    }

    return {
      uvLevelText: uvleveltext,
      uvLevelFromColor: uvcolorfrom,
      uvLevelToColor: uvcolorto,
      uvLevelIcon: uvlevelIcon
    };
  }
}