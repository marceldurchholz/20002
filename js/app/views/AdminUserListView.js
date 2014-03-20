// AdminUserListView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/AdminUserListPage.html", "views/AdminUserListItemView"],

    function($, Backbone, sidemenusList, SidemenuView, AdminUserListPage, AdminUserListItemView){
		
		var AdminUserListViewVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewAdminUserListView = this;
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
				_thisViewAdminUserListView = this;
				console.log('DOING render AdminUserListView.js called');
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewAdminUserListView.nestedView = new SidemenuView().fetch();
				_thisViewAdminUserListView.$el.html(_.template(AdminUserListPage, {}));
				_thisViewAdminUserListView.nestedView = new AdminUserListItemView().fetch();
				return this;
			}
		});

        return AdminUserListViewVar;

    }

);