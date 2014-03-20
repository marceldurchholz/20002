// MobileInit.js
// -------------

// Include Mobile Specific JavaScript files here (or inside of your Mobile router)
require(["jquery", "backbone", "routers/MobileRouter", "jquerymobile", "backbone.validateAll", "backbone.LocalStorage", "functions"],

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

	window.MobileRouter = MobileRouter;
	app.initialize();
	
 }

);
