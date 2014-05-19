/*jslint onevar: false */
/*global enyo, $L */

enyo.kind({
    name: "WiLi.About",
    kind: enyo.Popup,
    className: "enyo-popup wili-about",

    components: [
        {layoutKind: "VFlexLayout", style: "height: 100%", components: [
            {kind: "Scroller", autoHorizontal: false, horizontal: false, flex: 1, components: [
                {kind: enyo.HFlexBox, pack: "center", components: [
                    {kind: enyo.Image, name: "aboutIcon", className: "icon", src: "icon-64.png"},
                    {kind: enyo.VFlexBox, flex: 1, components: [
                        {name: "title", className: "title"},
                        {name: "copyright", className: "copyright"}
                    ]}
                ]},

                {className: "licenseInfo", content: 'Data source: Stadt Wien - <a href="http://data.wien.gv.at" target="_top">data.wien.gv.at</a><hr />This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.<br /> This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.<br /> You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.', allowHtml: true},
                {name: "info", className: "info", allowHtml: true}
            ]},
            {kind: enyo.Button, caption: $L("Close"), onclick: "close"}
        ]}
    ],

    rendered: function () {
        this.inherited(arguments);

        var info = enyo.fetchAppInfo();
        var url = info.support.url;
        this.$.title.setContent(info.title + " " + info.version);
        this.$.copyright.setContent(info.copyright);
        this.$.info.setContent($L("Suggestions or a bug report? Visit ") + '<a href="' + url + '">' + url + '</a>');
    }
});
