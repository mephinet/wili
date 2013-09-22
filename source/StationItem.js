enyo.kind({
    name: "WiLi.StationItem",
    kind: "enyo.Item",
    className: "enyo-item wili-station",

    published: {
        data: null
    },

    components: [
        {kind: "enyo.VFlexBox", components: [
            {kind: "enyo.HFlexBox", components: [
                {name: "label", className: "station-name"},
                {name: "lines", className: "station-lines"},
                {kind: "enyo.Spacer"},
                {name: "distance", className: "station-distance"}
            ]},
            {kind: "enyo.BasicDrawer", open: false, components: [
                {kind: "enyo.Spinner", showing: true},
            ]}
        ]}
    ],

    dataChanged: function () {
        var d = this.data;
        this.$.label.setContent(d.name);
        this.$.lines.setContent(d.lines.join(", "));
        this.$.distance.setContent(d.distance + "m");
    },

    toggleOpen: function () {
        this.$.basicDrawer.toggleOpen();
    }

});
