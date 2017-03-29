({
	doInit : function(cmp,evt,hlp) {
		hlp.setSObjectTypes(cmp);
		hlp.getSObjectLabels(cmp,evt,hlp);
		// Initialize search results with sObject categories
		hlp.getSearchResults(cmp,evt,hlp);
	},
	updateSearchResults : function(cmp, evt, hlp) {
		hlp.getSearchResults(cmp,evt,hlp);
	},
	createNewRecord : function(cmp, evt, hlp) {
		console.log('in c.createNewRecord');
		// Get sObjectType
		var button = evt.getSource();
		var sObjectType = button.get('v.name');

		// Launch standard create page in one/one.app container
		var createRecordEvent = $A.get('e.force:createRecord');
		createRecordEvent.setParams({
			"entityApiName": sObjectType
		});
		createRecordEvent.fire();
	},
	next : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('next');
	},
	jsLoaded : function(cmp, evt, hlp) {
		hlp.makeSearchResultsDraggable(cmp,hlp);
	}
})