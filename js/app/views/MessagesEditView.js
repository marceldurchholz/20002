// MessagesEditView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/MessagesEditPage.html", "views/MessagesEditViewNested"],

    function($, Backbone, sidemenusList, SidemenuView, MessagesEditPage, MessagesEditViewNested){
		
		var MessagesVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisMessagesEditView = this;
			},
			initialize: function() {
				this._thisMessagesEditView = this;
				this.fetch();
			},
			sync: function() {
			},
			fetch: function() {
				this.render();
			},
			render: function() {
				this.bindEvents();
				_thisMessagesEditView = this;
				console.log('DOING render MessagesEditView.js called');
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisMessagesEditView.nestedView = new SidemenuView().fetch();
				_thisMessagesEditView.$el.html(_.template(MessagesEditPage, {}));
				_thisMessagesEditView.nestedView = new MessagesEditViewNested().fetch();
				return this;				
			}
		});

        return MessagesVar;

    }

);