(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node / CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals.
		factory(jQuery);
	}
})
(function ($) {
	'use strict';
	var console = window.console || { log: function () {} };
	function General() {
		this.init();
	}
	General.prototype = {
		constructor: General,
		init: function () {
			this.addListener();
        },
        addListener: function () {
		},
		alert: function (msg) {
			console.log(msg);
		}
	};
	$(function () {
		return new General();
	});
});
