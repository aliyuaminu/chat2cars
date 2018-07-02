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
	function Exec() {
		this.$makeAPayment = $('#make-a-payment-form');
		this.$transactionId = this.$makeAPayment.find('#transaction-id');
		this.init();
	}
	Exec.prototype = {
		constructor: Exec,
		init: function () {
			this.addListener();
			this.$transactionId.mask("9999-9999-9999", {placeholder: "____-____-____"}); //0000-0000-0000
        },
        addListener: function () {
			this.$makeAPayment.on('submit', $.proxy(this.makeAPayment, this));
		},
		makeAPayment: function (e) {
			e.preventDefault();
			let data = {
				transaction_id : $(e.target).find('#transaction-id').val(),
				teller_serial : $(e.target).find('#teller-serial').val(),
				depositor_name : $(e.target).find('#depositor-name').val(),
				depositor_mobile : $(e.target).find('#depositor-mobile-number').val()
			};

			$(e.target).find('input, button').attr('disabled', 'disabled');
			$(e.target).find('.sk-spinner').css('display', 'inline-block');
			$.post($(e.target).attr('action'), data, function(res) {
				if (res.info.code === 201) {
					let msg   = "You have successfully made a payment";
					let title = "Success!";
					$('#make-a-payment').modal('hide');
					window.location.reload();
					swal({title: title, text: msg, type: "success"});
					$(e.target).find('input').val('');
				} else if (res.info.code === 500) {
					$('#make-a-payment').modal('hide');
					window.location.assign('/bank/signin');
				} else {
					$(e.target).find('.error-reporting').fadeIn(2000);
					$(e.target).find('.error-reporting').find('a.alert-link').text(res.info.msg);
					setTimeout(function() {
						$(e.target).find('.error-reporting').fadeOut(2000);
					}, 7000);
				}
			}).done(function() { 
				$(e.target).find('input, button').removeAttr('disabled');
				$(e.target).find('.sk-spinner').css('display', 'none');
			}).fail(function(jqxhr, settings, ex) { 
				$(e.target).find('input, button').removeAttr('disabled');
				$(e.target).find('.sk-spinner').css('display', 'none');
				$(e.target).find('.error-reporting').fadeIn(2000);
				$(e.target).find('.error-reporting').find('a.alert-link').text("Request fail! please try again.");
				setTimeout(function() {
					$(e.target).find('.error-reporting').fadeOut(2000);
				}, 7000);
			});
		},
		alert: function (msg) {
			console.log(msg);
		}
	};
	$(function () {
		return new Exec();
	});
});
