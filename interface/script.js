"use strict";
var main = document.getElementById("main");
var path = [0, 1, 5];
function color_path(path) {
    var embedElement = main.querySelector('#map');
    // Ensure the embed is loaded before accessing its content
    embedElement.addEventListener("load", function () {
        var svgDoc = embedElement.getSVGDocument();
        var svg = svgDoc !== null
            ? svgDoc.querySelector('svg')
            : null;
        var all_roads = svg !== null
            ? svg.querySelectorAll('.road')
            : null;
        var _loop_1 = function (i) {
            all_roads === null || all_roads === void 0 ? void 0 : all_roads.forEach(function (x) {
                if (x.dataset.from && x.dataset.to) {
                    if ((parseInt(x.dataset.from) === path[i - 1] || parseInt(x.dataset.from) === path[i])
                        && (parseInt(x.dataset.to) === path[i - 1] || parseInt(x.dataset.to) === path[i])) {
                        x.setAttribute('stroke', "lime");
                    }
                }
            });
        };
        for (var i = 1; i < path.length; i++) {
            _loop_1(i);
        }
    });
}
color_path(path);
