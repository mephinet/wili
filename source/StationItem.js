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
                {name: "realtimeData", showing: false, allowHtml: true}
            ]}
        ]}
    ],

    dataChanged: function () {
        var d = this.data;
        this.$.label.setContent(d.getName());
        this.$.lines.setContent(d.getLines().join(", "));
        this.$.distance.setContent(d.getDistance() + "m");

        this.$.spinner.setShowing(!d.hasRealtimeData());
        this.$.realtimeData.setShowing(d.hasRealtimeData());

        var s = "";
        enyo.map(d.getRealtimeData(), function (rd) {
            var countdown = rd.getCountdown().join(" - ");
            if (!countdown) {
                countdown = "?";
            }
            s += rd.getLine() + " (" + rd.getTowards() + "): " + countdown + "<br/>";
        });
        this.$.realtimeData.setContent(s);
    },

    toggleOpen: function () {
        this.$.basicDrawer.toggleOpen();
    }

});
