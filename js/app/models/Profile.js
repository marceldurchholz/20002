// Profile.js
// --------
define(["jquery", "backbone", "routers/MobileRouter", "jquerymobile", "backbone.validateAll"],

function($, Backbone, MobileRouter) {

        var Profile = Backbone.Model.extend({
			/*
			defaults: {
				id : '',
				fullname : '',
				device: '',
				credits: '',
				pictureurl: '',
			}
			/*,
			url : function() {
				// Important! It's got to know where to send its REST calls. 
				// In this case, POST to '/donuts' and PUT to '/donuts/:id'
				return this.id ? '/donuts/' + this.id : '/donuts'; 
			}
			*/			
		});
		
		return Profile;

    }

);
