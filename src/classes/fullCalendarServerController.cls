public with sharing class fullCalendarServerController {

    private static String getEventQuery (List<String> recordIds) {
        // https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_event.htm
        // https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_eventattendee.htm

        Map<String,List<String>> fields = new Map<String,List<String>>();
        fields.put('Event',new List<String>{
            'Subject','StartDateTime','EndDateTime','IsAllDayEvent',
            'Location','ShowAs','OwnerId',
            'WhatCount','WhatId','WhoCount','WhoId'
        });
        fields.put('EventRelations',new List<String>{'EventId','IsWhat','RelationId'});

        Map<String,String> filters = new Map<String,String>();
        filters.put('Event',' WHERE IsRecurrence = false AND IsChild = false');
        if (recordIds != null && !recordIds.isEmpty()) {
            String inFilter = filters.get('Event');
            inFilter += ' AND Id IN ' + new Set<String>(recordIds);
            filters.put('Event', inFilter);
        }
        filters.put('EventRelations',' WHERE IsDeleted = false');

        String parent = 'Event';
        String child = 'EventRelations';
        String queryString = '';
        queryString += 'SELECT ' + String.join(fields.get(parent),',');
        queryString += ',(SELECT ' + String.join(fields.get(child),',') + ' FROM ' + child + filters.get(child) + ')';
        queryString += ' FROM ' + parent + filters.get(parent);
        System.debug('queryString: ' + queryString);
        return queryString;

    }

    @AuraEnabled
    public static List<sObject> getEventSObjects (List<String> recordIds) {
        return Database.query(getEventQuery(recordIds));
    }

    // TODO: Make this dynamic
    @AuraEnabled
    public static List<sObject> getEventSObjects () {
        return Database.query(getEventQuery(null));
        // List<Event> events = [
        //     SELECT
        //         StartDateTime,
        //         EndDateTime,
        //         IsAllDayEvent,
        //         Location,
        //         OwnerId,
        //         ShowAs,
        //         Subject,
        //         WhatCount,
        //         WhatId,
        //         WhoCount,
        //         WhoId,
        //     (SELECT
        //         EventId,
        //         IsWhat,
        //         RelationId
        //         FROM EventRelations
        //         WHERE IsDeleted = false
        //     )
        //     FROM Event
        //     WHERE IsRecurrence = false
        //     AND IsChild = false
        //     ];
        // System.debug('events: ' + events);
        // return events;
        // Associate meals, recipes, and ingredients to events via the WhatId
        // EventRelation er = new EventRelation();
        // er.EventId = event.Id;
        // er.IsWhat = true;
        // er.RelationId = sObject.Id;
    }

    @AuraEnabled
    public static List<sObject> updateEventSObjects (List<sObject> records) {
        List<Event> events = new List<Event>();
        for (sObject record : records) {
            events.add((Event) record);
        }
        upsert events;
        return events;
    }

    @AuraEnabled
    public static List<List<sObject>> getSearchResults(String searchString, List<String> sObjectTypes) {
        if ( String.isBlank(searchString) || searchString.length() < 2 ) { return null; }

        String queryString = 'FIND \'*' + searchString + '*\' IN ALL FIELDS RETURNING ';
        List<String> results = new List<String>();
        for (String sObjectName : sObjectTypes) {
            results.add(sObjectName + ' (Id, Name)');
        }
        queryString += String.join(results,',');
        System.debug('queryString: ' + queryString);
        List<List<sObject>> searchResults = Search.query(queryString);
        System.debug('searchResults: ' + searchResults);
        return searchResults;

    }

    @AuraEnabled
    public static List<String> getSObjectLabelsPlural (List<String> sObjectTypes) {
        List<String> results = new List<String>();

        Map<String,Schema.SObjectType> gdr = Schema.getGlobalDescribe();

        for (String sot : sObjectTypes) {
            results.add(gdr.get(sot).getDescribe().getLabelPlural());
        }
        return results;
    }

}