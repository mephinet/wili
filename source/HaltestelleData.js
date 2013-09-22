enyo.kind({
    name: "WiLi.HaltestelleData",
    kind: "enyo.Object",

    published: {
        HaltestelleId: 0,
        name: "",
        distance: 0,
        rbls: [],
        linien: [],
        realtimeData: false
    },

    fromJson: function (json) {
        this.setHaltestelleId(json.id);
        this.setName(json.name);
        this.setDistance(json.distance);
        this.setRbls(json.rbls);
        this.setLinien(json.linien);
    }
});
