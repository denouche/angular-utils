angular.module('utils-scroll')
.service('ScrollService', function ($timeout) {
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

});
