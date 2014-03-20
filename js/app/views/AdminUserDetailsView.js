// UserDetailsView.js
// -------
define(["jquery", "backbone", "models/UserModel", "collections/usersCollection", "text!templates/userDetailsView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, UserModel, usersCollection, usersDetailsViewHTML, sidemenusList, SidemenuView){
		
			var UserDetailsViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				createUser: function () {
					if (this._usersCollection.online==0) {
						alert('in offline mode you can not add data');
					}
					else {
						this.create(new UserModel({"sponsor": "042cb1572ffbea5d", "userurl": "http://xyz.de.com.uk", "title": "This is a user title", "description": "This is a description", "price": "35", "thumbnailurl": "http://www.cbr250r.com.au/images/user-thumbnail.jpg"}));
					}
					return(false);
				},
				create: function(model) {
					_thisViewUserDetails = this;
					$.ajax('http://dominik-lohmann.de:5000/users', {
					  type: "POST",
					  contentType: "application/json",
					  data: JSON.stringify(model.attributes),
					  success: function(todo) {
						_thisViewUserDetails.fetch();
					  }, 
					  error: function(xhr,b) {
						console.log(xhr);
						alert(xhr);
					  }
					});
					return(false);
				},
				bindEvents: function() {
					var _thisViewUserDetails = this;
					// this.$el.off('click','.createUser').on('click','.createUser',function(){_thisViewUserDetails.createUser();});
					// alert('b');
					/*
					this.$el.off('click','.activeslider').on('click','.activeslider',function(){
						// _thisViewUserDetails.createUser();
						alert('a');
					});
					*/
					$('#activeslider').on('change', function() {
						// alert($('#activeslider').val());
						// console.log(_thisViewUserDetails.options);
						var val = false;
						if ( $('#activeslider').val()=='on' ) val = true;
						dpd.users.put(_thisViewUserDetails.options.id, {"active": val} );
					});					
					/*
					$("input[type='checkbox']").bind( "change", function(event, ui) {
						event.preventDefault();
						console.log(event);
						console.log(event.delegateTarget);
						console.log(event.delegateTarget.id);
						console.log( $("label[for='"+ event.delegateTarget.id +"']").text() );
						console.log(event.delegateTarget.checked);
						var o = new Object();
						o.id = event.delegateTarget.id;
						if (event.delegateTarget.checked==false) o.status = "";
						else o.status = "checked";
						o.label = $("label[for='"+ event.delegateTarget.id +"']").text();					
						dpd.users.me(function(me) {
							// console.log(me);
							var exists = jQuery.inArray( $.trim(o.label), me.interests )
							// console.log(exists);
							if (event.delegateTarget.checked==false && exists>-1) dpd.users.put(_thisViewMyProfileNested.me.id, {"interests": {$pull:$.trim(o.label)}} );
							else if (event.delegateTarget.checked==true && exists==-1) dpd.users.put(_thisViewMyProfileNested.me.id, {"interests": {$push:$.trim(o.label)}} );
						});
					});
					*/
					
				},
				initializeCollection:function(options) {
					this._usersCollection = new usersCollection([], options);
					console.log(this._usersCollection);
				},
				fetch: function(options) {
					this.$el.hide();
					this.initializeCollection(options);
					var _thisViewUserDetails = this;
					this._usersCollection.fetch({
						error: function(action, coll) {
							console.log(action);
							console.log(coll);
						},
						success: function(coll, jsoncoll) {
							console.log(coll);
							console.log(jsoncoll);
							_thisViewUserDetails.render();
						}
					});
				},
				initialize: function(options) {
					// alert('bla');
					_thisViewUserDetails = this;
					options.sponsor = me.id;
					console.log(options);
					$.ajax({
						url: "http://dominik-lohmann.de:5000/interests",
						async: false
					}).done(function(responsedata) {
						_thisViewUserDetails.interests = responsedata;
						_thisViewUserDetails.initializeCollection(options);
						_thisViewUserDetails.fetch(options);
					});
				},
				insertVariables: function(model) {
					_thisViewUserDetails = this;
					var sponsor = model.get('sponsor');
					console.log(this.id);
					$.ajax({
						url: "http://dominik-lohmann.de:5000/users/?id="+sponsor,
						async: false
					}).done(function(sponsordata) {
						console.log('sponsordata');
						console.log(sponsordata);
						_thisViewUserDetails.sponsordata = sponsordata;
					});
					// _thisViewUserDetails.interests = new Object();
					// _thisViewUserDetails.interests = {'bla'};
					var pricetext = '';
					if (model.get('price')==0) pricetext = 'kostenlos';
					else pricetext = 'für '+model.get('price')+' Coins';
					console.log(model.get('interests'));
					_template = _.template(usersDetailsViewHTML, {
						id: model.get('id'),
						interests: model.get('interests'),
						sponsor: _thisViewUserDetails.sponsordata.fullname,
						interests: _thisViewUserDetails.interests, 
						fullname: model.get('fullname'),
						active: model.get('active'),
						pictureurl: model.get('pictureurl'),
						username: model.get('username'),
						registered: model.get('registered'),
						subtitle: model.get('subtitle'),
						slogan: model.get('slogan'),
						perstext: model.get('perstext'),
						description: model.get('description'),
						price: model.get('price'),
						pricetext: pricetext,
						start: model.get('start'),
						end: model.get('end')
					},{variable: 'user'});
					$(this.el).html(_template);
				},
				render: function() {
					// alert('bla');
					_thisViewUserDetails = this;
					console.log('rendering UserDetailsView.js');
					/*
					$(window).resize(function() {
						window.resizeElement('#user_player_1')
					});
					*/
					console.log('DOING render UserDetailsView.js called');
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewUserDetails.nestedView = new SidemenuView().fetch();
					var htmlContent = '';
					$(this.el).html(htmlContent);
					// console.log('USER DATA');
					// console.log(this._usersCollection.models);
					// console.log('this._usersCollection.models[0].attributes.fullname');
					// console.log(this._usersCollection.models[0].attributes.fullname);
					_.each(this._usersCollection.models, function(model) {
						this.id = model.get('id');
						_thisViewUserDetails.insertVariables(model);
					});
					_thisViewUserDetails.$el.trigger('create');
					new FastClick(document.body);
					_thisViewUserDetails.$el.fadeIn( 500, function() {
						$('.ui-content').scrollTop(0);
						new FastClick(document.body);
					});
					_thisViewUserDetails.bindEvents();
					return _thisViewUserDetails;
				}

			});

        return UserDetailsViewVar;

    }

);