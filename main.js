"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.make_road = make_road;
exports.empty_road_network = empty_road_network;
exports.add_road = add_road;
exports.fastest_path = fastest_path;
var list_1 = require("../lib/list");
var queue_array_1 = require("../lib/queue_array");
var graphs_1 = require("../lib/graphs");
/**
 * Creates a road according to the following properties.
 * @param from the ID of the intersection that the road is going from
 * @param to the ID of the intersection that the road is going to
 * @param _name the name of the road
 * @param _speed_limit the speed limit on the road
 * @param _travel_time the time it takes to travel the road according to the
 *  speed limit
 * @param _average_speed the average speed of the vechiles on the road
 * @returns the road with the specified properties
 */
function make_road(from, to, _name, _speed_limit, _travel_time, _average_speed, _one_way) {
    if (_one_way === void 0) { _one_way = false; }
    return {
        connection: (0, list_1.pair)(from, to),
        name: _name,
        speed_limit: _speed_limit,
        travel_time: _travel_time,
        average_speed: _average_speed,
        one_way: _one_way
    };
}
/**
 * Retrieves the name of the road.
 * @param road the road from which to get the name
 * @returns the name of the road
 */
function road_name(road) {
    return road.name;
}
/**
 * Retrieves the speed limit of the road.
 * @param road the road from which to get the speed limit
 * @returns the speed limit of the road
 */
function road_speed_limit(road) {
    return road.speed_limit;
}
/**
 * Retrieves the ID of the intersection from which the road is going from.
 * @param road the road from which to get the starting intersection
 * @returns the ID of the intersection from which the road is going
 */
function road_going_from(road) {
    return (0, list_1.head)(road.connection);
}
/**
 * Retrieves the ID of the intersection to which the road is going to.
 * @param road the road from which to get the destination intersection
 * @returns the ID of the intersection to which the road is going
 */
function road_going_to(road) {
    return (0, list_1.tail)(road.connection);
}
/**
 * Retrieves if the road is one way traffic.
 * @param road the road from which to check
 * @returns the if the road is one way traffic or not
 */
function is_one_way(road) {
    return road.one_way;
}
/**
 * Retrieves the base travel time for the road according to the speed limit.
 * @param road the road from which to get the base travel time
 * @returns the base travel time of the road
 */
function base_travel_time(road) {
    return road.travel_time;
}
/**
 * Retrieves the time it takes the travel the road according to the amount of
 *  traffic on the road, and the speed limit.
 * @param road the road to get the current travel time of
 * @returns the time it takes to travel the road
 */
function current_travel_time(road) {
    var average_speed = road.average_speed;
    var speed = road.speed_limit;
    var travel_time = road.travel_time;
    return average_speed < speed ? (speed / average_speed) * travel_time : travel_time;
}
/**
 * Creates an empty road network.
 * @returns an empty road network
 */
function empty_road_network() {
    return {
        adj: [],
        edges: [[]],
        size: 0
    };
}
/**
 * Adds a road to a road network.
 * @param road_network the road network to add the road to
 * @param road the road to be added
 */
function add_road(road_network, road) {
    var going_from = road_going_from(road);
    var going_to = road_going_to(road);
    var adj = road_network.adj;
    if (adj[going_from] === undefined) {
        road_network.adj[going_from] = null;
        road_network.edges[going_from] = [];
    }
    else { }
    road_network.adj[going_from] = (0, list_1.pair)(going_to, adj[going_from]);
    if (!is_one_way(road)) {
        if (adj[going_to] === undefined) {
            road_network.adj[going_to] = null;
            road_network.edges[going_to] = [];
        }
        else { }
        road_network.adj[going_to] = (0, list_1.pair)(going_from, adj[going_to]);
        road_network.edges[going_to][going_from] = road;
    }
    else { }
    road_network.edges[going_from][going_to] = road;
    road_network.size = road_network.adj.length;
}
/**
 * Get the fastest path from one location (intersection) to another.
 * @param adj the network of intersections adjacent to each other.
 * @param edges the network of roads.
 * @param initial the id of the starting location (intersection).
 * @param end the id of the end location (intersection).
 * @returns A list with the intersections in the order of the fastest path.
 */
function fastest_path(_a, initial, end) {
    var adj = _a.adj, edges = _a.edges, size = _a.size;
    var pending = (0, queue_array_1.empty)(); // nodes to be processed
    var parents = []; // track parent nodes
    var time_to_get_to_node = (0, graphs_1.build_array)(size, function (_) { return Infinity; });
    var fastest_way = null;
    // visit an node
    function bfs_visit(current, parent, time) {
        if (time < time_to_get_to_node[current]) {
            parents[current] = parent;
            time_to_get_to_node[current] = time;
            if (current === end) {
                fastest_way = (0, list_1.append)(parent, (0, list_1.list)(current));
            }
            (0, queue_array_1.enqueue)(current, pending);
        }
    }
    // visit initial intersection, and set the time it took to get their to 0
    bfs_visit(initial, null, 0);
    var _loop_1 = function () {
        // dequeue the head node of the grey queue
        var current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        var adjacent_nodes = adj[current];
        (0, list_1.for_each)(function (node) {
            var parent = parents[current];
            var previous_travel_time = 0;
            var travel_time = 0;
            previous_travel_time = time_to_get_to_node[current];
            travel_time = current_travel_time(edges[current][node]);
            bfs_visit(node, (0, list_1.append)(parent, (0, list_1.list)(current)), previous_travel_time + travel_time);
        }, adjacent_nodes);
    };
    while (!(0, queue_array_1.is_empty)(pending)) {
        _loop_1();
    }
    return [parents, time_to_get_to_node, fastest_way];
}
// const road_0_1: Road = make_road(0, 1, "0-1", 80, 60, 70);
// const road_0_2: Road = make_road(0, 2, "0-2", 80, 30, 80);
// const road_0_5: Road = make_road(0, 5, "0-5", 120, 150, 40);
// const road_1_3: Road = make_road(1, 3, "1-3", 70, 20, 50);
// const road_1_5: Road = make_road(1, 5, "1-5", 100, 120, 0);
// const road_2_3: Road = make_road(2, 3, "2-3", 50, 10, 40, true);
// const road_2_4: Road = make_road(2, 4, "2-4", 80, 50, 80);
// const road_4_5: Road = make_road(4, 5, "4-5", 80, 45, 80);
// const _roads0: RoadNetwork = empty_road_network();
// add_road(_roads0, road_0_1);
// add_road(_roads0, road_0_2);
// add_road(_roads0, road_0_5);
// add_road(_roads0, road_1_3);
// add_road(_roads0, road_1_5);
// add_road(_roads0, road_2_3);
// add_road(_roads0, road_2_4);
// add_road(_roads0, road_4_5);
// //console.log(_roads0.adj);
// const t1 = fastest_path(_roads0, 3, 2);
// console.log(t1[2]);
var road_0_1 = make_road(0, 1, "0-1", 80, 60, 70);
var road_0_2 = make_road(0, 2, "0-2", 80, 30, 80);
var road_network_test = empty_road_network();
add_road(road_network_test, road_0_1);
add_road(road_network_test, road_0_2);
console.dir(road_network_test, { depth: null });
