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
	function Router() {
		this.$membersNav = $('.members-btn button');
		this.$container = $('#append-data');
		this.$nav = $('.navbar-default .sidebar-collapse #side-menu .nav-btn');
		this.init();
	}
	Router.prototype = {
		constructor: Router,
		init: function () {
			this.router();
			this.load();
		},
		load: function () {
			let path = this.path(window.location);
			this.$nav.find('a[href="'+path.selector+'"]').parents('li').toggleClass('active');
            this.$container.hide().load(path.url).fadeIn('normal');
		},
		router: function () {
			this.$nav.on('click', $.proxy(this.nav, this));
		},
		path: function(winLoc) {
			let pathname = winLoc.pathname;
			let url = winLoc.origin+pathname, selector;
			if (pathname == '/members/list')
				selector = '/members';
			else if (pathname == '/members/grid')
				selector = '/members';
			else
				selector = pathname;
			return { selector : selector, url : url };
		},
		nav: function (e) {
			e.preventDefault();
			let target = $(e.target);
			let _this = this;
			let origin = window.location.origin;
			let li = target.parents('li.nav-btn');
			let href = li.find('a').attr('href');
			this.$nav.removeClass('active');
			$('#top-search').val('');
			li.toggleClass('active');
			window.document.title = li.data().title;
			window.history.pushState({}, null, origin+href);
			$.get(origin+href, (data) => {
				_this.$container.hide().html(data).fadeIn('normal');
			});
			return false;
		}
	};

	$(function () {
		return new Router();
	});
});
