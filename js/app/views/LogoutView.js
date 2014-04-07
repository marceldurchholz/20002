// LogoutView.js
// -------
define(["jquery", "backbone", "text!templates/LogoutView.html"],
    function($, Backbone, template){
        var LogoutViewVar = Backbone.View.extend({
            el: "#page-content",
            initialize: function() {

				_thisViewLogout = this;
				dpd.users.logout(function(err) {
					if (err) {
						console.log(err);
						_thisViewLogout.render();
					}
					else {
						window.dao.rememberUserDataDeleteAutologin(_thisViewLogout.rememberUserDataDeleteAutologinCallback);
						window.system.uid = "0";
						// document.location.hash = "home";
						document.location.href = "#login";
					}
				});
            },
			rememberUserDataDeleteAutologinCallback: function() {
                _thisViewLogout.render();				
			},
            events: {
            },
            render: function() {
				_thisViewLogout = this;
                _thisViewLogout.$el.html(_.template(template, {}));
				_thisViewLogout.$el.trigger('create');
                return _thisViewLogout;
            }
        });
        return LogoutViewVar
    }
);