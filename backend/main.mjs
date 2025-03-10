"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { for_each, pair, head, tail } from '../lib/list.mjs';
import { empty, is_empty, enqueue, dequeue, head as qhead } from '../lib/queue_array.mjs';
/**
 * Creates a road according to the following properties.
 * @param from the intersection that the road is going from
 * @param to the intersection that the road is going to
 * @param _name the name of the road
 * @param _speed_limit the speed limit on the road
 * @param _travel_time the time it takes to travel the road according to the
 *  speed limit
 * @param _average_speed the average speed of the vechiles on the road
 * @returns the road with the specified properties
 */
export function make_road(from, to, _name, _speed_limit, _travel_time, _average_speed, _one_way) {
    if (_one_way === void 0) { _one_way = false; }
    return {
        connection: pair(from, to),
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
export function road_name(road) {
    return road.name;
}
/**
 * Retrieves the speed limit of the road.
 * @param road the road from which to get the speed limit
 * @returns the speed limit of the road
 */
export function road_speed_limit(road) {
    return road.speed_limit;
}
/**
 * Retrieves the ID of the intersection from which the road is going from.
 * @param road the road from which to get the starting intersection
 * @returns the ID of the intersection from which the road is going
 */
export function road_going_from(road) {
    return head(road.connection);
}
/**
 * Retrieves the ID of the intersection to which the road is going to.
 * @param road the road from which to get the destination intersection
 * @returns the ID of the intersection to which the road is going
 */
export function road_going_to(road) {
    return tail(road.connection);
}
/**
 * Retrieves if the road is one way traffic.
 * @param road the road from which to check
 * @returns the if the road is one way traffic or not
 */
export function is_one_way(road) {
    return road.one_way;
}
/**
 * Retrieves the base travel time for the road according to the speed limit.
 * @param road the road from which to get the base travel time
 * @returns the base travel time of the road
 */
export function base_travel_time(road) {
    return road.travel_time;
}
/**
 * Retrieves the time it takes the travel the road according to the amount of
 *  traffic on the road, and the speed limit.
 * @param road the road to get the current travel time of
 * @returns the time it takes to travel the road
 */
export function current_travel_time(road) {
    var average_speed = road.average_speed;
    var speed = road_speed_limit(road);
    var travel_time = base_travel_time(road);
    return average_speed < speed ? (speed / average_speed) * travel_time : travel_time;
}
/**
 * Creates an empty road network.
 * @returns an empty road network
 */
export function empty_road_network() {
    return {
        intersections: [],
        adj: [],
        edges: [[]],
        size: 0
    };
}
/**
 * Makes an intersection with a specified position.
 * @param x the x coordinate for the intersection
 * @param y the y coordinate for the intersection
 * @returns an intersection with the specified position and id.
*/
export function make_intersection(_id, x, y) {
    return {
        id: _id,
        pos: { x: x, y: y }
    };
}
/**
 * Adds an intersection to a road-network.
 * @precondition intersection.id <= road_network.size
 * @param road_network the road network to add the intersection to
 * @param intersection the intersection to be added
 */
export function add_intersection(road_network, intersection) {
    var intersection_id = intersection.id;
    if (intersection_id > road_network.size + 1) {
        console.log("Intersection id is out of the range of the size of the road-network");
    }
    else if (road_network.intersections[intersection_id] === undefined) {
        road_network.intersections[intersection_id] = intersection;
        road_network.size++;
    }
    else {
        console.log("Intersection " + intersection_id + " already exists.");
    }
}
/**
 * Adds a road to a road network.
 * @param road_network the road network to add the road to
 * @param road the road to be added
 */
export function add_road(road_network, road) {
    var going_from = road_going_from(road);
    var going_to = road_going_to(road);
    if (road_network.intersections[going_from] !== undefined
        || road_network.intersections[going_to] !== undefined) {
        var adj = road_network.adj;
        if (adj[going_from] === undefined) {
            road_network.adj[going_from] = null;
            road_network.edges[going_from] = [];
        }
        else { }
        road_network.adj[going_from] = pair(going_to, adj[going_from]);
        if (!is_one_way(road)) {
            if (adj[going_to] === undefined) {
                road_network.adj[going_to] = null;
                road_network.edges[going_to] = [];
            }
            else { }
            road_network.adj[going_to] = pair(going_from, adj[going_to]);
            road_network.edges[going_to][going_from] = road;
        }
        else { }
        road_network.edges[going_from][going_to] = road;
    }
    else {
        console.log("The intersections the road is either going from or to doesn't exist");
    }
}
function array_fill(size, value) {
    var arr = [];
    for (var i = 0; i < size; i++) {
        arr[i] = value;
    }
    return arr;
}
/**
 * Get the fastest path from one location (intersection) to another.
 * @param adj the network of intersections adjacent to each other
 * @param edges the network of roads
 * @param initial the id of the starting location (intersection)
 * @param end the id of the end location (intersection)
 * @returns a list with the intersections in the order of the fastest path
 * @see lg_bfs_visit_order the original function this was based on (in './lib/graphs.ts')
 */
export function fastest_path(_a, initial, end) {
    var adj = _a.adj, edges = _a.edges, size = _a.size;
    var pending = empty(); // nodes to be processed
    var parents = array_fill(size, null);
    var time_to_get_to_node = array_fill(size, Infinity);
    var fastest_way = [];
    var fastest_time = 0;
    // visit a node
    function visit(current, parent, time) {
        if (time < time_to_get_to_node[current]) { // Checking if the new travel time is faster
            parents[current] = parent;
            time_to_get_to_node[current] = time; // Storing the time to reach the node
            if (current === end) {
                fastest_way = __spreadArray(__spreadArray([], parent, true), [current], false);
                fastest_time = time;
            }
            else {
                enqueue(current, pending);
            }
        }
    }
    // visit initial intersection, and set the time it took to get there to 0
    visit(initial, [], 0);
    var _loop_1 = function () {
        // dequeue the head node of the queue
        var current = qhead(pending);
        dequeue(pending);
        var adjacent_nodes = adj[current];
        for_each(function (node) {
            var parent = parents[current] || [];
            var previous_travel_time = time_to_get_to_node[current];
            var travel_time = current_travel_time(edges[current][node]);
            visit(node, __spreadArray(__spreadArray([], parent, true), [current], false), previous_travel_time + travel_time);
        }, adjacent_nodes);
    };
    while (!is_empty(pending)) {
        _loop_1();
    }
    return { path: fastest_way, time: fastest_time };
}
