angular.module('storage')
.service('StorageService', function () {
    'use strict';

    var serialize = function(value) {
        return angular.toJson(value);
    };

    var deserialize = function(value) {
        if (typeof value !== 'string') { return undefined; }
        try { return angular.fromJson(value); }
        catch(e) { return value || undefined; }
    };

    this.get = function (key) {
        var finalKey = key;
        return deserialize(window.localStorage.getItem(finalKey));
    };

    this.set = function (key, value) {
        var finalKey = key;
        if (value === undefined) { return localStorage.removeItem(finalKey); }
        window.localStorage.setItem(finalKey, serialize(value));
        return value;
    };

    this.clear = function() {
        localStorage.clear();
    };

    this.remove = function(key) {
        localStorage.removeItem(key);
    };

});

