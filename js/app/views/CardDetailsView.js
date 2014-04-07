// CardDetailsView.js
// -------
define(["jquery", "backbone", "models/CardModel", "collections/cardsCollection", "views/CardView", "text!templates/cardDetailsView.html", "text!templates/sidemenusList.html", "views/SidemenuView"],

    function($, Backbone, CardModel, cardsCollection, CardListViewItems, cardsDetailsViewHTML, sidemenusList, SidemenuView){
		
			var CardDetailsViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				bindEvents: function() {
					var _thisViewCardDetails = this;
				},
				initializeCollection:function(options) {
					this._cardsCollection = new cardsCollection([], options);
				},
				fetch: function(options) {
					this.initializeCollection(options);
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
						console.log(uploaderdata);
						_thisViewCardDetails.uploaderdata = uploaderdata;
					});
					var pricetext = '';
					if (model.get('price')==0) pricetext = 'kostenlos';
					else pricetext = 'für '+model.get('price')+' Coins';
					_template = _.template(cardsDetailsViewHTML, {
						id: model.get('id'),
						uploaderdata: _thisViewCardDetails.uploaderdata,
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
					_thisViewCardDetails = this;
					console.log('rendering CardDetailsView.js');
					$(window).resize(function() {
						window.resizeElement('#card_player_1')
					});
					console.log('DOING render CardDetailsView.js called');
					$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
					_thisViewCardDetails.nestedView = new SidemenuView().fetch();
					var htmlContent = '';
					$(this.el).html(htmlContent);
					_.each(this._cardsCollection.models, function(model) {
						this.id = model.get('id');
						_thisViewCardDetails.insertVariables(model);
					});
					// console.log('this._cardsCollection.models[0].attributes.cardurl');
					// console.log(this._cardsCollection.models[0].attributes.cardurl);
					// window.createCardPreview(_thisViewCardDetails.$('#card_player_1'),'card_player_1',this._cardsCollection.models[0].attributes.cardurl);
					_thisViewCardDetails.$el.trigger('create');
					hideModal();
					var slicePoint = Math.round($(window).width()/5-14);
					_thisViewCardDetails.$el.fadeIn( 500, function() {
						$('.ui-content').scrollTop(0);
						new FastClick(document.body);
						fontResize();
						$('.readmore').expander({
							slicePoint: slicePoint*4,
							preserveWords: true,
							expandPrefix: '...',
							expandEffect: 'fadeIn',
							expandSpeed: 500,
							collapseEffect: 'fadeOut',
							collapseSpeed: 200,
							expandText: ' Weiterlesen...',
							userCollapseText: '',
							userCollapse: false
						});
					});
					return _thisViewCardDetails;
				}

			});

        return CardDetailsViewVar;

    }

);