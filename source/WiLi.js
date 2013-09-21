enyo.kind({
    name: "WiLi.App",
    kind: "enyo.VFlexBox",
    components: [
        {kind: "enyo.PageHeader", content: $L("WiLi for WebOS")},
        {name: "list", kind: "enyo.VirtualList", onSetupRow: "setupRow", flex: 1, components: [
            {kind: "WiLi.Haltestelle", onclick: "toggleOpen"}
        ]},

        {name: "location", kind: "enyo.PalmService",
         service: "palm://com.palm.location/", method: "getCurrentPosition",
         onSuccess: "locationSuccess", onFailure: "locationFailure"
        },

        {name: "getStations", kind: "enyo.WebService",
         url: "http://wili.gortan.org/bin/wili",
         onSuccess: "getStationsSuccess", onFailure: "getStationsFailure"
        },

        {name: "getRealTimeData", kind: "enyo.WebService",
         url: "http://www.wienerlinien.at/ogd_realtime/monitor",
         onSuccess: "getRealTimeDataSuccess", onFailure: "getRealTimeDataFailure"
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
        this.$.getStations.call({lat: response.latitude, lon: response.longitude});
    },

    getStationsSuccess: function (sender, response) {
        this.log("GetStations response: " + enyo.json.stringify(response));
        this.haltestellen = response.haltestellen;
        this.$.list.refresh();
        var rbls = [];
        enyo.map(this.haltestellen, function (h) {
            enyo.map(h.rbls, function (r) {
                rbls.push(r);
            });
        });
        this.setScrim(null);
        this.$.getRealTimeData.call({rbl: rbls, sender: appKey});
    },

    getRealTimeDataSuccess: function (sender, response) {
        this.log(enyo.json.stringify(response));
    },


    // UI helpers

    setupRow: function (sender, index) {
        var h = this.haltestellen[index];
        if (h) {
            this.$.haltestelle.setName(h.name);
            this.$.haltestelle.setDistance(h.distance);
            this.$.haltestelle.setRbls(h.rbls);
            return true;
        }
    },

    setScrim: function (status) {
        this.$.scrimStatus.setContent(status);
        this.$.scrim.setShowing(status);
    },

    toggleOpen: function (sender, event) {
        this.$.list.prepareRow(event.rowIndex);
        this.$.haltestelle.toggleOpen();
    },

    // error handling

    locationFailure: function (sender, response) {
        this.error("Location failed: " + enyo.json.stringify(response));
    },

    getStationsFailure: function (sender, response) {
        this.error("GetStations failed: "  + enyo.json.stringify(response));
    },

    getRealTimeDataFailure: function (sender, response) {
        this.error("GetRealTimeData failed: " + enyo.json.stringify(response));
    }
});
