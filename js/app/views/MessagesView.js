// MessagesView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/MessagesList.html", "views/MessagesViewNested"],

    function($, Backbone, sidemenusList, SidemenuView, MessagesList, MessagesViewNested){
		
		var MessagesVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisMessagesView = this;
			},
			initialize: function() {
				this._thisMessagesView = this;
				this.fetch();
			},
			sync: function() {
			},
			fetch: function() {
				this.render();
			},
			render: function() {
				this.bindEvents();
				_thisMessagesView = this;
				// console.log('DOING render MessagesView.js called');
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisMessagesView.nestedView = new SidemenuView().fetch();
				_thisMessagesView.$el.html(_.template(MessagesList, {}));
				_thisMessagesView.nestedView = new MessagesViewNested().fetch();
				return this;				
			}
		});

        return MessagesVar;

    }

);