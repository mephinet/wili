enyo.kind({
    name: "WiLi.StationData",
    kind: "enyo.Component",

    published: {
        StationId: 0,
        name: "",
        distance: 0,
        rbls: null,
        lines: null,
        realtimeData: null
    },

    create: function () {
        this.inherited(arguments);
        this.realtimeData = [];
    },

    fromJson: function (json) {
        this.setStationId(json.id);
        this.setName(json.name);
        this.setDistance(json.distance);
        this.setRbls(json.rbls);
        this.setLines(json.linien);
    },

    hasRealtimeData: function () {
        return !!this.realtimeData;
    },
    
    addRealtimeData: function (realtimeData) {
        this.realtimeData.push(realtimeData);
    }
});
