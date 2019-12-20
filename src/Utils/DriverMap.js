
export default function DriverMap() {
    // create map
    let map = new Map();
    // set new prototype
    Object.setPrototypeOf(map, DriverMap.prototype);
    // return map with prototype driverMap
    return map;
}

DriverMap.__proto__ = Map;
DriverMap.prototype.__proto__ = Map.prototype;

Object.defineProperties(DriverMap.prototype, {
    set: {
        enumerable: false,
        value: function (key, value) {
            if (this.observer[key]) {
                this.observer[key](value);
            }
            return Map.prototype.set.call(this, key, value);
        }
    },
    watch: {
        enumerable: false,
        value: function (key, callback) {
            this.observer[key] = callback;
        }
    },
    unwatch: {
        enumerable: false,
        value: function (key) {
            this.observer[key] = undefined;
            delete this.observer[key];
        }
    },
    observer: {
        enumerable: false,
        writable: true,
        value: [],
    }
});