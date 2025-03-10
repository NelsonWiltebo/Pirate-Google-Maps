import { all_road_networks } from './road_networks.js'
import { change_current_road_network } from './sketch.mjs';
import * as sketch from './sketch.mjs'

window.onload = () => {
    setup();
}

const map_1 = all_road_networks[0];
const map_2 = all_road_networks[1];
const map_3 = all_road_networks[2];

function setup() {
    const map_1_div = document.getElementById("map_1");
    const map_2_div = document.getElementById("map_2");
    const map_3_div = document.getElementById("map_3");

    map_1_div.addEventListener("click", () => {
        localStorage.setItem("selectedRoadNetwork", JSON.stringify(map_1));
    });

    map_2_div.addEventListener("click", () => {
        localStorage.setItem("selectedRoadNetwork", JSON.stringify(map_2));
    });

    map_3_div.addEventListener("click", () => {
        localStorage.setItem("selectedRoadNetwork", JSON.stringify(map_3));
    });
}
