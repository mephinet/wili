/*global enyo */

enyo.kind({
    name: "WiLi.RealtimeData",
    kind: "enyo.Component",

    published: {
        line: "",
        towards: "",
        countdown: null
    },

    fromJson: function (json) {
        this.setLine(json.name);
        this.setTowards(json.towards);
        var countdown = [];
        enyo.map(json.departures.departure, function (d) {
            countdown.push(d.departureTime.countdown);
        });
        this.setCountdown(countdown);
    }
});
