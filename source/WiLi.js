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
        this.stations = [];
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
        var rbls = [];
        enyo.map(response.haltestellen, function (h) {
            var d = new WiLi.StationData();
            d.fromJson(h);
            enyo.map(h.rbls, function (r) {
                rbls.push(r);
            });
            this.stations.push(d);
        }, this);
        this.$.list.refresh();
        this.setScrim(null);
        this.$.getRealTimeData.call({rbl: rbls, sender: appKey});
    },

    getRealTimeDataSuccess: function (sender, response) {
        this.log(enyo.json.stringify(response));

        // enyo.map(response.data.monitors, function (m) {
        //     var index = this.rbl_to_index[m.locationStop.properties.attributes.rbl];
        //     this.$.list.prepareRow(index);
        //     var lines = [];
        //     enyo.map(m.lines, function (l) {
        //         lines.push(l.name + "/" + l.towards+ ":" + l.departures.departure[0].departureTime.countdown);
        //     }, this);
        //     this.$.haltestelleItem.setLines(this.$.haltestelle.lines.concat(lines));
        // }, this);
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
        this.log(event.rowIndex);
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

    getRealTimeDataFailure: function (sender, response) {
        this.error("GetRealTimeData failed: " + enyo.json.stringify(response));
    }
});
