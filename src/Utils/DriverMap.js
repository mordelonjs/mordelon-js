import {
    Driver
} from "../internal";

export function DriverMap() {
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
    get: {
        enumerable: false,
        value: function (key) {
            let instance = Map.prototype.get.call(this, key);
            if (instance) {
                instance = Object.create(instance);
            }
            return instance;
        }
    },
    set: {
        enumerable: false,
        value: function (key, value) {
            if (!(value instanceof Driver)) {
                throw new Error(`"${value.constructor.name}" isn't instance of Driver`)
            }
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