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
	function Schools() {
		this.$addSchoolModel = $('#add-school-model');
		this.$addSchoolForm = $('#add-school-form');
		this.$states = this.$addSchoolForm.find('#school-states');
		this.$lga = this.$addSchoolForm.find('#school-lga');
		this.$removeSchool = $('.remove-school');
		this.init();
	}
	Schools.prototype = {
		constructor: Schools,
		init: function () {
			this.addListener();
			this.getStates();
        },
        addListener: function () {
			this.$addSchoolForm.on('submit', $.proxy(this.addSchool, this));
			this.$addSchoolModel.on('hidden.bs.modal', $.proxy(this.resetModel, this));
			this.$addSchoolModel.on('show.bs.modal', $.proxy(this.getStates, this));
			this.$states.on('change', $.proxy(this.setLGA, this));
			this.$removeSchool.on('click', $.proxy(this.removeSchool, this));
		},
		removeSchool : function (e) {
			e.preventDefault();
			let id = $(e.target).data().id;
			swal({
				title: "Are you sure?",
				text: "Your will not be able to recover this school again",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel",
				closeOnConfirm: false,
				closeOnCancel: false 
			}, function (isConfirm) {
				if (isConfirm) {
					$.post('/schools/remove', {id: id});
					swal("Deleted!", "School has been deleted sucessfully.", "success");
				} else {
					swal("Cancelled", "School is safe :)", "error");
				}
			});
		},
		addSchool: function (e) {
			e.preventDefault();
			let _this = this;
			let data = {
				title : $.trim($(e.target).find('#school-title').val()),
				state : $.trim($(e.target).find('#school-states').val()),
				lga : $.trim($(e.target).find('#school-lga').val()),
				address : $.trim($(e.target).find('#school-address').val()),
				hmfullname : $.trim($(e.target).find('#hm-fullname').val()),
				hmmobile : $.trim($(e.target).find('#hm-mobile').val()),
				vcfullname : $.trim($(e.target).find('#vc-fullname').val()),
				vcmobile : $.trim($(e.target).find('#vc-mobile').val())
			};
			if (data.title.length == 0 || data.state.length == 0 || data.lga.length == 0 || data.address.length == 0 || data.hmfullname.length == 0 || data.hmmobile.length == 0 || data.vcfullname.length == 0 || data.vcmobile.length == 0) {
				this.reportMsg(e, 'All fields is required');
			} else {
				$(e.target).find('input, button, select').attr('disabled', 'disabled');
				$(e.target).find('.sk-spinner').css('display', 'inline-block');
				$.post($(e.target).attr('action'), data, function(res) {
					if (res.info.code === 201) {
						_this.$addSchoolModel.modal('hide');
						swal({title: 'Success!', text: 'You have successfully added new school.', type: "success"});
						$(e.target).find('input, select').val(''); data = {};
						$(e.target).find('input, button, select').removeAttr('disabled');
						$(e.target).find('.sk-spinner').css('display', 'none');
					} else if (res.info.code === 500) {
						_this.$addSchoolModel.modal('hide');
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
		reportMsg: function (e, msg) {
			$(e.target).find('.error-reporting').fadeIn(2000);
			$(e.target).find('.error-reporting').find('a.alert-link').text(msg);
			setTimeout(function() {
				$(e.target).find('.error-reporting').fadeOut(2000);
			}, 7000);
		}
	};
	$(function () {
		return new Schools();
	});
});
