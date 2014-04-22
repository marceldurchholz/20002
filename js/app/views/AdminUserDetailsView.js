// AdminUserDetailsView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/AdminUserDetailsPage.html", "views/AdminUserDetailsNestedView"],

    function($, Backbone, sidemenusList, SidemenuView, AdminUserDetailsPage, AdminUserDetailsNestedView){
		
			var AdminUserDetailsViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				events: {
				},
				bindEvents: function() {
					_thisViewAdminUserDetails = this;
				},
				sync: function() {
				},
				fetch: function() {
					_thisViewAdminUserDetails = this;
					_thisViewAdminUserDetails.render();
				},
				initialize: function() {
					_thisViewAdminUserDetails = this;
					_thisViewAdminUserDetails.fetch();
				},
				render: function() {
					_thisViewAdminUserDetails = this;
					_thisViewAdminUserDetails.$el.html(_.template(AdminUserDetailsPage, {}));
					_thisViewAdminUserDetails.nestedView = new AdminUserDetailsNestedView().fetch();
					_thisViewAdminUserDetails.$el.trigger('create');
					_thisViewAdminUserDetails.bindEvents();
					return _thisViewAdminUserDetails;
				}

			});

        return AdminUserDetailsViewVar;

    }

);
