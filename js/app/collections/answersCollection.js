// AnswersCollection.js
// -------------
define(["jquery", "backbone", "models/AnswerModel"],

  function($, Backbone, AnswerModel) {

	var AnswersCollectionVar = Backbone.Collection.extend({
	
		// localStorage: new Backbone.LocalStorage("answers"), // new Store('answersy'),
		model: AnswerModel,
		
	});

    return AnswersCollectionVar;

  }

);