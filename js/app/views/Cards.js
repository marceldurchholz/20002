// Cards.js
// -------
define(["jquery", "backbone", "views/SidemenuView", "text!templates/cardsList.html", "views/CardView"],

    function($, Backbone, SidemenuView, cardsList, CardView){
		
		var CardsVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewCards = this;
			},
			initialize: function() {
				this._thisViewCards = this;
				this.fetch();
			},
			sync: function() {
			},
			fetch: function() {
				this.render();
			},
			render: function() {
				this.bindEvents();
				_thisViewCards = this;
				_thisViewCards.nestedView = new SidemenuView().fetch();
				_thisViewCards.$el.html(_.template(cardsList, {}));
				_thisViewCards.nestedView = new CardView().fetch();
				return this;				
			}
		});

        return CardsVar;

    }

);