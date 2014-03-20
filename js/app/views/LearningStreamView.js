// LearningStreamView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/LearningStreamPage.html", "views/LearningStreamNestedView"],

    function($, Backbone, sidemenusList, SidemenuView, LearningStreamPage, LearningStreamNestedView){
		
		var LearningStreamViewVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewLearningStream = this;
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
				_thisViewLearningStream = this;
				console.log('DOING render LearningStreamView.js called');
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewLearningStream.nestedView = new SidemenuView().fetch();
				// _thisViewLearningStream.$el.html(_.template(LearningStreamPage, {}));
				// _thisViewLearningStream.nestedView = new LearningStreamNestedView().fetch();
				_thisViewLearningStream.$el.html(_.template(LearningStreamPage, {}));
				_thisViewLearningStream.nestedView = new LearningStreamNestedView().fetch();
				return this;				
			}
		});

        return LearningStreamViewVar;

    }

);