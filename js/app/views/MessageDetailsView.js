// MessagesDetailsView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/MessagesDetailsViewPage.html", "views/MessagesDetailsViewNested"],

    function($, Backbone, sidemenusList, SidemenuView, MessagesDetailsViewPage, MessagesDetailsViewNested){
		
		var MessagesDetailsVar = Backbone.View.extend({
		
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
				console.log('DOING render MessagesDetailsView.js called');
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisMessagesView.nestedView = new SidemenuView().fetch();
				_thisMessagesView.$el.html(_.template(MessagesDetailsViewPage, {}));
				// alert(this.options.id);
				_thisMessagesView.$el.html(_.template(MessagesDetailsViewPage, {}));				
				_thisMessagesView.nestedView = new MessagesDetailsViewNested().fetch();
				return this;				
			}
		});

        return MessagesDetailsVar;

    }

);