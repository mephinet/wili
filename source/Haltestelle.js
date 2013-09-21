enyo.kind({
    name: "WiLi.Haltestelle",
    kind: "enyo.Item",
    className: "enyo-item haltestelle",

    published: {
        name: "",
        StationId: 0,
        distance: 0,
        rbls: null,
        lines: []
    },

    components: [
        {kind: "enyo.VFlexBox", components: [
            {kind: "enyo.HFlexBox", components: [
                {name: "label", className: "name"},
                {kind: "enyo.Spacer"},
                {name: "distance", className: "distance"}
            ]},
            {kind: "enyo.BasicDrawer", open: false, components: [
                {kind: "enyo.Spinner", showing: true},
                {name: "lines", className: "lines", showing: false}
            ]}
        ]}
    ],

    nameChanged: function () {
        this.$.label.setContent(this.name);
    },

    distanceChanged: function () {
        this.$.distance.setContent(this.distance + "m");
    },

    linesChanged: function () {
        this.$.lines.setContent(this.lines.join(" "));
        this.$.spinner.hide();
        this.$.lines.show();
    },

    toggleOpen: function () {
        this.$.basicDrawer.toggleOpen();
    }

});
