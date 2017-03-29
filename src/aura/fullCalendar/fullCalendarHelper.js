({
	helperMethod : function() {
		console.log('I called the lightning helper method!');
	},
	// eventRelationToEventSObject : function (event) {
	// 	var sObject = {};
	// },
	eventToSObject : function (event) {
		var sObject = {};
		sObject.sobjectType = 'Event';
		sObject.Subject = event.title;
		sObject.IsAllDayEvent = event.allDay;
		sObject.StartDateTime = event.start;
		sObject.EndDateTime = event.end;
		sObject.Id = event.sfid;
		console.log('sObject',sObject);
		return sObject;
	},
	sObjectToEvent : function (sObject) {
		var event = {};
		event.title = sObject.Subject;
		event.allDay = sObject.IsAllDayEvent;
		event.start = sObject.StartDateTime;
		event.end = sObject.EndDateTime;
		event.url = '/' + sObject.Id;
		event.sfid = sObject.Id;
		console.log('event',event);
		return event;
	},
	createEvent: function(cmp,hlp,date) {
		// Cannot use `e.force:createRecord` to pre-populate record
		// Must use a custom action
	},
	getEvents: function(component,recordIds) {
		// https://fullcalendar.io/docs/event_data/Event_Object/
		console.log('in getEventList');
	    var action = component.get("c.getEventSObjects");
		if (recordIds) {
			action.setParams({'recordIds' : recordIds});
		}
	    action.setCallback(this, function(response) {
	        var state = response.getState();
	        if (component.isValid() && state === "SUCCESS") {
				console.log('events',response.getReturnValue());
	            component.set("v.events", response.getReturnValue());
	        }
	    });
	    $A.enqueueAction(action);
	},
	updateEvents: function(cmp,records) {
		console.log('in hlp.updateEvents');

		// http://salesforce.stackexchange.com/questions/113816/refresh-a-jquery-accordion-in-a-lightning-component
		// https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/js_cb_mod_ext_js.htm
		window.setTimeout(
			$A.getCallback(function(){
				var action = cmp.get('c.updateEventSObjects');
				action.setParams({"records" : records});
				action.setCallback(this,function(response){
					var state = response.getState();
					console.log('state ',state);
					if(cmp.isValid() && state === "SUCCESS") {
						console.log('events successfully updated');
					} else if (state === "ERROR") {
						response.getError().forEach(function(err){
							console.log('Error: ' + err.message);
						});
					}
				});
				$A.enqueueAction(action);
			}),0);
	},
	setCalendarDate: function(cmp) {
		// http://momentjs.com/docs/#/displaying/format/
		var view = cmp.get('v.view').toLowerCase();
		var moment = $('#calendar').fullCalendar('getDate');
		var headerDate;
		if (view.includes('month')) {
			headerDate = moment.format('MMMM YYYY');
		} else
		if (view.includes('day')) {
			headerDate = moment.format('MMMM DD, YYYY');
		} else
		if (view.includes('week')) {
			var startDay = moment.startOf('week').format('DD');
			var endDay = moment.endOf('week').format('DD');
			headerDate = moment.format('MMM ') + startDay + ' – ' + endDay + moment.format(', YYYY');
		}
		cmp.set('v.headerDate',headerDate);

	}
})
