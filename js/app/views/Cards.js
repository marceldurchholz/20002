// Cards.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/cardsList.html", "views/CardView"],

    function($, Backbone, sidemenusList, SidemenuView, cardsList, CardView){
		
		var CardsVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewCards = this;
			},
			initialize: function() {
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
				console.log('DOING render Cards.js called');
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewCards.nestedView = new SidemenuView().fetch();
				_thisViewCards.$el.html(_.template(cardsList, {}));
				_thisViewCards.nestedView = new CardView().fetch();
				return this;
			}
		});

        return CardsVar;

    }

);