({
	doInit : function(cmp,evt,hlp) {
		// hlp.getEvents(cmp);
	},
	prev : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('prev');
		hlp.setCalendarDate(cmp);
	},
	next : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('next');
		hlp.setCalendarDate(cmp);
	},
	today : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('today');
		hlp.setCalendarDate(cmp);
	},
	month : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('changeView','month');
		cmp.set('v.view','month');
		hlp.setCalendarDate(cmp);
	},
	basicWeek : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('changeView','basicWeek');
		cmp.set('v.view','basicWeek');
		hlp.setCalendarDate(cmp);
	},
	listWeek : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('changeView','listWeek');
		cmp.set('v.view','listWeek');
		hlp.setCalendarDate(cmp);
	},
	basicDay : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('changeView','basicDay');
		cmp.set('v.view','basicDay');
		hlp.setCalendarDate(cmp);
	},
	listDay : function(cmp, evt, hlp) {
		$('#calendar').fullCalendar('changeView','listDay');
		cmp.set('v.view','listDay');
		hlp.setCalendarDate(cmp);
	},
	loadEvents : function(cmp,evt,hlp) {
		// https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/ref_aura_valueChange.htm
		// events = [
		// 	{
		// 		title: 'All Day Event',
		// 		start: '2017-03-01'
		// 	},
		// 	{
		// 		title: 'Long Event',
		// 		start: '2017-03-07',
		// 		end: '2017-03-10'
		// 	},
		// 	{
		// 		id: 999,
		// 		title: 'Repeating Event',
		// 		start: '2017-03-09T16:00:00'
		// 	},
		// 	{
		// 		id: 999,
		// 		title: 'Repeating Event',
		// 		start: '2017-03-16T16:00:00'
		// 	},
		// 	{
		// 		title: 'Conference',
		// 		start: '2017-03-11',
		// 		end: '2017-03-13'
		// 	},
		// 	{
		// 		title: 'Meeting',
		// 		start: '2017-03-12T10:30:00',
		// 		end: '2017-03-12T12:30:00'
		// 	},
		// 	{
		// 		title: 'Lunch',
		// 		start: '2017-03-12T12:00:00'
		// 	},
		// 	{
		// 		title: 'Meeting',
		// 		start: '2017-03-12T14:30:00'
		// 	},
		// 	{
		// 		title: 'Happy Hour',
		// 		start: '2017-03-12T17:30:00'
		// 	},
		// 	{
		// 		title: 'Dinner',
		// 		start: '2017-03-12T20:00:00'
		// 	},
		// 	{
		// 		title: 'Birthday Party',
		// 		start: '2017-03-13T07:00:00'
		// 	},
		// 	{
		// 		title: 'Click for Google',
		// 		url: 'http://google.com/',
		// 		start: '2017-03-28'
		// 	}
		// ];
		var events = cmp.get('v.events');
		console.log('events',events);
		$('#calendar').fullCalendar('addEventSource',events);
	},
	jsLoaded : function(cmp, evt, hlp) {
		console.log('jsLoaded running');
		// Fetch events and load in calendar

		$(document).ready(function(){

			$('#calendar').fullCalendar({
				header: false,
				// header: {
				// 	left: 'prev,next,today',
				// 	center: 'title',
				// 	right: 'month,basicWeek,listWeek,basicDay,listDay'
				// },
				// customize the button names,
				// otherwise they'd all just say "list"
				// views: {
				// 	listDay: { buttonText: 'list day' },
				// 	listWeek: { buttonText: 'list week' }
				// },
				// defaultView: 'listWeek',
				// defaultDate: '2017-03-12',
				navLinks: true, // can click day/week names to navigate views
				editable: true,
				droppable: true, // allows things to be dropped onto the calendar
				selectable: true,
				selectHelper: true,
				eventLimit: true, // allow "more" link when too many events
				events: [],
				// Callbacks
				select: function(start, end) {
					var title = prompt('Event Title:');
					var eventData;
					if (title) {
						eventData = {
							title: title,
							start: start,
							end: end
						};
						$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
					}
					$('#calendar').fullCalendar('unselect');
				},
				dayClick: function(date,jsEvent,ui,resourceObj) {
				    console.log('a day has been clicked!');
					hlp.createEvent(cmp,hlp,date);
				},
				drop: function(date,jsEvent,ui,resourceId) {
					console.log('an event has been dropped!');
					hlp.helperMethod();
					// // is the "remove after drop" checkbox checked?
					// if ($('#drop-remove').is(':checked')) {
					// 	// if so, remove the element from the "Draggable Events" list
					// 	$(this).remove();
					// }
				},
				eventClick: function(calEvent, jsEvent, view) {
					hlp.helperMethod();
					console.log('Event',calEvent);
			        console.log('Event: ' + calEvent.title);
			        console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			        console.log('View: ' + view.name);
			        // change the border color just for fun
			        $(this).css('border-color', 'red');
			    },
				eventDataTransform: function(event) {
					// https://fullcalendar.io/docs/event_data/Event_Object/
					var evt;
					// Salesforce Event
					if (event.Id) {
						evt = hlp.sObjectToEvent(event);
					}
					// Regular Event
					else {
						evt = event;
					}
					console.log('eventDataTransform:output',evt);
					return evt;
				},
				eventDrop: function(event, delta, revertFunc) {
			        console.log(event.title + " was dropped on " + event.start.format());
			        if (!confirm("Are you sure about this change?")) {
			            revertFunc();
			        } else {
						var sObject = hlp.eventToSObject(event);
						hlp.updateEvents(cmp,[sObject]);
					}
			    },
				eventResize: function(event, delta, revertFunc) {
			        console.log(event.title + " end is now " + event.end.format());
			        if (!confirm("is this okay?")) {
			            revertFunc();
			        } else {
						var sObject = hlp.eventToSObject(event);
						hlp.updateEvents(cmp,[sObject]);
					}
			    },
				eventReceive: function(event) {
					console.log('event received',event);
					var sObject = hlp.eventToSObject(event);
					sObject.WhatId = sObject.Id;
					sObject.Id = null;
					hlp.updateEvents(cmp,[sObject]);
					// hlp.getEvents(cmp,[event.sfid]);
				}
			});

			$("#calendar").fullCalendar('addEventSource',cmp.get('v.events'));
			hlp.setCalendarDate(cmp);
			hlp.getEvents(cmp);
		});
	}
})