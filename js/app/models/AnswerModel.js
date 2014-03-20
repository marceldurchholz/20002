// AnswerModel.js
// --------
define(["jquery", "backbone", "routers/MobileRouter"],

function($, Backbone, MobileRouter) {

        var AnswerModel = Backbone.Model.extend({
		
			defaults: {
				'question': {},
				'answers': {}
			},
		
		});
		
		return AnswerModel;

    }

);
