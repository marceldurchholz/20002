// MyProfileNestedView.js
// -------
define(["jquery", "backbone", "text!templates/AdminUserDetailsNestedPage.html"],

    function($, Backbone, AdminUserDetailsNestedPage){
		
		var MyProfileNestedView = Backbone.View.extend({
			el: "#AdminUserDetailsNestedViewDiv",
			initialize: function() {
				_thisViewAdminUserDetailsNested = this;
				_thisViewAdminUserDetailsNested.$el.hide();
				showModal();
			},
			fetch: function() {	
				_thisViewAdminUserDetailsNested = this;

				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+window.me.id,
					async: false
				}).done(function(me) {
					// alert(me.id);
					_thisViewAdminUserDetailsNested.me = me;
					if (_thisViewAdminUserDetailsNested.me.interests == undefined) _thisViewAdminUserDetailsNested.me.interests = new Array();
				});

				console.log(_thisViewAdminUserDetails.options.id);
				
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+_thisViewAdminUserDetails.options.id,
					async: false
				}).done(function(user) {
					_thisViewAdminUserDetailsNested.user = user;
					if (_thisViewAdminUserDetailsNested.user.interests == undefined) _thisViewAdminUserDetailsNested.user.interests = new Array();
				});

				console.log(_thisViewAdminUserDetailsNested.user);
				
				_thisViewAdminUserDetailsNested.render();
			},
			bindEvents: function() {
				_thisViewAdminUserDetailsNested = this;
				$('#delaccuntarea').hide();
				
				this.$el.off('click','#showdeletearea').on('click','#showdeletearea',function(e){
					e.preventDefault();
					$('#delaccuntarea').show();
				});
				this.$el.off('click','#deleteaccountbtn').on('click','#deleteaccountbtn',function(e){
					e.preventDefault();
					var confirmText = 'Wollen Sie den Benutzer wirklich unwiderruflich löschen?';
					var confirmTitle = 'Sind Sie sicher?';
					var confirmButtonLabels = 'Bitte löschen,Vorgang abbrechen';
					doConfirm(confirmText, confirmTitle, function bla(response) {
						_thisViewAdminUserDetailsNested.deleteAccount(response);
						}
					, confirmButtonLabels);
				});

			},
			deleteAccount: function(response) {
				_thisViewAdminUserDetailsNested = this;
				console.log(response);
				if (response==1) {
					var deldate = dateYmdHis();
					console.log(deldate);
					var deletetedusername = 'DELETED_'+deldate+'_'+_thisViewAdminUserDetailsNested.user.username;
					console.log(deletetedusername);
					// dpd.users.put(_thisViewAdminUserDetailsNested.user.id, {"username":deletetedusername+"","deleted":true}, function(result, err) { 
					/*
					dpd.users.put(_thisViewAdminUserDetailsNested.user.id, {"deleted":true}, function(result, err) { 
						if(err) return console.log(err); 
						window.location.href = "#admin/users";
					});
					*/
					dpd.users.del(_thisViewAdminUserDetailsNested.user.id, function (err) {
						if(err) return console.log(err); 
						window.location.href = "#admin/users";
					});
				}
				// return('ok');
			},
			render: function() {
				_thisViewAdminUserDetailsNested = this;
				// console.log('rendering MyProfileNestedView.js');
				
				var htmlContent = '';
				$(this.el).html(htmlContent);
				// console.log(_thisViewAdminUserDetailsNested.user);
				if (!_thisViewAdminUserDetailsNested.user.credits) _thisViewAdminUserDetailsNested.user.credits = "0";
				// console.log(_thisViewAdminUserDetailsNested.user.appviews);				
				htmlContent = _.template(AdminUserDetailsNestedPage, {
					id: _thisViewAdminUserDetailsNested.user.id
					, kdnr: _thisViewAdminUserDetailsNested.user.kdnr
					, pictureurl: _thisViewAdminUserDetailsNested.user.pictureurl
					, fullname: _thisViewAdminUserDetailsNested.user.fullname
					, slogan: _thisViewAdminUserDetailsNested.user.slogan
					, perstext: _thisViewAdminUserDetailsNested.user.perstext
					, username: _thisViewAdminUserDetailsNested.user.username
					, credits: _thisViewAdminUserDetailsNested.user.credits
					, level: _thisViewAdminUserDetailsNested.user.level
					, interests: _thisViewAdminUserDetailsNested.interests
					, appviews: _thisViewAdminUserDetailsNested.user.appviews
				},{variable: 'user'});
				// alert(htmlContent);
				$(this.el).html(htmlContent);
				fontResize();
				hideModal();
				this.$el.trigger('create');
				// new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					$('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				this.bindEvents();
				return(this);
			}
		});

        return MyProfileNestedView;

    }

);