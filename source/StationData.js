enyo.kind({
    name: "WiLi.StationData",
    kind: "enyo.Component",

    published: {
        StationId: 0,
        name: "",
        distance: 0,
        rbls: null,
        lines: null,
        realtimeDataForLine: null
    },

    create: function () {
        this.inherited(arguments);
        this.realtimeDataForLine = {};
    },

    fromJson: function (json) {
        this.setStationId(json.id);
        this.setName(json.name);
        this.setDistance(json.distance);
        this.setRbls(json.rbls);
        this.setLines(json.linien);
    },

    hasRealtimeData: function () {
        return !!this.realtimeDataForLine;
    },

    addRealtimeData: function (realtimeData) {
        var l = realtimeData.line;
        if (!this.realtimeDataForLine[l]) {
            this.realtimeDataForLine[l] = [];
        }
        this.realtimeDataForLine[l].push(realtimeData);
    },

    getRealtimeData: function () {
        var data = [];
        enyo.map(this.lines, function (l) {
            var d =this.realtimeDataForLine[l]
            if (d) {
                data = data.concat(d);
            }
        }, this);
        return data;
    }
});
