angular.module('utils-fetcher')
.factory('Fetcher', function () {
    'use strict';

    var fetcher = function () {
        var f, elapse,
            timeout,
            isFetching = false,
            stopFetching = false,
            self = {};
    
        self.init = function (fToCall, elapseTime) {
            f = fToCall;
            elapse = elapseTime ? elapseTime : 30000;
        };
    
        self.start = function () {
            timeout = window.setTimeout(function () {
                self.fetch();
            }, elapse);
        };
    
        self.stop = function () {
            stopFetching = true;
            timeout = window.clearTimeout(timeout);
        };
    
        self.fetch = function () {
            timeout = window.clearTimeout(timeout);
            if (!self.isFetching() && angular.isFunction(f)) {
                isFetching = true;
                f().then(function () {
                    if (stopFetching) {
                        stopFetching = false;
                    }
                    else {
                        self.start();
                    }
                    isFetching = false;
                });
            }
        };
    
        self.isFetching = function () {
            return isFetching && !stopFetching;
        };

        return self;
    };

    return fetcher;

});



