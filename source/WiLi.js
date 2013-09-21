enyo.kind({
    name: "WiLi",
    kind: "enyo.VFlexBox",
    components: [
        {kind: "enyo.PageHeader", content: "WiLi for WebOS"},
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

    ],

    create: function () {
        this.inherited(arguments);
        this.haltestellen = [];
    },

    rendered: function () {
        this.inherited(arguments);
        this.$.location.call();
    },

    locationSuccess: function (sender, response) {
        this.log("Location found: " + response.latitude + "/" + response.longitude);
        this.$.webservice.call({lat: response.latitude, lon: response.longitude});
    },

    webserviceSuccess: function (sender, response) {
        this.log("Webservice response: " + enyo.json.stringify(response));
        this.haltestellen = response.haltestellen;
        this.$.list.refresh();
    },

    setupRow: function (sender, index) {
        var h = this.haltestellen[index];
        if (h) {
            this.$.haltestelle.setName(h.name);
            this.$.haltestelle.setDistance(h.distance);
            return true;
        }
    },

    locationFailure: function (sender, response) {
        this.error("Location failed!");
    },

    webserviceFailure: function (sender, response) {
        this.error("Webservice failed!");
    }

});
