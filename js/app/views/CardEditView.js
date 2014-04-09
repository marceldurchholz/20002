// CardEditView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/CardEditPage.html", "views/CardEditNestedView"],

    function($, Backbone, sidemenusList, SidemenuView, CardEditPage, CardEditNestedView){
		
		var CardEditViewVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			bindEvents: function() {
				_thisViewCardEdit = this;
			},
			initialize: function() {
				_thisViewCardEdit = this;
				_thisViewCardEdit.fetch();
			},
			sync: function() {
				_thisViewCardEdit = this;
			},
			fetch: function() {
				_thisViewCardEdit = this;
				_thisViewCardEdit.render();
			},
			render: function() {
				_thisViewCardEdit = this;
				_thisViewCardEdit.bindEvents();
				console.log('DOING render CardEditView.js called');
				// console.log(_thisViewCardEdit.options);
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewCardEdit.nestedView = new SidemenuView().fetch();
				_thisViewCardEdit.$el.html(_.template(CardEditPage, {}));
				_thisViewCardEdit.nestedView = new CardEditNestedView().fetch({options:_thisViewCardEdit.options});
				return _thisViewCardEdit;
			}
		});

        return CardEditViewVar;

    }

);