<!-- Harness app for calendar components -->
<aura:application extends="force:slds">
	<div class="slds slds-grid">
		<div class="slds-col slds-size--1-of-4">
			<c:fullCalendarSearch />
		</div>
		<div class="slds-col slds-size--3-of-4">
			<c:fullCalendar />
		</div>
	</div>
</aura:application>