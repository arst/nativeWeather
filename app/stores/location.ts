//Don't like this class at all, may be this need to be refactored to some service or so. This doesn't looks like store
export var location;

export function saveLocation(loc) {
 location = loc;
}

export function getLocation() {
 return location;
}
