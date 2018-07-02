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
	function Masjids() {
		this.$addMasjidModel = $('#add-masjid-model');
		this.$addMasjidForm = $('#add-masjid-form');
		this.$masjidTypes = this.$addMasjidForm.find('#masjid-types');
		this.$states = this.$addMasjidForm.find('#masjid-states');
		this.$lga = this.$addMasjidForm.find('#masjid-lga');
		this.$removeMasjid = $('.remove-masjid');
		this.init();
	}
	Masjids.prototype = {
		constructor: Masjids,
		init: function () {
			this.addListener();
			this.getStates();
			this.getMasjidType();
        },
        addListener: function () {
			this.$addMasjidForm.on('submit', $.proxy(this.addMasjid, this));
			this.$addMasjidModel.on('hidden.bs.modal', $.proxy(this.resetModel, this));
			this.$addMasjidModel.on('show.bs.modal', $.proxy(this.getStates, this));
			this.$states.on('change', $.proxy(this.setLGA, this));
			this.$removeMasjid.on('click', $.proxy(this.removeMasjid, this));
		},
		removeMasjid: function (e) {
			e.preventDefault();
			let id = $(e.target).data().id;
			swal({
				title: "Are you sure?",
				text: "Your will not be able to recover this masjid again",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel",
				closeOnConfirm: false,
				closeOnCancel: false 
			}, function (isConfirm) {
				if (isConfirm) {
					$.post('/masjids/remove', {id: id});
					swal("Deleted!", "Masjid has been deleted sucessfully.", "success");
				} else {
					swal("Cancelled", "Masjid is safe :)", "error");
				}
			});
		},
		addMasjid: function (e) {
			e.preventDefault();
			let _this = this;
			let data = {
				masjidtype : $.trim($(e.target).find('#masjid-types').val()),
				masjidtitle : $.trim($(e.target).find('#masjid-title').val()),
				state : $.trim($(e.target).find('#masjid-states').val()),
				lga : $.trim($(e.target).find('#masjid-lga').val()),
				address : $.trim($(e.target).find('#masjid-address').val()),
				limanfullname : $.trim($(e.target).find('#liman-fullname').val()),
				limanmobile : $.trim($(e.target).find('#liman-mobile').val()),
				naibifullname : $.trim($(e.target).find('#naibi-fullname').val()),
				naibimobile : $.trim($(e.target).find('#naibi-mobile').val()),
				ladanfullname : $.trim($(e.target).find('#ladan-fullname').val()),
				ladanmobile : $.trim($(e.target).find('#ladan-mobile').val())
			};

			if (data.masjidtype.length == 0 || data.masjidtitle.length == 0 || data.state.length == 0 || data.lga.length == 0 || data.address.length == 0 || data.limanfullname.length == 0 || data.limanmobile.length == 0 || data.naibifullname.length == 0 || data.naibimobile.length == 0 || data.ladanfullname.length == 0 || data.ladanmobile.length == 0) {
				this.reportMsg(e, 'All fields is required');
			} else {
				$(e.target).find('input, button, select').attr('disabled', 'disabled');
				$(e.target).find('.sk-spinner').css('display', 'inline-block');
				$.post($(e.target).attr('action'), data, function(res) {
					if (res.info.code === 201) {
						_this.$addMasjidModel.modal('hide');
						swal({title: 'Success!', text: 'You have successfully added new masjid.', type: "success"});
						$(e.target).find('input, select').val(''); data = {};
						$(e.target).find('input, button, select').removeAttr('disabled');
						$(e.target).find('.sk-spinner').css('display', 'none');
					} else if (res.info.code === 500) {
						_this.$addMasjidModel.modal('hide');
						window.location.assign('/users/signin');
					} else {
						_this.reportMsg(e, res.info.msg);
					}
				}).done(function() { 
					$(e.target).find('input, button, select').removeAttr('disabled');
					$(e.target).find('.sk-spinner').css('display', 'none');
				}).fail(function(jqxhr, settings, ex) { 
					$(e.target).find('input, button, select').removeAttr('disabled');
					$(e.target).find('.sk-spinner').css('display', 'none');
					_this.reportMsg(e, 'Request fail! please try again.');
				});
			}
		},
		resetModel: function (e) {
			$(e.target).find('input, select').val('');
			$(e.target).find('input, button, select').removeAttr('disabled');
			$(e.target).find('.sk-spinner').css('display', 'none');
		},
		getStates: function () {
			let _this = this;
			$.get('/users/states', res => {
                if (res.info.code === 200) {
                    let option = '<option value="">-Select-State-</option>';
                    res.states.forEach(state => {
                        option +='<option value="'+state.state.name+'">'+state.state.name+'</option>';
                    });
                    _this.$states.html(option);
                }
            });
		},
		getLGA: function (state) {
			let _this = this;
			$.post('/users/lga', {state: state}, res => {
                if (res.info.code === 200) {
					let locals = res.lga[0].state.locals;
                    let option = '<option value="">-Select-LGA-</option>';
                    locals.forEach(lga => {
                        option +='<option value="'+lga.name+'">'+lga.name+'</option>';
                    });
                    _this.$lga.html(option);
                }
            });
		},
		setLGA: function () {
			this.getLGA(this.$states.val());
		},
		getMasjidType: function () {
			let _this = this;
			$.get('/masjids/types', res => {
                if (res.info.code === 200) {
                    let option = '<option value="">-Select-Masjid-Types-</option>';
                    res.masjidtypes.forEach(masjidtype => {
                        option +='<option value="'+masjidtype._id+'">'+masjidtype.title+'</option>';
                    });
                    _this.$masjidTypes.html(option);
                }
            });
		},
		reportMsg: function (e, msg) {
			$(e.target).find('.error-reporting').fadeIn(2000);
			$(e.target).find('.error-reporting').find('a.alert-link').text(msg);
			setTimeout(function() {
				$(e.target).find('.error-reporting').fadeOut(2000);
			}, 7000);
		}
	};
	$(function () {
		return new Masjids();
	});
});
