import frame = require('ui/frame');

export const START_PAGE = 'pages/main/main';

export function goToForecastPage() {
    frame.topmost().navigate('pages/forecast/forecast');
}

export function goToUVPage() {
    frame.topmost().navigate("pages/uvindex/uvindex");
}

export function goToAirPollutionPage() {
    frame.topmost().navigate('pages/pollution/pollution');
}

export function goToMainPage() {
    frame.topmost().navigate('pages/main/main');
}