({
	setSObjectTypes: function(cmp) {
		var sObjectTypes = cmp.get('v.sObjectTypeConfig').split(',');
		cmp.set('v.sObjectTypes',sObjectTypes);
	},
	getSearchResults: function(cmp,evt,hlp) {
		var searchKey = cmp.get('v.searchKey');
		var sObjectTypes = cmp.get('v.sObjectTypes');
	    var action = cmp.get("c.getSearchResults");
		action.setParams({
			"searchString" : searchKey,
			"sObjectTypes" : sObjectTypes
		});
	    action.setCallback(this, function(response) {
	        var state = response.getState();
	        if (cmp.isValid() && state === "SUCCESS") {
				cmp.set('v.searchResults',hlp.formatSearchResults(cmp.get('v.sObjectTypeLabels'),response.getReturnValue()));
				hlp.makeSearchResultsDraggable(cmp,hlp);
	        }
	    });
	    $A.enqueueAction(action);
	},
	formatSearchResults:  function(sObjectTypes,searchResults) {
		var resultArray = [];
		Object.keys(sObjectTypes).forEach(function(elm,idx){
			var resultGroup = {};
			resultGroup.sObjectType = elm;
			resultGroup.sObjectLabelPlural = sObjectTypes[resultGroup.sObjectType];
			resultGroup.results = searchResults ? searchResults[idx] : [];
			resultArray.push(resultGroup);
		});
		return resultArray;
	},
	getSObjectLabels: function (cmp,evt,hlp) {
		var sObjectTypes = cmp.get('v.sObjectTypes');
		var action = cmp.get('c.getSObjectLabelsPlural');
		action.setParams({"sObjectTypes" : sObjectTypes});
		action.setCallback(this, function(response) {
	        var state = response.getState();
	        if (cmp.isValid() && state === "SUCCESS") {
				var sObjectLabels = response.getReturnValue();
				var sObjectLabelsMap = {};
				sObjectTypes.forEach(function(sObjectType,idx){
					sObjectLabelsMap[sObjectType] = sObjectLabels[idx];
				});
				cmp.set('v.sObjectTypeLabels',sObjectLabelsMap);
	        }
	    });
		$A.enqueueAction(action);
	},
	makeSearchResultsDraggable: function (cmp,hlp) {

		var uniqueId = cmp.getGlobalId() + 'external-events';
		$(document).ready(function(){

			// http://salesforce.stackexchange.com/questions/113816/refresh-a-jquery-accordion-in-a-lightning-component
			setTimeout(function(){
				var parent = $(document.getElementById(uniqueId));
				var events = $('.fc-event');
				var results = $(document.getElementById(uniqueId)).find(events);
				// console.log('results', results);

				results.each(function() {
					// store data so the calendar knows to render an event upon drop
					$(this).data('event', {
						title: $.trim($(this).text()), // use the element's text as the event title
						stick: true, // maintain when user navigates (see docs on the renderEvent method)
						sfid: $(this).data('sfid')
					});

					// make the event draggable using jQuery UI
					$(this).draggable({
						zIndex: 999,
						revert: true,      // will cause the event to go back to its
						revertDuration: 0  //  original position after the drag
					});

				});
			},0)

		});
	}
})