// CardView.js
// -------
define(["jquery", "backbone", "collections/cardsCollection", "text!templates/cardView.html"],

    function($, Backbone, cardsCollection, cardPage){
		
		var CardViewVar = Backbone.View.extend({
			
			el: "#CardsNestedViewDiv",
			initialize: function() {
				// console.log('initializing CardView.js');
			},
			initializeme: function() {
				// console.log('initializing ME in CardView.js');
				// $(this.el).html('loading...');
				$.when( this.fetchMe() ).then(
				  function( status ) {
					_thisViewVideo.me = status;
					_thisViewVideo.render();
				  },
				  function( status ) {
					alert( "Benutzer konnte nicht erkannt werden." );
				  },
				  function( status ) {
					// console.log('still fetchWorking');
				  }
				);
			},
			fetchWorking: function() {
				var setTimeoutWatcher = setTimeout(function foo() {
					if ( _thisViewVideo.dfd.state() === "pending" ) {
						_thisViewVideo.dfd.notify( "working... " );
						setTimeout( _thisViewVideo.fetchWorking, 100 );
					}
				}, 1 );
			},
			fetchMe: function() {
				_thisViewVideo = this;
				// console.log('fetchMe CardView.js');
				_thisViewVideo.dfd = new $.Deferred();
				_thisViewVideo.fetchWorking();
				// dpd.users.me(function(me) {
				dpd('users').get(window.system.uid, function(me, err) {
					if (me) {
						var fetchMe = setTimeout ( function() {
							_thisViewVideo.dfd.resolve(me);
						}, 0 );
					}
					else {
						// console.log('You are not logged in!');
						// window.location.href = "#noaccess";
						var meid = getRandomID().toString();
						var me = new Object();
						me.id = meid;
						_thisViewVideo.dfd.resolve(me);
					}
				});
				return this.dfd.promise();
			},
			fetch: function() {	
				_thisViewVideo = this;
				this.$el.hide();
				showModal();
				
				this._cardsCollection = new cardsCollection();
				this._cardsCollection.fetch({
					success: function(coll, jsoncoll) {
						_thisViewVideo.initializeme();
					},
					error: function(action, coll) {
						console.log('ERROR fetching _cardsCollection');
					}
				});
			},
			bindEvents: function() {
				var _thisViewVideo = this;
				// this.$el.off('click','.clickRow').on('click','.clickRow',function(){_thisViewVideo.clicked(e);});
				this.$el.off('click','.showVideoDetailsLink').on('click','.showVideoDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
			},
			insertData: function(model) {
				_thisViewVideo = this;
				var uploader = model.get('uploader');
				rowContent = '';
				// if (model.get('uploader') == window.system.aoid) {
				//	if (window.system.master!=true) {
						rowContent = _.template(cardPage, {
							id: model.get('id'),
							// uploader: model.get('uploader'),
							uploader: model.get('uploaderdata').fullname,
							url: model.get('url'),
							title: model.get('title'),
							description: model.get('description'),
							price: model.get('price'),
							thumbnailurl: model.get('thumbnailurl'),
							topic: model.get('topic')
						},{variable: 'card'});
				//	}
				// }
				return(rowContent);
			},
			render: function() {
				this.bindEvents();
				var _thisViewVideo = this;
				_thisViewVideo.htmlContent = '';
				_thisViewVideo.rowContent = '';
				_.each(this._cardsCollection.models, function(model) {
					var uploader = model.attributes.uploader; // "ed568841af69d94d";
					$.ajax({
						url: 'http://dominik-lohmann.de:5000/users/?id='+uploader,
						async: false,
						success: function(data, textStatus, XMLHttpRequest){
							model.attributes.uploaderdata = data;
							_thisViewVideo.rowContent = _thisViewVideo.rowContent + _thisViewVideo.insertData(model);
						},
						error:function (xhr, ajaxOptions, thrownError) {
							if (xhr.responseText=='{"message":"not found","statusCode":404,"status":404}') {
								dpd.cards.put(model.attributes.id, {"active":false}, function(result, err) {
								  if(err) return console.log(err);
								});
							}
						}
					});
				});
				_thisViewVideo.htmlContent = '<ul id="cardsListView" data-filter="true" data-filter-placeholder="Suchfilter..." data-filter-theme="a" data-role="listview" data-theme="a" data-divider-theme="f" data-autodividers="true">'+_thisViewVideo.rowContent+'</ul>';
				$(this.el).html(_thisViewVideo.htmlContent);
				$("#cardsListView").listview({
				  autodividers: true,
				  autodividersSelector: function ( li ) {
					// console.log(li);
					var rowTopic = li.data( "topic" );
					var out = rowTopic;
					return out;
				  }
				});				
				hideModal();
				this.$el.trigger('create');
				new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					// $('.ui-content').scrollTop(0);
					new FastClick(document.body);
				});
				return this;				
			}
		});

        return CardViewVar;

    }

);