// loginView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/loginPage.html"],

    function($, Backbone, sidemenusList, SidemenuView, loginPage){
		
			var loginView = Backbone.View.extend({
			
				el: "#page-content",
				// collection: new Backbone.LocalStorage("loginStorage"),
				attributes: {"data-role": 'content'},
				events: {
				},
				sendLogin: function(targetUrl) {
					_thisViewLogin = this;
					showModal();
					var username = $('#username').val().toLowerCase();
					var password = $('#password').val();
					// alert(username);
					if (checkString(username)!=true || password=='') {
						doAlert('Bitte überprüfen Sie die eingegebenen Daten.','Eingaben unvollständig oder nicht korrekt!');
						hideModal();
						return(false);
					}
					setTimeout(function() {
						// alert(username);
						var _response = new Array();
						// 16181348537294980
						// console.log(username);
						$.ajax({
							url: 'http://dominik-lohmann.de:5000/users/?username='+username,
							async: false,
							success: function(response, textStatus, XMLHttpRequest) {
								// console.log(response);
								_response = response;
							},
							error:function (xhr, ajaxOptions, thrownError) { 
								console.log(thrownError);
							}
						});
						// console.log(_response);
						if (_response[0] != undefined && _response[0].deleted==true) {
							doAlert('Es ist ein Problem bei der Anmeldung mit Ihren Zugangsdaten aufgetreten.','Bitte Zugangsdaten überprüfen');
							hideModal();
							return(false);
						}

						dpd.users.login({username: username, password: password}, function(user, error) {
						// dpd.users.post({username: username, password: password}, function(user, error) {
							if (error) {
								doAlert('Eine Anmeldung mit diesen Zugangsdaten konnte nicht durchgeführt werden. Zur Registrierung klicken Sie auf "Neuen Zugang anlegen".','Fehler bei der Anmeldung!');
								hideModal();
							} else {
								// alert(user.uid);
								if (user==null) { 
									doAlert('Bitte versuchen Sie es erneut.','Fehler bei der Anmeldung!');
									hideModal();
									return(false);
									// alert('user =  null');
								}
								else {
									// alert('a login : '+user.username);
									window.system.uid = user.uid;
									// dpd.users.get(function(me,err) {
									// alert(window.system.uid);
									dpd('users').get(window.system.uid, function(me, err) {
										window.me = me;
										_thisViewLogin.me = me;
										// alert(me.username);
										$('#showMenu').show();
										$('#showPageOptionsIcon').show();
										var logincount = _thisViewLogin.me.logincount;
										if (logincount==undefined) logincount=0;
										var newlogincount = 0;
										var newlogincount = logincount+1;
										dpd.users.put(_thisViewLogin.me.id, {"logincount":newlogincount}, function(result, err) { 
											if(err) { 
												hideModal();
											}
											// alert(username);
											// alert(password);
											window.dao.rememberUserData(username, password, '1');
											// alert('redirecting');
											// system.redirectToUrl(targetUrl);
											window.location.href="#dashboard";
										});
									});
								}
							}
						});
					}, 1000);

				},
				sendRegister: function() {
					_thisViewLogin = this;
					var username = $('#username').val().toLowerCase();
					var password = $('#password').val();
					var giftcode = $('#giftcodeInput').val();
					var uid = '';
					// var sponsor = '';
					if (username!='' && password!='') {
						if (checkString(username)==true) {
							var roles = ["user","seeker"];
							var registered = dateYmdHis();
							/*
							$.ajax({
								url: 'http://dominik-lohmann.de:5000/users/'+window.system.aoid,
								async: false,
								success: function(sponsor, textStatus, XMLHttpRequest){
									// _thisViewLogin.ownerdata = ownerdata[0];
									// _thisViewLogin.ownerid = ownerdata.id;
									_thisViewLogin.sponsor = _thisViewLogin.sponsor;
								},
								error:function (xhr, ajaxOptions, thrownError) { }
							});
							*/
							_thisViewLogin.sponsor = window.system.aoid;
							if (giftcode!='') _thisViewLogin.sponsor = giftcode.replace('-','').toLowerCase();
							dpd.users.post({username: username, password: password, fullname: username, active: true, messageble: true, sponsor: _thisViewLogin.sponsor, roles: roles, registered: registered, credits: "0", purchases:[], followers:[], following:[], logincount:"0"}, function(user, err) {
								// alert(user);
								// alert(user.username);
								if (user==null) {
									if(err) {
										doAlert('Es ist leider ein Fehler bei der Registrierung aufgetreten!','Ups...');
										return { }
									}
								}
								_thisViewLogin.sendLogin(_thisViewLogin.redirecturl);
							});
						}
						else {
							doAlert('Bitte geben Sie einen gültigen Benutzernamen / E-Mail-Adresse ein.','Ungültiger Benutzername!');
						}
					} else {
						doAlert('Bitte geben Sie zur Registrierung einen gültigen Benutzernamen / E-Mail-Adresse und Ihr gewünschtes Passwort ein.','Registrierung unvollständig');
					}
				},
				sync: function() {
				},
				initialize: function() {
					var _thisViewLogin = this;
					_thisViewLogin.autologin = false;
					_thisViewLogin.redirecturl = '#myprofile';
					showModal();
					this.$el.hide();
					_thisViewLogin.fetch();
				},
				fetch: function() {
					_thisViewLogin = this;
					_thisViewLogin.username = "";
					_thisViewLogin.password = "";
					// window.dao.rememberUserDataGet(_thisViewLogin.render);
					// alert('first');
					window.dao.rememberUserDataGet(_thisViewLogin.rememberUserDataCallback);
				},
				rememberUserDataCallback: function(userdata) {
					// alert('second');
					_thisViewLogin.userdata = userdata;
					// alert(_thisViewLogin.userdata.username);
					if (_thisViewLogin.userdata.username!='') {
						// alert(_thisViewLogin.userdata);
						// alert(_thisViewLogin.userdata.username);
						_thisViewLogin.username = _thisViewLogin.userdata.username;
						_thisViewLogin.password = _thisViewLogin.userdata.password;						
						if (_thisViewLogin.autologin=="1") _thisViewLogin.autologin = true;
					}
					// alert('third');
					_thisViewLogin.render();
				},
				toggleGiftcodeInput: function() {
					$('#giftcodeDiv').hide();
					$("#giftcodeDiv").fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
				},
				bindEvents: function() {
					var _thisViewLogin = this;
					$('#body').off( "swiperight", "#page-content");
					$('#showMenu').hide();
					$('#showPageOptionsIcon').hide();
					$('#giftcodeDiv').toggle();
					this.$el.off('click','.sendLoginBtn').on('click','.sendLoginBtn',function(event){event.preventDefault();_thisViewLogin.sendLogin('#dashboard');});
					this.$el.off('click','.sendRegisterBtn').on('click','.sendRegisterBtn',function(event){event.preventDefault();_thisViewLogin.sendRegister();});
					this.$el.off('click','#giftcode').on('click','#giftcode',function(event){event.preventDefault();_thisViewLogin.toggleGiftcodeInput();});
					
					this.$el.off('click','.anonymlogin').on('click','.anonymlogin',function(event){event.preventDefault();_thisViewLogin.sendAnonymlogin();});
					$('#username').val(_thisViewLogin.username);
					$('#password').val(_thisViewLogin.password);
					if (_thisViewLogin.autologin==true) {
						_thisViewLogin.sendLogin('#dashboard');
					}
				},
				sendAnonymlogin: function() {
					_thisViewLogin = this;
					$('#username').val(getRandomID());
					$('#password').val(getRandomID());
					_thisViewLogin.sendRegister();
					// _thisViewLogin.redirecturl = '#dashboard';
					// _thisViewLogin.sendLogin(_thisViewLogin.redirecturl);
				},
				render: function() {
					_thisViewLogin = this;
					_thisViewLogin.$el.html(_.template(loginPage, {}));
					// window.createVideoPreview(_thisViewLogin.$('#video_player_1'),'video_player_1',"promo",0);
					this.$el.trigger('create');
					$( ".dynspace_small" ).each(function(index, value) {
						var nowheight = $(this).height();
						// alert(nowheight);
						var thenheight = $(this).height()*$(window).height()*1/100;
						// alert(thenheight);
						$(this).css('height',thenheight);
					});
					hideModal();
					fontResize();
					this.$el.fadeIn( 500, function() {
						if (window.system.showtutorial == true) {
							// alert('now show the tutorial');
							// $( "#welcomepopup" ).popup().trigger('create').css("height",$(window).height()-50).css("width",$(window).width()-50).popup( "open", {transition: 'fade'} );
							$( "#welcomepopup" ).popup().trigger('create');
							$( "#welcomepopup" ).css("height","auto").css("width","auto");
							$( "#welcomepopup" ).css({ "max-width": $(window).width()-70+'px' });
							// $( "#welcomepopup" ).css({ "max-height": $(window).height()-70+'px' });
							// $( "#welcomepopup" ).css({ "max-height": '300px' });
							$( "#tutorialpopup" ).popup().trigger('create');
							$( "#tutorialpopup" ).css("height","auto").css("width","auto");
							// $( "#tutorialpopup" ).css({ "max-height": $(window).height()-70+'px' });
							// $( "#tutorialpopup" ).css({ "overflow-x": 'hidden' });
							// $( "#tutorialpopup" ).css({ "overflow-y": 'scroll' });
							$( "#welcomepopup" ).popup( "open", {transition: 'fade'} );
							// $( "#tutorialpopup" ).popup( "open", {transition: 'fade'} );
						}
						new FastClick(document.body);
					});
					this.bindEvents();
					return this;
				}

			});

        return loginView;

    }

);