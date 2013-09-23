/*global enyo, appKey, $L, WiLi */

enyo.kind({
    name: "WiLi.App",
    kind: "enyo.VFlexBox",
    components: [
        {kind: "enyo.PageHeader", content: $L("WiLi for WebOS")},
        {name: "list", kind: "enyo.VirtualList", onSetupRow: "setupRow", flex: 1, components: [
            {kind: "WiLi.StationItem", onclick: "toggleOpen"}
        ]},

        {name: "location", kind: "enyo.PalmService",
         service: "palm://com.palm.location/", method: "getCurrentPosition",
         onSuccess: "locationSuccess", onFailure: "locationFailure"
        },

        {name: "getStations", kind: "enyo.WebService",
         url: "http://wili.gortan.org/bin/wili",
         onSuccess: "getStationsSuccess", onFailure: "getStationsFailure"
        },

        {name: "getRealtimeData", kind: "enyo.WebService",
         url: "http://www.wienerlinien.at/ogd_realtime/monitor",
         onSuccess: "getRealtimeDataSuccess", onFailure: "getRealtimeDataFailure"
        },

        {name: "scrim", kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
            {name: "spinner", kind: "SpinnerLarge", showing: 1},
            {name: "scrimStatus"}
        ]}
    ],

    create: function () {
        this.inherited(arguments);
        this.stations = [];
        this.rbl_to_station = {};
    },

    rendered: function () {
        this.inherited(arguments);
        enyo.asyncMethod(this, "getLocation");
    },

    getLocation: function () {
        this.setScrim($L("Getting position"));
        this.$.location.call();
    },

    locationSuccess: function (sender, response) {
        if (response.errorCode !== 0) {
            this.error("Location failed: " + response.errorCode);
            return;
        }
        this.log("Location response: " + response.latitude + "/" + response.longitude);
        this.setScrim($L("Getting nearby stations"));
        this.$.getStations.call({lat: response.latitude, lon: response.longitude});
    },

    getStationsSuccess: function (sender, response) {
        this.log("GetStations response: " + enyo.json.stringify(response));
        var rbls = [];
        enyo.map(response.haltestellen, function (h) {
            var d = new WiLi.StationData();
            d.fromJson(h);
            enyo.map(h.rbls, function (r) {
                rbls.push(r);
                this.rbl_to_station[r] = d;
            }, this);
            this.stations.push(d);
        }, this);
        this.$.list.refresh();
        this.setScrim(null);
        this.$.getRealtimeData.call({rbl: rbls, sender: appKey});
    },

    getRealtimeDataSuccess: function (sender, response) {
        this.log("RealtimeData response: " + enyo.json.stringify(response));

        enyo.map(response.data.monitors, function (m) {
            var d = this.rbl_to_station[m.locationStop.properties.attributes.rbl];
            enyo.map(m.lines, function (l) {
                var rd = new WiLi.RealtimeData();
                rd.fromJson(l);
                d.addRealtimeData(rd);
            });
        }, this);
        this.$.list.refresh();
    },


    // UI helpers

    setupRow: function (sender, index) {
        var h = this.stations[index];
        if (h) {
            this.$.stationItem.setData(h);
            return true;
        }
    },

    setScrim: function (status) {
        this.$.scrimStatus.setContent(status);
        this.$.scrim.setShowing(status);
    },

    toggleOpen: function (sender, event) {
        this.$.list.prepareRow(event.rowIndex);
        this.$.stationItem.toggleOpen();
    },

    // error handling

    locationFailure: function (sender, response) {
        this.error("Location failed: " + enyo.json.stringify(response));
    },

    getStationsFailure: function (sender, response) {
        this.error("GetStations failed: "  + enyo.json.stringify(response));
    },

    getRealtimeDataFailure: function (sender, response) {
        this.error("GetRealtimeData failed: " + enyo.json.stringify(response));
    }
});
