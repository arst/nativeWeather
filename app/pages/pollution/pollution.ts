import { EventData } from "data/observable";
import { Page } from "ui/page";
import { AirPollutionModelViewModel } from "./pollution-view-model";
import navigation = require('../../common/navigation');
 
export function navigatingTo(args: EventData) {
  var page = <Page>args.object;
  page.bindingContext = new AirPollutionModelViewModel();
}
 
export function goToMainPage() {
  navigation.goToMainPage();
}

export function onRefresh(args: EventData) {
  var page = <Page>args.object;
  page.bindingContext.refresh();
}