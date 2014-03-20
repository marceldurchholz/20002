// CardDetailsView.js
// -------
define(["jquery", "backbone", "models/CardModel", "collections/cardsCollection", "views/CardView", "text!templates/cardDetailsView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, CardModel, cardsCollection, CardListViewItems, cardsDetailsViewHTML, sidemenusList, SidemenuView){
		
			var CardDetailsViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				createCard: function () {
					if (this._cardsCollection.online==0) {
						// this._cardsCollection._localStorage_users.create(new Card({"fullname": "offline James King", "device": "5645-6543-5415-5233", "credits": "120", "pictureurl": "http://www.redner24.de/typo3temp/GB/Durchholz_Marcel_4c_1090c3626b_Durc_a4ff6064ff.jpg"}));
						alert('in offline mode you can not add data');
					}
					else {
						var username = ''+Math.floor((Math.random()*10000)+1);
						var password = ''+Math.floor((Math.random()*10000)+1);
						// this._cardsCollection._localStorage_users.create(new CardModel({"fullname": "offline James King", "device": "5645-6543-5415-5233", "credits": "120", "pictureurl": "http://www.redner24.de/typo3temp/GB/Durchholz_Marcel_4c_1090c3626b_Durc_a4ff6064ff.jpg"}));
						this.create(new CardModel({"uploader": "042cb1572ffbea5d", "cardurl": "http://xyz.de.com.uk", "title": "This is a card title", "description": "This is a description", "price": "35", "thumbnailurl": "http://www.cbr250r.com.au/images/card-thumbnail.jpg"}));
					}
					return(false);
				},
				create: function(model) {
					_thisViewCardDetails = this;
					$.ajax('http://dominik-lohmann.de:5000/cards', {
					  type: "POST",
					  contentType: "application/json",
					  data: JSON.stringify(model.attributes),
					  success: function(todo) {
						_thisViewCardDetails.fetch();
					  }, 
					  error: function(xhr,b) {
						console.log(xhr);
						alert(xhr);
					  }
					});
					return(false);
				},
				bindEvents: function() {
					var _thisViewCardDetails = this;
					this.$el.off('click','.createCard').on('click','.createCard',function(){_thisViewCardDetails.createCard();});
				},
				initializeCollection:function(options) {
					// alert(this.id);
					// var myCollection = new Collection([ new Model({id: 'smith'}) ]);
					this._cardsCollection = new cardsCollection([], options);
					// this._cardsCollection = new cardsCollection();
				},
				fetch: function(options) {
					this.$el.hide();
					this.initializeCollection(options);
					// this._cardsCollection = new cardsCollection();
					var _thisViewCardDetails = this;
					this._cardsCollection.fetch({
						error: function(action, coll) {
							console.log(action);
							console.log(coll);
						},
						success: function(coll, jsoncoll) {
							console.log(coll);
							console.log(jsoncoll);
							_thisViewCardDetails.render();
						}
					});
				},
				initialize: function(options) {
					this.initializeCollection(options);
					this.fetch(options);
				},
				insertVariables: function(model) {
					_thisViewCardDetails = this;
					var uploader = model.get('uploader');
					console.log(this.id);
					$.ajax({
						url: "http://dominik-lohmann.de:5000/users/?id="+uploader,
						async: false
					}).done(function(uploaderdata) {
						// $( this ).addClass( "done" );
						console.log(uploaderdata);
						_thisViewCardDetails.uploaderdata = uploaderdata;
					});
					var pricetext = '';
					if (model.get('price')==0) pricetext = 'kostenlos';
					else pricetext = 'für '+model.get('price')+' Coins';
					_template = _.template(cardsDetailsViewHTML, {
						id: model.get('id'),
						uploader: _thisViewCardDetails.uploaderdata.fullname,
						topic: model.get('topic'),
						cardurl: model.get('cardurl'),
						thumbnailurl: model.get('thumbnailurl'),
						title: model.get('title'),
						subtitle: model.get('subtitle'),
						description: model.get('description'),
						price: model.get('price'),
						pricetext: pricetext,
						start: model.get('start'),
						end: model.get('end')
					},{variable: 'card'});
					$(this.el).html(_template);
				},
				render: function() {
					// alert('bla');
					_thisViewCardDetails = this;
					console.log('rendering CardDetailsView.js');
					$(window).resize(function() {
						window.resizeElement('#card_player_1')
					});
					console.log('DOING render CardDetailsView.js called');
					// this.sidebar = _.template(sidebar, {});
					// $('#sidebar').html(sidebar);
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewCardDetails.nestedView = new SidemenuView().fetch();
					var htmlContent = '';
					$(this.el).html(htmlContent);
					// console.log('this._cardsCollection.models');
					// console.log(this._cardsCollection.models[0].attributes.cardurl);
					_.each(this._cardsCollection.models, function(model) {
						this.id = model.get('id');
						_thisViewCardDetails.insertVariables(model);
					});
					
					console.log('this._cardsCollection.models[0].attributes.cardurl');
					console.log(this._cardsCollection.models[0].attributes.cardurl);
					// window.createCardPreview(_thisViewCardDetails.$('#card_player_1'),'card_player_1',this._cardsCollection.models[0].attributes.cardurl);
					
					_thisViewCardDetails.$el.trigger('create');
					new FastClick(document.body);
					_thisViewCardDetails.$el.fadeIn( 500, function() {
						$('.ui-content').scrollTop(0);
						new FastClick(document.body);
					});
					return _thisViewCardDetails;
					// return(data);
				}

			});

        return CardDetailsViewVar;

    }

);