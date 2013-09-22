enyo.kind({
    name: "WiLi.StationData",
    kind: "enyo.Object",

    published: {
        StationId: 0,
        name: "",
        distance: 0,
        rbls: [],
        lines: [],
        realtimeData: false
    },

    fromJson: function (json) {
        this.setStationId(json.id);
        this.setName(json.name);
        this.setDistance(json.distance);
        this.setRbls(json.rbls);
        this.setLines(json.linien);
    }
});
