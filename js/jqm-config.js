define(['jquery'], function($){ 
  'use strict'; 
  	$(document).bind("mobileinit", function () { 
		$.support.cors = true;
		// $.mobile.ajaxEnabled = true; 
		$.mobile.linkBindingEnabled = false; 
		$.mobile.hashListeningEnabled = false; 
		/*
		$.mobile.pushStateEnabled = false; 
		$.mobile.buttonMarkup.hoverDelay = 0;
		$.mobile.defaultPageTransition = 'slide';
		$.mobile.defaultDialogTransition = "none";
		$.mobile.page.prototype.options.degradeInputs.date = true;
		$.mobile.page.prototype.options.domCache = false;
		$.mobile.ignoreContentEnabled=true;
		*/
	}); 
});
