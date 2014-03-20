// MessagesEditViewNested.js
// -------
define(["jquery", "backbone", "text!templates/MessagesEditNestedPage.html"],

    function($, Backbone, MessagesEditNestedPage){
		
		var MessageViewNestedVar = Backbone.View.extend({
			
			el: "#MessagesEditNestedViewDiv",
			initialize: function() {
				console.log('initializing MessagesEditViewNested.js');
			},
			fetch: function() {	
				// alert('bla');
				_thisMessagesEditViewNested = this;
				console.log('fetching MessagesEditViewNested.js');
				this.$el.hide();
				showModal();
				
				// _thisMessagesEditView.options.id = 'wiuczrezi';
				// alert(_thisMessagesEditView.options.id);
				if (_thisMessagesEditView.options.id==0) {
					alert('bla');
					_thisMessagesEditViewNested.render();
				}
				else {
					dpd.messages.get(_thisMessagesEditView.options.id, function (result) {
						// console.log(result);

						if (result!=null) dpd('users').get(window.system.uid, function(me, err) {
							// dpd.users.me(function(me) {
							if (me) {
								// console.log(me.id);
								// http://dominik-lohmann.de:5000/messages?{"$or":[{"sender":"009505631619d88e"},{"receiver":"009505631619d88e"}],$sort:{cdate:-1}}
								// var query = {$or:[{"sender":result.sender},{"receiver":result.receiver}],$sort:{cdate:-1}};
								var query = {  $or:[{"sender":result.sender,"receiver":result.receiver}  ,  {"sender":result.receiver,"receiver":result.sender}]  ,$sort:{cdate:-1}};
								dpd.messages.get(query, function (allmessagesdata) {
									// console.log(allmessagesdata);
									_thisMessagesEditViewNested.messages = new Array;
									$.each( allmessagesdata, function( key, message ) {
										if (message.unread==undefined) message.unread=0;
										if (message.sender==me.id) message.unread = 0;
										else if ($.inArray(me.id, message.readby)<0) message.unread += 1;
										if (message.unread==1) {
											dpd.messages.put(message.id, {"readby": {$push:$.trim(window.me.id)}} );
										}
										_thisMessagesEditViewNested.messages.push(message);
									});
									
									
									
									var displayedGroups = new Array();
									$.each(_thisMessagesEditViewNested.messages,function(key4,message) {
										_thisMessagesEditViewNested.messages[key4].display = 1;
										var inArray = false;
										$.each( displayedGroups, function( key8, group ) {
											inArray = are_arrs_equal(group, [message.sender,message.receiver]);									
											if (inArray==true) return(false);
										});
										if (inArray==true) _thisMessagesEditViewNested.messages[key4].display=1;
										else {
											if (_thisMessagesEditViewNested.messages[key4].sender==me.id) _thisMessagesEditViewNested.messages[key4].fullname = me.fullname;
											else {
												$.ajax({
													url: 'http://dominik-lohmann.de:5000/users?id='+_thisMessagesEditViewNested.messages[key4].sender,
													async: false
												}).done(function(userdata) {
													_thisMessagesEditViewNested.messages[key4].fullname = userdata.fullname;
												});
											}
										}
										var groupArr = new Array;
										groupArr.push(message.sender);
										groupArr.push(message.receiver);
										displayedGroups.push(groupArr);
										// _thisMessagesEditViewNested.messages[key4] = message;
									});
										
									
										
									$.each(_thisMessagesEditViewNested.messages,function(key4,message4) {
										var groupArr = new Array();
										if ($.inArray(me.id, _thisMessagesEditViewNested.messages[key4].readby)==-1) {
											$.each(_thisMessagesEditViewNested.messages,function(key5,message5) {
												if (_thisMessagesEditViewNested.messages[key5].receiver == _thisMessagesEditViewNested.messages[key4].receiver && _thisMessagesEditViewNested.messages[key5].sender == _thisMessagesEditViewNested.messages[key4].sender) {
													if (_thisMessagesEditViewNested.messages[key5].searchtext == undefined) _thisMessagesEditViewNested.messages[key5].searchtext = '';
													_thisMessagesEditViewNested.messages[key5].searchtext = _thisMessagesEditViewNested.messages[key4].content + _thisMessagesEditViewNested.messages[key5].searchtext;
													if (_thisMessagesEditViewNested.messages[key4].sender!=me.id) {
														if ($.inArray(me.id, _thisMessagesEditViewNested.messages[key5].readby)<0) {
															if (_thisMessagesEditViewNested.messages[key5].anzahl == undefined) _thisMessagesEditViewNested.messages[key5].anzahl = 0;
															_thisMessagesEditViewNested.messages[key5].anzahl += 1;
														}
													}
												}
											});
										}
									});
									
									// console.log(_thisMessagesEditViewNested.messages);
									
									_thisMessagesEditViewNested.render();
									
								});
							}
							else {
								console.log('You are not logged in!');
								window.location.href = "#noaccess";
							}
						});
					
					
					});
				}
				
			},
			bindEvents: function() {
				var _thisMessagesEditViewNested = this;
				this.$el.off('click','.showVideoDetailsLink').on('click','.showVideoDetailsLink',function(event){
					event.preventDefault();
					window.location.href = event.currentTarget.hash;
				});
			},
			render: function() {
				this.bindEvents();
				var _thisMessagesEditViewNested = this;
				console.log('DOING render MessagesEditViewNested.js called');
				
				_thisMessagesEditViewNested.htmlContent = '';
				// _thisMessagesEditViewNested.htmlContent = _thisMessagesEditViewNested.messages;
				_thisMessagesEditViewNested.$el.html(_.template(MessagesEditNestedPage, {
					data: _thisMessagesEditViewNested.messages
				},{variable: 'messages'}));

				hideModal();
				this.$el.trigger('create');
				new FastClick(document.body);
				this.$el.fadeIn( 500, function() {
					// $('.ui-content').scrollTop(0);
					new FastClick(document.body);
					// alert($('#MessagesEditNestedViewDiv').height()-$(window).height());
					// alert($('#flexiblecontent').height());
					fontResize();
					$('#flexiblecontent').attr("height", "auto");
					
					$('.ui-content').scrollTop($('#MessagesEditViewDiv').height()); // $('#MessagesEditViewDiv').height()
				});
				return this;				
			}
		});

        return MessageViewNestedVar;

    }

);