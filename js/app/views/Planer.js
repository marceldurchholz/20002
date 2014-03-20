// Planer.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/planerList.html", "views/PlanView"],

    function($, Backbone, sidemenusList, SidemenuView, planerList, PlanView){
		
		var PlanerVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewPlaner = this;
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
				_thisViewPlaner = this;
				console.log('DOING render Planer.js called');
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewPlaner.nestedView = new SidemenuView().fetch();
				_thisViewPlaner.$el.html(_.template(planerList, {}));
				_thisViewPlaner.nestedView = new PlanView().fetch();
				return this;
			}
		});

        return PlanerVar;

    }

);