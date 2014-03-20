// NoAccess.js
// -------
define(["jquery", "backbone", "text!templates/LogoutView.html"],

    function($, Backbone, template){

        var NoAccess = Backbone.View.extend({

            el: "#page-content",

            initialize: function() {

                this.render();
				
				_thisView = this;
				dpd.users.logout(function(err) {
					if (err) console.log(err);
					else {
						window.system.uid = "0";
						document.location.hash = "home";
					}
				});

            },

            events: {

            },

            render: function() {
				_thisViewLogout = this;

				// sidebar
				// this.sidebar = _.template(sidebar, {});
				// Append the result to the view's element.
				// $('#sidebar').html(sidebar);
				// Maintains chainability
				
                // Setting the view's template property using the Underscore template method
                // this.template = _.template(template, {});
                // Dynamically updates the UI with the view's template
                _thisViewLogout.$el.html(_.template(template, {}));
				// $('#page-content').html(template);

				_thisViewLogout.$el.trigger('create');
				// $('#body').trigger('create');

                return this;

            }

        });

        return NoAccess;

    }

);