enyo.kind({
    name: "WiLi.Haltestelle",
    kind: "enyo.Item",
    className: "enyo-item haltestelle",

    published: {
        name: "",
        distance: 0
    },

    components: [
        {kind: "enyo.HFlexBox", components: [
            {name: "label", content: "?"},
            {kind: "enyo.Spacer"},
            {name: "distance", className: "distance"}
        ]}
    ],

    nameChanged: function () {
        this.$.label.setContent(this.name);
    },

    distanceChanged: function () {
        this.$.distance.setContent(this.distance + "m");
    }
});
