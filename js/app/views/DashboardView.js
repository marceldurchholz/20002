// DashboardView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/DashboardView.html", "views/DashboardNestedView"],

    function($, Backbone, sidemenusList, SidemenuView, DashboardViewPage, DashboardNestedView){
		
		var DashboardViewVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewDashboard = this;
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
				_thisViewDashboard = this;
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewDashboard.nestedView = new SidemenuView().fetch();
				_thisViewDashboard.$el.html(_.template(DashboardViewPage, {}));
				_thisViewDashboard.nestedView = new DashboardNestedView().fetch();
				return this;
			}

		});

        return DashboardViewVar;

    }

);