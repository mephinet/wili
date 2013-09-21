enyo.kind({
    name: "WiLi.App",
    kind: "enyo.VFlexBox",
    components: [
	{kind: "enyo.PageHeader", content: $L("WiLi for WebOS")},
	{name: "list", kind: "enyo.VirtualList", onSetupRow: "setupRow", flex: 1, components: [
	    {kind: "WiLi.Haltestelle"}
	]},

	{name: "location", kind: "enyo.PalmService",
	 service: "palm://com.palm.location/", method: "getCurrentPosition",
	 onSuccess: "locationSuccess", onFailure: "locationFailure"
	},

	{name: "webservice", kind: "enyo.WebService",
	 url: "http://wili.gortan.org/bin/wili",
	 onSuccess: "webserviceSuccess", onFailure: "webserviceFailure"
	},

	{name: "scrim", kind: "Scrim", layoutKind: "VFlexLayout",
	 align: "center", pack: "center", components: [
	     {name: "spinner", kind: "SpinnerLarge", showing: 1},
	     {name: "scrimStatus"}
	]},
    ],

    create: function () {
	this.inherited(arguments);
	this.haltestellen = [];
    },

    rendered: function () {
	this.inherited(arguments);
	enyo.asyncMethod(this, "getLocation");
    },

    getLocation: function() {
	this.log();
	this.setScrim($L("Getting position"));
	this.$.location.call();
    },

    locationSuccess: function (sender, response) {
	this.log();
	if (response.errorCode != 0) {
	    this.error("Location failed: " + response.errorCode);
	    return;
	}
	this.log("Location found: " + response.latitude + "/" + response.longitude);
	this.setScrim($L("Getting nearby stations"));
	this.$.webservice.call({lat: response.latitude, lon: response.longitude});
    },

    webserviceSuccess: function (sender, response) {
	this.log("Webservice response: " + enyo.json.stringify(response));
	this.haltestellen = response.haltestellen;
	this.$.list.refresh();
	this.setScrim(null);
    },

    setupRow: function (sender, index) {
	var h = this.haltestellen[index];
	if (h) {
	    this.$.haltestelle.setName(h.name);
	    this.$.haltestelle.setDistance(h.distance);
	    return true;
	}
    },

    setScrim: function (status) {
	this.$.scrimStatus.setContent(status);
	this.$.scrim.setShowing(status);
    },

    locationFailure: function (sender, response) {
	this.error("Location failed: " + enyo.json.stringify(response));
    },

    webserviceFailure: function (sender, response) {
	this.error("Webservice failed: "  + enyo.json.stringify(response));
    }

});
