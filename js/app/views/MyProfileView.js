// MyProfileView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/MyProfileView.html", "views/MyProfileNestedView"],

    function($, Backbone, sidemenusList, SidemenuView, MyProfilePage, MyProfileNestedView){
		
			var MyProfileViewVar = Backbone.View.extend({
			
				el: "#page-content",
				attributes: {"data-role": 'content'},
				events: {
				},
				bindEvents: function() {
					var _thisViewProfile = this;
				},
				sync: function() {
				},
				fetch: function() {
					var _thisViewProfile = this;
					_thisViewProfile.render();
				},
				initialize: function() {
					var _thisViewProfile = this;
					_thisViewProfile.fetch();
				},
				render: function() {
					_thisViewProfile = this;
					_thisViewProfile.$el.html(_.template(MyProfilePage, {}));
					_thisViewProfile.nestedView = new MyProfileNestedView().fetch();
					_thisViewProfile.$el.trigger('create');
					_thisViewProfile.bindEvents();
					return _thisViewProfile;
				}

			});

        return MyProfileViewVar;

    }

);
