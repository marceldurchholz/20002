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

				// console.log(_thisViewAdminUserDetails.options.id);
				
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/"+_thisViewAdminUserDetails.options.id,
					async: false
				}).done(function(user) {
					if (user.interests==undefined) user.interests= new Array();
					_thisViewAdminUserDetailsNested.user = user;
					// if (_thisViewAdminUserDetailsNested.user.interests == undefined) _thisViewAdminUserDetailsNested.user.interests = new Array();
				});
				
				// console.log(_thisViewAdminUserDetailsNested.user);
				$.ajax({
					url: "http://dominik-lohmann.de:5000/interests/",
					async: false
				}).done(function(interests) {
					_thisViewAdminUserDetailsNested.interests = interests;
				});
				// console.log(_thisViewAdminUserDetailsNested.interests);
				// Sort multidimensional arrays with oobjects by value 
				// http://www.javascriptkit.com/javatutors/arraysort2.shtml
				// cards via NAME
				_thisViewAdminUserDetailsNested.interests.sort(function(a, b){
					var nameA=a.name.toLowerCase()
					var nameB=b.name.toLowerCase();
					if (nameA < nameB) return -1 
					if (nameA > nameB) return 1
					return 0;
				});
				/*
				_.each(_thisViewAdminUserDetailsNested.interests, function(interest, index, list) {
					if (interest.quantity==undefined) interest.quantity=0;
					_.each(_thisViewAdminUserDetailsNested.videos, function(video, index, list) {
						if (video.topic==interest.name) {
							interest.quantity = interest.quantity+1;
						}
					});
					_thisViewAdminUserDetailsNested.interests[index] = interest;
				});
				*/
				
				var requestUrl = "http://dominik-lohmann.de:5000/usergroups/?deleted=false";
				if (window.system.master!=true) requestUrl = requestUrl + "&owner="+_thisViewAdminUserDetailsNested.me.id;
				$.ajax({
					url: requestUrl,
					async: false
				}).done(function(allusergroups) {
					_thisViewAdminUserDetailsNested.allusergroups = allusergroups;
				});
				_thisViewAdminUserDetailsNested.allusergroups.sort(function(a, b){
					var nameA=a.name.toLowerCase()
					var nameB=b.name.toLowerCase();
					if (nameA < nameB) return -1 
					if (nameA > nameB) return 1
					return 0;
				});
				// console.log(_thisViewAdminUserDetailsNested.allusergroups);
				
				_thisViewAdminUserDetailsNested.render();
			},
			deleteUsergroup: function(_thisEl,usergroupid) {
				showModal();
				// alert('deleting now: '+usergroupid);
				dpd.usergroups.put(usergroupid, {"deleted":true}, function(result, err) {
					if(err) return console.log(err);
					// console.log(result, result.id);
					_thisEl.remove();
					hideModal();
				});
			},
			bindEvents: function() {
				_thisViewAdminUserDetailsNested = this;
				$('#delaccuntarea').hide();

				// swipeleft
				// _thisViewAdminUserDetailsNested.$el.off( "click", ".swipetodeletetd").on( "click", ".swipetodeletetd", function( e ) {
				_thisViewAdminUserDetailsNested.$el.off( "swipeleft", ".swipetodeletetd").on( "swipeleft", ".swipetodeletetd", function( e ) {
					e.preventDefault();
					var usergroupid = $(this).attr('data-usergroupid');
					var _thisEl = $(this);
					doConfirm('Möchten Sie diese Gruppe wirklich löschen?', 'Wirklich löschen?', function (clickevent) { 
						if (clickevent=="1") {
							_thisViewAdminUserDetailsNested.deleteUsergroup(_thisEl,usergroupid);
							/*
							$.when( deleteFlowClicked() ).done(
								function( result ) {
									// console.log('end deleteFlowClicked');
								}
							);
							*/
						}
					}, "Ja,Nein");
					// alert('peng');
				});

				_thisViewAdminUserDetailsNested.$el.off('change','.usergroupcb').on('change','.usergroupcb',function(e){
					e.preventDefault();
					var userid = $(this).attr('data-userid');
					var usergroupid = $(this).attr('data-usergroupid');
					var isactive = $(this).is(":checked");
					var o = new Object();
					o.id = e.currentTarget.id;
					if (e.currentTarget.checked==false) o.status = "";
					else o.status = "checked";
					o.label = $("label[for='"+ e.currentTarget.id +"']").text();
					/*
					console.log(o);
					console.log(o.id);
					console.log(o.status);
					console.log(o.label);
					*/
					dpd('users').get(userid, function(user, err) {
						var exists = $.inArray( $.trim(usergroupid), user.usergroups )
						if (o.status=="checked" && exists==-1) dpd.users.put(_thisViewAdminUserDetailsNested.user.id, {"usergroups": {$push:$.trim(usergroupid)}} );
						else dpd.users.put(_thisViewAdminUserDetailsNested.user.id, {"usergroups": {$pull:$.trim(usergroupid)}} );
						// hideModal();
					});
					return(false);
				});
				
				_thisViewAdminUserDetailsNested.$el.off('click','#addusergrouprow').on('click','#addusergrouprow',function(e){
					e.preventDefault();
					// alert('bla');
					var usergroupname = $('#newgroupinput').val();
					if (usergroupname=="") {
						doAlert('Bitte geben die Bezeichnung der neuen Gruppe ein.','Bitte Bezeichnung eingeben');
						return(false);
					}
					dpd.usergroups.post({"deleted":false,"owner":_thisViewAdminUserDetailsNested.me.id,"name":usergroupname}, function(result, err) {
						if(err) return console.log(err);
						// console.log(result, result.id);
						var usergroupid = result.id;
						var checkboxid = "checkbox-v-usergroup-"+usergroupid;
						var checked = ""; // CHECKED
						var newgrouptemplate = '<tr><td class="swipetodeletetd" style="text-align:left;" colspan="2" data-usergroupid="'+usergroupid+'"><input data-usergroupid="'+usergroupid+'" data-userid="'+_thisViewAdminUserDetailsNested.me.id+'" '+checked+' data-inset="false" data-mini="true" type="checkbox" class="usergroupcb" name="'+checkboxid+'" id="'+checkboxid+'"><label class="usergroupcb" for="'+checkboxid+'">'+usergroupname+'</label></td></tr>';
						// $('newgrouptemplate').insertBefore($('#insertrowbeforehere'));
						$('#insertrowbeforehere').before(newgrouptemplate);
						$("input#"+checkboxid).closest("div").trigger("create");
						$('#newgroupinput').val('');
					});
					
					return(false);
					// $('#delaccuntarea').show();
				});
				
				_thisViewAdminUserDetailsNested.$el.off('click','#showdeletearea').on('click','#showdeletearea',function(e){
					e.preventDefault();
					$('#delaccuntarea').show();
				});
				_thisViewAdminUserDetailsNested.$el.off('click','#deleteaccountbtn').on('click','#deleteaccountbtn',function(e){
					e.preventDefault();
					var confirmText = 'Wollen Sie den Benutzer wirklich unwiderruflich löschen?';
					var confirmTitle = 'Sind Sie sicher?';
					var confirmButtonLabels = 'Bitte löschen,Vorgang abbrechen';
					doConfirm(confirmText, confirmTitle, function bla(response) {
						_thisViewAdminUserDetailsNested.deleteAccount(response);
						}
					, confirmButtonLabels);
				});
				
				_thisViewAdminUserDetailsNested.$el.off('change','.activateusercb').on('change','.activateusercb',function(e){
					e.preventDefault();
					// showModal();
					var userid = $(this).attr('data-userid');
					var isactive = $(this).is(":checked");
					dpd.users.put(userid, {"active":isactive}, function(result, err) {
						if(err) {
							// hideModal();
							return console.log(err);
						}
						// hideModal();
					});
					return(false);
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
					, active: _thisViewAdminUserDetailsNested.user.active
					, kdnr: _thisViewAdminUserDetailsNested.user.kdnr
					, pictureurl: _thisViewAdminUserDetailsNested.user.pictureurl
					, fullname: _thisViewAdminUserDetailsNested.user.fullname
					, slogan: _thisViewAdminUserDetailsNested.user.slogan
					, perstext: _thisViewAdminUserDetailsNested.user.perstext
					, username: _thisViewAdminUserDetailsNested.user.username
					, credits: _thisViewAdminUserDetailsNested.user.credits
					, level: _thisViewAdminUserDetailsNested.user.level
					, interests: _thisViewAdminUserDetailsNested.interests
					, usergroups: _thisViewAdminUserDetailsNested.user.usergroups
					, allusergroups: _thisViewAdminUserDetailsNested.allusergroups
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