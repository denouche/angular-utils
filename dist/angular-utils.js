angular.module('angular-utils-templates', []);


angular.module('utils-alerter', [
    'toastr',
    'ngAnimate'
]);

angular.module('utils-checkbox-three-states', []);

angular.module('utils-fetcher', []);

angular.module('utils-scroll', []);

angular.module('utils-storage', [
]);

angular.module('utils-alerter')
.service('Alerter', ['toastr', function (toastr) {
    'use strict';

    var that = this;

    this.toastr = toastr;

    function showObject(type, obj) {
        if(obj.error) {
            if(typeof obj.error === 'string') {
                toastr[type](obj.error);
            }
            else {
                toastr[type](obj.error.message);
            }
        }
    }

    this.show = function(type, message, title) {
        switch(typeof message) {
            case 'string':
                toastr[type](message, title);
                break;
            case 'object':
                showObject(type, message);
                break;
        }
    };

    this.error = function(message, title) {
        that.show('error', message, title);
    };

    this.success = function(message, title) {
        that.show('success', message, title);
    };

    this.warning = function(message, title) {
        that.show('warning', message, title);
    };

    this.info = function(message, title) {
        that.show('info', message, title);
    };

}]);

angular.module('utils-fetcher')
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




angular.module('utils-scroll')
.service('ScrollService', ['$timeout', function ($timeout) {
    'use strict';

    var that = this;

    this.downForPixels = function(pixels) {
        $('html, body').animate({
            scrollTop: $(window).scrollTop() + pixels
        }, 500);
    };

    this.downTo = function (elementCssPath) {
        $timeout(function() {
            $timeout(function() {
                if($(elementCssPath) &&
                    $(elementCssPath).offset() &&
                    ($(elementCssPath).offset().top + $(elementCssPath).outerHeight() - $(window).scrollTop()) > window.innerHeight) {
                    var offset = $(elementCssPath).offset().top + $(elementCssPath).outerHeight() - $(window).scrollTop() - window.innerHeight;
                    that.downForPixels(offset);
                }
            });
        });
    };

    this.upTo = function (elementCssPath) {
        $timeout(function() {
            $timeout(function() {
                if($(window).scrollTop() > $(elementCssPath).offset().top) {
                    var offset = $(elementCssPath).offset().top - $(window).scrollTop();
                    that.downForPixels(offset);
                }
            });
        });
    };

}]);

angular.module('utils-storage')
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


angular.module('utils-checkbox-three-states')
.directive('checkbox-three-states', function() {
    'use strict';

    return {
        scope: true,
        require: '?ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var childList = attrs.ctsChildList;
            var property = attrs.ctsProperty;
			
			// Bind the onChange event to update children
			element.bind('change', function() {
				scope.$apply(function () {
					var isChecked = element.prop('checked');
					
					// Set each child's selected property to the checkbox's checked property
					angular.forEach(scope.$eval(childList), function(child) {
						child[property] = isChecked;
					});
				});
			});
			
			// Watch the children for changes
			scope.$watch(childList, function(newValue) {
				var hasChecked = false;
				var hasUnchecked = false;
				
				// Loop through the children
				angular.forEach(newValue, function(child) {
					if (child[property]) {
						hasChecked = true;
					} else {
						hasUnchecked = true;
					}
				});
				
				// Determine which state to put the checkbox in
				if (hasChecked && hasUnchecked) {
					element.prop('checked', false);
					element.prop('indeterminate', true);
                    if (modelCtrl) {
                        modelCtrl.$setViewValue(false);
                    }
				} else {
					element.prop('checked', hasChecked);
					element.prop('indeterminate', false);
                    if (modelCtrl) {
					    modelCtrl.$setViewValue(hasChecked);
                    }
				}
			}, true);
		}
	};
});
angular.module('utils', [
    'utils-alerter',
    'utils-checkbox-three-states',
    'utils-fetcher',
    'utils-scroll',
    'utils-storage'
]);
