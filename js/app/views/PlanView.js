// PlanView.js
// -------
define(["jquery", "backbone", "models/PlanModel", "collections/planerCollection", "text!templates/planView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, PlanModel, planerCollection, planPage, sidemenusList, SidemenuView){
		
		var PlanViewVar = Backbone.View.extend({
			
			el: "#PlanerNestedViewDiv",
			initialize: function() {
				console.log('initializing PlanView.js');
			},
			initializeme: function() {
				console.log('initializing ME in PlanView.js');
				$(this.el).html('loading...');
				$.when( this.fetchMe() ).then(
				  function( status ) {
					_thisViewPlan.me = status;
					_thisViewPlan.render();
				  },
				  function( status ) {
					alert( "you fail this time" );
				  },
				  function( status ) {
					console.log('still fetchWorking');
				  }
				);
			},
			fetchWorking: function() {
				var setTimeoutWatcher = setTimeout(function foo() {
					if ( _thisViewPlan.dfd.state() === "pending" ) {
						_thisViewPlan.dfd.notify( "working... " );
						setTimeout( _thisViewPlan.fetchWorking, 100 );
					}
				}, 1 );
			},
			fetchMe: function() {
				_thisViewPlan = this;
				console.log('fetchMe PlanView.js');
				_thisViewPlan.dfd = new jQuery.Deferred();
				_thisViewPlan.fetchWorking();
				dpd.users.me(function(user) {
					if (user) {
						var fetchMe = setTimeout ( function() {
							_thisViewPlan.dfd.resolve(user);
						}, 0 );
					}
					else {
						console.log('You are not logged in!');
						window.location.href = "#noaccess";
					}
				});
				return this.dfd.promise();
			},
			fetch: function() {	
				// alert('bla');
				_thisViewPlan = this;
				console.log('fetching PlanView.js');
				this.$el.hide();
				this._planerCollection = new planerCollection();
				this._planerCollection.fetch({
					success: function(coll, jsoncoll) {
						console.log(_thisViewPlan);
						// _thisViewPlan.render();
						_thisViewPlan.initializeme();
					},
					error: function(action, coll) {
						console.log('ERROR fetching _planerCollection');
						console.log(action);
						console.log(coll);
						// _thisViewPlan.render();
					}
				});
			},
			bindEvents: function() {
				var _thisViewPlan = this;
				// this.$el.off('click','.clickRow').on('click','.clickRow',function(){_thisViewPlan.clicked(e);});
				this.$el.off('click','.showPlanDetailsLink').on('click','.showPlanDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
				this.$el.off('click','.isPlanToFavourites').on('click','.isPlanToFavourites',function(event){
					event.preventDefault();
					alert('isPlanToFavourites');
				});
				this.$el.off('click','.addPlanToFavourites').on('click','.addPlanToFavourites',function(event){
					event.preventDefault();
					console.log(event);
					$(this).removeClass("addPlanToFavourites");
					$(this).addClass("isPlanToFavourites");
					var planid = $(event.currentTarget).attr('data-link');
					var _planid = planid;
					console.log(_planid);
					dpd.users.get({id:_thisViewPlan.me.id,following:_planid}, function(result, error) {
						if (result) {
							console.log(result);
							}
						else {
							// console.log(error);
							dpd.users.put(_thisViewPlan.me.id, {following:{$push:_planid}}, function(result, error) {
								if (result) {
									console.log(result);
									}
								else {
									// console.log(error);
								}
							});
						}
					});
				});
			},
			insertData: function(model) {
				_thisViewPlan = this;
				var uploader = model.get('uploader');
				console.log(this.id);
				$.ajax({
					url: "http://dominik-lohmann.de:5000/users/?id="+uploader,
					async: false
				}).done(function(uploaderdata) {
					// $( this ).addClass( "done" );
					console.log(uploaderdata);
					_thisViewPlan.uploaderdata = uploaderdata;
				});
				console.log(jQuery.inArray(model.id, _thisViewPlan.me.following));
				if (jQuery.inArray(model.id, _thisViewPlan.me.following)==-1) {
					model.set("favclass","addPlanToFavourites");
				}
				else {
					model.set("favclass","isPlanToFavourites");
				}
				console.log(model);
				var rowContent = _.template(planPage, {
					id: model.get('id'),
					uploader: _thisViewPlan.uploaderdata.fullname,
					planurl: model.get('planurl'),
					title: model.get('title'),
					subtitle: model.get('subtitle'),
					description: model.get('description'),
					price: model.get('price'),
					start: model.get('start'),
					topic: model.get('topic'),
					end: model.get('end')
				},{variable: 'plan'});
				return(rowContent);
			},
			render: function() {
				this.bindEvents();
				var _thisViewPlan = this;
				console.log('DOING render PlanView.js called');
				_thisViewPlan.htmlContent = '';
				_thisViewPlan.rowContent = '';
				$(this.el).html(_thisViewPlan.htmlContent);
				_.each(this._planerCollection.models, function(model) {
					this.id = model.get('id');
					_thisViewPlan.rowContent = _thisViewPlan.rowContent + _thisViewPlan.insertData(model);
				});
				_thisViewPlan.htmlContent = '<ul data-filter="true" data-filter-placeholder="Suchfilter..." data-role="listview" data-theme="a" data-divider-theme="c" data-filter-theme="a" data-autodividers="true" id="planerListView">'+_thisViewPlan.rowContent+'</ul>';
				$(this.el).html(_thisViewPlan.htmlContent);
				$("#planerListView").listview({
				  autodividers: true,
				  autodividersSelector: function ( li ) {
					console.log(li);
					var rowTopic = li.data( "topic" );
					var out = rowTopic;
					return out;
				  }
				});				
				this.$el.trigger('create');
				new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					$('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				return this;				
			}
		});

        return PlanViewVar;

    }

);