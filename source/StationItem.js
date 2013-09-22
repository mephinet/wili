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
        this.$.lines.setContent(this.formatLines(d));
        this.$.distance.setContent(d.getDistance() + "m");

        this.$.spinner.setShowing(!d.hasRealtimeData());
        this.$.realtimeData.setShowing(d.hasRealtimeData());

        this.$.realtimeData.setContent(this.formatRealtimeData(d.getRealtimeData()));
    },

    toggleOpen: function () {
        this.$.basicDrawer.toggleOpen();
    },

    formatLines: function (d) {
        var last_type = null;
        var res = "";
        enyo.map(d.lines, function (l) {
            if (l.type != last_type) {
                res += "[" + l.type + "] ";
                last_type = l.type;
            }
            res += l.name + ", ";
        });
        return res;
    },

    formatRealtimeData: function (rds) {
        var res = "";
        enyo.map(rds, function (rd) {
            var countdown = rd.getCountdown().join(" - ") || "?";
            res += rd.getLine() + " (" + rd.getTowards() + "): " + countdown + "<br/>";
        });
        return res;
    }
});
