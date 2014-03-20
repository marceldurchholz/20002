// VideoRecordView.js
// -------
define(["jquery", "backbone", "text!templates/sidemenusList.html", "views/SidemenuView", "text!templates/VideoRecordPage.html", "views/VideoRecordNestedView"],

    function($, Backbone, sidemenusList, SidemenuView, VideoRecordPage, VideoRecordNestedView){
		
		var VideoRecordViewVar = Backbone.View.extend({
		
			el: "#page-content",
			attributes: {"data-role": 'content'},
			events: {
			},
			bindEvents: function() {
				var _thisViewRecordVideo = this;
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
				_thisViewRecordVideo = this;
				$('#sidebarListViewDiv').html(_.template(sidemenusList, {}));
				_thisViewRecordVideo.nestedView = new SidemenuView().fetch();
				_thisViewRecordVideo.$el.html(_.template(VideoRecordPage, {}));
				_thisViewRecordVideo.nestedView = new VideoRecordNestedView().fetch();
				return this;				
			}
		});

        return VideoRecordViewVar;

    }

);