"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = require("../lib/list");
var queue_array_1 = require("../lib/queue_array");
var graphs_1 = require("../lib/graphs");
var road_0_1 = {
    connection: (0, list_1.pair)(0, 1),
    name: "0-1",
    speed: 80,
    travel_time: 60,
    average_speed: 70
};
var road_0_2 = {
    connection: (0, list_1.pair)(0, 2),
    name: "0-2",
    speed: 80,
    travel_time: 30,
    average_speed: 80
};
var road_0_5 = {
    connection: (0, list_1.pair)(0, 5),
    name: "0-5",
    speed: 120,
    travel_time: 150,
    average_speed: 40
};
var road_1_3 = {
    connection: (0, list_1.pair)(1, 3),
    name: "1-3",
    speed: 70,
    travel_time: 20,
    average_speed: 50
};
var road_1_5 = {
    connection: (0, list_1.pair)(1, 5),
    name: "1-5",
    speed: 100,
    travel_time: 120,
    average_speed: 0
};
var road_2_3 = {
    connection: (0, list_1.pair)(2, 3),
    name: "2-3",
    speed: 50,
    travel_time: 10,
    average_speed: 40
};
var road_2_4 = {
    connection: (0, list_1.pair)(2, 4),
    name: "2-4",
    speed: 80,
    travel_time: 50,
    average_speed: 80
};
var road_4_5 = {
    connection: (0, list_1.pair)(0, 1),
    name: "4-5",
    speed: 80,
    travel_time: 45,
    average_speed: 80
};
var road_connections = [];
var _roads = {
    adj: [
        (0, list_1.list)(1, 2, 5),
        (0, list_1.list)(0, 3, 5),
        (0, list_1.list)(0, 3, 4),
        (0, list_1.list)(1, 2),
        (0, list_1.list)(2, 5),
        (0, list_1.list)(1, 4)
    ],
    edges: [
        [undefined, road_0_1, road_0_2, undefined, undefined, road_0_5],
        [road_0_1, undefined, undefined, road_1_3, undefined, road_1_5],
        [road_0_2, undefined, undefined, road_2_3, road_2_4, undefined],
        [undefined, road_1_3, road_2_3, undefined, undefined, undefined],
        [undefined, undefined, road_2_4, undefined, undefined, road_4_5],
        [undefined, road_1_5, undefined, undefined, road_4_5, undefined],
    ],
    size: 6
};
function base_travel_time(road) {
    return road.travel_time;
}
function current_travel_time(road) {
    //console.log("test");
    var average_speed = road.average_speed;
    var speed = road.speed;
    var travel_time = road.travel_time;
    return average_speed < speed ? (speed / average_speed) * travel_time : travel_time;
}
/**
 * Get the visit order of a breadth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param initial the id of the starting node. Default 0.
 * @returns A queue with the visited nodes in visiting order.
 */
function shortest_path(_a, initial, end) {
    var adj = _a.adj, edges = _a.edges, size = _a.size;
    var result = null; // nodes in the order they are being visited
    var parents = []; // Track parent nodes
    var pending = (0, queue_array_1.empty)(); // grey nodes to be processed
    var colour = (0, graphs_1.build_array)(size, function (_) { return graphs_1.white; });
    // visit a white node
    function bfs_visit(current, parent) {
        colour[current] = graphs_1.grey;
        parents[current] = parent;
        if (current === end) {
            result = (0, list_1.append)(parent, (0, list_1.list)(current));
        }
        else {
            (0, queue_array_1.enqueue)(current, pending);
        }
    }
    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial, null);
    var _loop_1 = function () {
        // dequeue the head node of the grey queue
        var current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        // Paint all white nodes adjacent to current node grey and enqueue them.
        var adjacent_white_nodes = (0, list_1.filter)(function (node) { return colour[node] === graphs_1.white; }, adj[current]);
        (0, list_1.for_each)(function (node) { return bfs_visit(node, (0, list_1.append)(parents[current], (0, list_1.list)(current))); }, adjacent_white_nodes);
        // paint current node black; the node is now done.
        colour[current] = graphs_1.black;
    };
    while (!(0, queue_array_1.is_empty)(pending)) {
        _loop_1();
    }
    return result;
}
function fastest_path(_a, initial, end) {
    var adj = _a.adj, edges = _a.edges, size = _a.size;
    var fastest_path_to_node = []; // nodes in the order they are being visited
    var pending = (0, queue_array_1.empty)(); // grey nodes to be processed
    var parents = []; // Track parent nodes
    var time_to_get_to_node = (0, graphs_1.build_array)(size, function (_) { return Infinity; });
    //let current_fastest_time = Infinity;
    // visit a white node
    function bfs_visit(current, parent, time) {
        if (time < time_to_get_to_node[current]) {
            parents[current] = parent;
            time_to_get_to_node[current] = time;
            if (current === end) {
                fastest_path_to_node[time] = (0, list_1.append)(parent, (0, list_1.list)(current));
            }
            (0, queue_array_1.enqueue)(current, pending);
        }
    }
    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial, null, 0);
    var _loop_2 = function () {
        // dequeue the head node of the grey queue
        var current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        console.log("Current node: " + current);
        var adjacent_white_nodes = adj[current];
        (0, list_1.for_each)(function (node) {
            var parent = parents[current];
            var previous_travel_time = 0;
            var travel_time = 0;
            previous_travel_time = time_to_get_to_node[current];
            travel_time = current_travel_time(edges[current][node]);
            console.log(current + "-" + node);
            bfs_visit(node, (0, list_1.append)(parent, (0, list_1.list)(current)), previous_travel_time + travel_time);
        }, adjacent_white_nodes);
    };
    while (!(0, queue_array_1.is_empty)(pending)) {
        _loop_2();
    }
    return [parents, time_to_get_to_node, fastest_path_to_node[time_to_get_to_node[end]]];
}
var t = fastest_path(_roads, 1, 5);
console.log(t[1]);
console.log(t[2]);
