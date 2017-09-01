import frame = require('ui/frame');

//constant instead of this method?
export function getStartPage() {
    return 'pages/main/main';
}

export function goToForecastPage() {
    frame.topmost().navigate('pages/forecast/forecast');
}

export function goToMainPage() {
    //this shall be refasctored to look like forecast so code lloks mnore consistent
    frame.topmost().naviagete('pages/main/main');
}