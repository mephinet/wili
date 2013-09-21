enyo.kind({
    name: "WiLi.Haltestelle",
    kind: "enyo.Item",
    className: "enyo-item haltestelle",

    published: {
        name: "",
        distance: 0,
        rbls: null
    },

    components: [
        {kind: "enyo.VFlexBox", components: [
            {kind: "enyo.HFlexBox", components: [
                {name: "label", className: "name"},
                {kind: "enyo.Spacer"},
                {name: "distance", className: "distance"}
            ]},
            {kind: "enyo.BasicDrawer", open: false, components: [
                {kind: "enyo.Spinner", showing: true}
            ]}
        ]}
    ],

    nameChanged: function () {
        this.$.label.setContent(this.name);
    },

    distanceChanged: function () {
        this.$.distance.setContent(this.distance + "m");
    },

    toggleOpen: function () {
        this.$.basicDrawer.toggleOpen();
    }

});
