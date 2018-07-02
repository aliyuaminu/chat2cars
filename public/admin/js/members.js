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
	function Members() {
		this.$addMemberModel = $('#add-member-model');
		this.$addMemberForm = $('#add-member-form');
		this.$states = this.$addMemberForm.find('#states');
		this.$lga = this.$addMemberForm.find('#lga');
		this.$removeMember = $('.remove-member');
		this.init();
	}
	Members.prototype = {
		constructor: Members,
		init: function () {
			this.addListener();
			this.getStates();
        },
        addListener: function () {
			this.$addMemberForm.on('submit', $.proxy(this.addMember, this));
			this.$addMemberModel.on('hidden.bs.modal', $.proxy(this.resetModel, this));
			this.$addMemberModel.on('show.bs.modal', $.proxy(this.getStates, this));
			this.$states.on('change', $.proxy(this.setLGA, this));
			this.$removeMember.on('click', $.proxy(this.removeMember, this));
		},
		removeMember: function (e) {
			e.preventDefault();
			let id = $(e.target).data().id;
			swal({
				title: "Are you sure?",
				text: "Your will not be able to recover this member again",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel",
				closeOnConfirm: false,
				closeOnCancel: false 
			}, function (isConfirm) {
				if (isConfirm) {
					$.post('/members/remove', {id: id});
					swal("Deleted!", "Member has been deleted sucessfully.", "success");
				} else {
					swal("Cancelled", "Member is safe :)", "error");
				}
			});
		},
		addMember: function (e) {
			e.preventDefault();
			let _this = this;
			let data = {
				fullname : $(e.target).find('#fullname').val(),
				state : $(e.target).find('#states').val(),
				lga : $(e.target).find('#lga').val(),
				email : $(e.target).find('#email').val(),
				mobile : $(e.target).find('#mobile').val(),
				address : $(e.target).find('#address').val()
			};
			if (data.fullname != '' && data.state != '' && data.lga != '' && data.mobile != '' && data.address != '') {
				$(e.target).find('input, button, select').attr('disabled', 'disabled');
				$(e.target).find('.sk-spinner').css('display', 'inline-block');
				$.post($(e.target).attr('action'), data, function(res) {
					if (res.info.code === 201) {
						_this.$addMemberModel.modal('hide');
						swal({title: 'Success!', text: 'You have successfully added new member.', type: "success"});
						$(e.target).find('input, select').val(''); data = {};
						$(e.target).find('input, button, select').removeAttr('disabled');
						$(e.target).find('.sk-spinner').css('display', 'none');
					} else if (res.info.code === 500) {
						_this.$addMemberModel.modal('hide');
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
			} else {
				this.reportMsg(e, 'All fields is required');
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
		/*getMasjidType: function () {
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
		},*/
		reportMsg: function (e, msg) {
			$(e.target).find('.error-reporting').fadeIn(2000);
			$(e.target).find('.error-reporting').find('a.alert-link').text(msg);
			setTimeout(function() {
				$(e.target).find('.error-reporting').fadeOut(2000);
			}, 7000);
		}
	};
	$(function () {
		return new Members();
	});
});
