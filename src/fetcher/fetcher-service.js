angular.module('fetcher')
.factory('Fetcher', function () {
    'use strict';

    var fetcher = function () {
        var f, elapse,
            timeout,
            isFetching = false,
            stopFetching = false,
            self = this;
    
        this.init = function (fToCall, elapseTime) {
            f = fToCall;
            elapse = elapseTime ? elapseTime : 30000;
        };
    
        this.start = function () {
            timeout = window.setTimeout(function () {
                self.fetch();
            }, elapse);
        };
    
        this.stop = function () {
            stopFetching = true;
            timeout = window.clearTimeout(timeout);
        };
    
        this.fetch = function () {
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
    
        this.isFetching = function () {
            return isFetching && !stopFetching;
        };
    };

    return fetcher;

});



