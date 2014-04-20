// MobileInit.js
// -------------

// Include Mobile Specific JavaScript files here (or inside of your Mobile router)
require(["jquery", "backbone", "routers/MobileRouter", "jquerymobile", "backbone.validateAll", "backbone.LocalStorage", "functions", "jqueryui", "jtouchpunch"],

  function($, Backbone, MobileRouter) {
	// LocalStorageAdapter
	/*
	dpd.messages.get({}, function (arr,err) {
		if(err) {
			return console.log(err);
		}
		$.each( arr, function( key, message ) {
			dpd.messages.del(message.id, function (err) {
			  if(err) console.log(err);
			});						
		});
	});

	dpd.orders.get({}, function (arr,err) {
		if(err) {
			return console.log(err);
		}
		$.each( arr, function( key, message ) {
			dpd.orders.del(message.id, function (err) {
			  if(err) console.log(err);
			});						
		});
	});

	dpd.users.get({}, function (arr,err) {
		if(err) {
			return console.log(err);
		}
		$.each( arr, function( key, message ) {
			dpd.users.put(message.id, {"purchases":[], "followers":[], "interests":[], "following":[]}, function (result, err) {
			  if(err) console.log(err);
			});						
		});
	});
	*/
		
	// dpd.socketReady(function() {
			
		// dpd.users.off('changed');
		
		dpd.users.on('changed', function(changedData) {
			/*
			if (msgData.sender==window.system.uid || msgData.receiver==window.system.uid) {
				msgArray = new Array;
				msgArray.push(msgData);
				_thisMessagesDetailsViewNested.messages.push(msgData);
				_thisMessagesDetailsViewNested.fetch();
			}
			*/
			// window.me = me;
			console.log('changed');
			console.log(changedData);
		});
		
		/*
		dpd.users.get(window.system.aoid, function (result) {
			alert('found');
			alert(result.kdnr);
			console.log(result);
		});
		dpd.users.put(window.system.aoid, {"slogan":"Mobile Training and Infotainment"}, function(result, err) {
		  if(err) return console.log(err);
		  console.log(result, result.id);
		});
		*/

		window.MobileRouter = MobileRouter;
		app.initialize();
		checkTopNaviAppConfig();
		
	  // Do something
	// });
 }

);
