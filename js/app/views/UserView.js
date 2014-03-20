// CardView.js
// -------
define(["jquery", "backbone", "models/CardModel", "collections/cardsCollection", "text!templates/cardView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, CardModel, cardsCollection, cardPage, sidemenusList, SidemenuView){
		
		var CardViewVar = Backbone.View.extend({
			
			el: "#CardsNestedViewDiv",
			initialize: function() {
				console.log('initializing CardView.js');
			},
			initializeme: function() {
				console.log('initializing ME in CardView.js');
				$(this.el).html('loading...');
				$.when( this.fetchMe() ).then(
				  function( status ) {
					_thisViewCard.me = status;
					_thisViewCard.render();
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
					if ( _thisViewCard.dfd.state() === "pending" ) {
						_thisViewCard.dfd.notify( "working... " );
						setTimeout( _thisViewCard.fetchWorking, 100 );
					}
				}, 1 );
			},
			fetchMe: function() {
				_thisViewCard = this;
				console.log('fetchMe CardView.js');
				_thisViewCard.dfd = new jQuery.Deferred();
				_thisViewCard.fetchWorking();
				dpd.users.me(function(user) {
					if (user) {
						var fetchMe = setTimeout ( function() {
							_thisViewCard.dfd.resolve(user);
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
				_thisViewCard = this;
				console.log('fetching CardView.js');
				this.$el.hide();
				this._cardsCollection = new cardsCollection();
				this._cardsCollection.fetch({
					success: function(coll, jsoncoll) {
						console.log(_thisViewCard);
						// _thisViewCard.render();
						_thisViewCard.initializeme();
					},
					error: function(action, coll) {
						console.log('ERROR fetching _cardsCollection');
						console.log(action);
						console.log(coll);
						// _thisViewCard.render();
					}
				});
			},
			bindEvents: function() {
				var _thisViewCard = this;
				// this.$el.off('click','.clickRow').on('click','.clickRow',function(){_thisViewCard.clicked(e);});
				this.$el.off('click','.showCardDetailsLink').on('click','.showCardDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
				this.$el.off('click','.isCardToFavourites').on('click','.isCardToFavourites',function(event){
					event.preventDefault();
					alert('isCardToFavourites');
				});
				this.$el.off('click','.addCardToFavourites').on('click','.addCardToFavourites',function(event){
					event.preventDefault();
					console.log(event);
					$(this).removeClass("addCardToFavourites");
					$(this).addClass("isCardToFavourites");
					var cardid = $(event.currentTarget).attr('data-link');
					var _cardid = cardid;
					console.log(_cardid);
					dpd.users.get({id:_thisViewCard.me.id,following:_cardid}, function(result, error) {
						if (result) {
							console.log(result);
							}
						else {
							// console.log(error);
							dpd.users.put(_thisViewCard.me.id, {following:{$push:_cardid}}, function(result, error) {
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
				_thisViewCard = this;
				var uploader = model.get('uploader');
				console.log(this.id);
				if ( typeof( _thisViewCard.uploaderdata ) == "undefined") {
					$.ajax({
						url: "http://dominik-lohmann.de:5000/users/?id="+uploader,
						async: false
					}).done(function(uploaderdata) {
						// $( this ).addClass( "done" );
						console.log(uploaderdata);
						_thisViewCard.uploaderdata = uploaderdata;
					});
				}
				console.log(jQuery.inArray(model.id, _thisViewCard.me.following));
				if (jQuery.inArray(model.id, _thisViewCard.me.following)==-1) {
					model.set("favclass","addCardToFavourites");
				}
				else {
					model.set("favclass","isCardToFavourites");
				}
				console.log(model);
				var rowContent = _.template(cardPage, {
					id: model.get('id'),
					uploader: _thisViewCard.uploaderdata.fullname,
					cardurl: model.get('cardurl'),
					title: model.get('title'),
					subtitle: model.get('subtitle'),
					description: model.get('description'),
					price: model.get('price'),
					start: model.get('start'),
					topic: model.get('topic'),
					end: model.get('end')
				},{variable: 'card'});
				return(rowContent);
			},
			render: function() {
				this.bindEvents();
				var _thisViewCard = this;
				console.log('DOING render CardView.js called');
				_thisViewCard.htmlContent = '';
				_thisViewCard.rowContent = '';
				$(this.el).html(_thisViewCard.htmlContent);
				_.each(this._cardsCollection.models, function(model) {
					this.id = model.get('id');
					_thisViewCard.rowContent = _thisViewCard.rowContent + _thisViewCard.insertData(model);
				});
				_thisViewCard.htmlContent = '<ul data-filter="true" data-filter-placeholder="Suchfilter..." data-role="listview" data-theme="a" data-divider-theme="f" data-filter-theme="a" data-autodividers="true" id="cardsListView">'+_thisViewCard.rowContent+'</ul>';
				$(this.el).html(_thisViewCard.htmlContent);
				$("#cardsListView").listview({
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

        return CardViewVar;

    }

);