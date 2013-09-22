enyo.kind({
    name: "WiLi.HaltestelleItem",
    kind: "enyo.Item",
    className: "enyo-item haltestelle",

    published: {
        data: null
    },

    components: [
        {kind: "enyo.VFlexBox", components: [
            {kind: "enyo.HFlexBox", components: [
                {name: "label", className: "name"},
                {name: "lines", className: "lines"},
                {kind: "enyo.Spacer"},
                {name: "distance", className: "distance"}
            ]},
            {kind: "enyo.BasicDrawer", open: false, components: [
                {kind: "enyo.Spinner", showing: true},
            ]}
        ]}
    ],

    dataChanged: function () {
        var d = this.data;
        this.$.label.setContent(d.name);
        this.$.lines.setContent(d.linien.join(", "));
        this.$.distance.setContent(d.distance + "m");
    },

    toggleOpen: function () {
        this.$.basicDrawer.toggleOpen();
    }

});
