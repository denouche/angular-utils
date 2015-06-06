angular.module('utils-alerter')
.service('Alerter', function (toastr) {
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

});
