//refactor this to use http module from nativescript?
export function get(url) {
    return fetch(
        url
    ).then(function (response) {
        return response.json();
    }).then(function (json) {
        return json;
    });
}