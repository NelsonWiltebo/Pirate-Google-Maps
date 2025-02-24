import {
    for_each, filter,
    List,
    pair,
    head,
    tail,
    list,
    append,
    Pair
} from '../lib/list';

import {
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead
} from '../lib/queue_array';
import {
    black,
    build_array,
    grey,
    ListGraph,
    white
} from "../lib/graphs";
import { ProbingHashtable, ph_insert, ph_delete, ph_empty, ph_lookup, ph_keys, hash_id } from '../lib/hashtables';

/**
 * An intersection, represented as an ID, i.e a number.
 */
type IntersectionID = number;

/**
 * All intersections adjacent to the intersection specified by the index in 
 *  {RoadConnections}, and the roads respective properties.
 * @param adj all adjacent intersections.
 * @param road_properties the index specifies the intersection the road is led to.
 */
type IntersectionRoads = {
    adj: List<IntersectionID>
    road_properties: Array<Road | undefined>
}

/**
 * All intersections and roads.
 * @param roads the roads and intersection.
 * @size the amount of intersections.
 */
type Roads = {
    roads: Array<IntersectionRoads>,
    size: number
}

/**
 * {Road} represents an edge in the {RoadConnections} graph.
 * @param name the name of the road.
 * @param speed the speed limit (km/h) of the road.
 * @param travel_time the time (minutes) it takes to traverse the entire road according to
 *  the speed limit.
 * @param average_speed the average speed (km/h) of cars on the road.
 */
type Road = {
    connection: Pair<IntersectionID, IntersectionID>
    name: string,
    speed: number,
    travel_time: number,
    average_speed: number
};

const road_0_1 = {
    connection: pair(0, 1),
    name: "0-1",
    speed: 80,
    travel_time: 60,
    average_speed: 70
}
const road_0_2 = {
    connection: pair(0, 2),
    name: "0-2",
    speed: 80,
    travel_time: 30,
    average_speed: 80
}
const road_0_5 = {
    connection: pair(0, 5),
    name: "0-5",
    speed: 120,
    travel_time: 150,
    average_speed: 40
}
const road_1_3 = {
    connection: pair(1, 3),
    name: "1-3",
    speed: 70,
    travel_time: 20,
    average_speed: 50
}
const road_1_5 = {
    connection: pair(1, 5),
    name: "1-5",
    speed: 100,
    travel_time: 120,
    average_speed: 90
}
const road_2_3 = {
    connection: pair(2, 3),
    name: "2-3",
    speed: 50,
    travel_time: 10,
    average_speed: 40
}
const road_2_4 = {
    connection: pair(2, 4),
    name: "2-4",
    speed: 80,
    travel_time: 50,
    average_speed: 80
}
const road_4_5 = {
    connection: pair(0, 1),
    name: "4-5",
    speed: 80,
    travel_time: 45,
    average_speed: 80
}

const road_connections: Array<Road> = [];

const roads: Roads = {
    roads: [
        { // Index 0
            adj: list(1, 2, 5),
            road_properties: [
                undefined,
                road_0_1,
                road_0_2,
                undefined,
                undefined,
                road_0_5
            ]
        },
        { // Index 1
            adj: list(0, 3, 5),
            road_properties: [
                undefined,
                undefined,
                undefined,
                road_1_3,
                undefined,
                road_1_5
            ]
        },
        { // Index 2
            adj: list(0, 3, 4),
            road_properties: [
                undefined,
                undefined,
                undefined,
                road_2_3,
                road_2_4,
                undefined
            ]
        },
        { // Index 3
            adj: list(1, 2),
            road_properties: [
                undefined,
                road_1_3,
                road_2_3,
                undefined,
                undefined,
                undefined
            ]
        },
        { // Index 4
            adj: list(2, 5),
            road_properties: [
                undefined,
                undefined,
                road_2_4,
                undefined,
                undefined,
                road_4_5
            ]
        },
        { // Index 5
            adj: list(1, 4),
            road_properties: [
                undefined,
                road_1_5,
                undefined,
                undefined,
                road_4_5,
                undefined
            ]
        },
    ],
    size: 6
};

function base_travel_time(road: Road): number {
    return road.travel_time;
}

function current_travel_time(road: Road): number {
    const average_speed: number = road.average_speed;
    const speed: number = road.speed;
    const travel_time: number = road.travel_time;

    return average_speed < speed ? (average_speed / speed) * travel_time : travel_time;
}

/**
 * Get the visit order of a breadth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param initial the id of the starting node. Default 0.
 * @returns A queue with the visited nodes in visiting order.
 */
function shortest_path({ adj, size }: ListGraph,
    initial: number, end: number): List<number> {
    let result: List<number> | null = null;  // nodes in the order they are being visited
    let parents: Array<List<number>> = []; // Track parent nodes
    const pending = empty<number>();  // grey nodes to be processed
    const colour = build_array(size, _ => white);

    // visit a white node
    function bfs_visit(current: number, parent: List<number>) {
        colour[current] = grey;
        parents[current] = parent;
        if (current === end) {
            result = append(parent, list(current))
        } else {
            enqueue(current, pending);
        }
    }

    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial, null);

    while (!is_empty(pending)) {
        // dequeue the head node of the grey queue
        const current = qhead(pending);
        dequeue(pending);

        // Paint all white nodes adjacent to current node grey and enqueue them.
        const adjacent_white_nodes = filter(node => colour[node] === white,
            adj[current]);
        for_each(node => bfs_visit(node, append(parents[current], list(current))), adjacent_white_nodes);

        // paint current node black; the node is now done.
        colour[current] = black;
    }

    return result;
}

function fastest_path({ adj, size }: ListGraph,
    initial: number = 0): Queue<number> {
    const result = empty<number>();  // nodes in the order they are being visited
    const pending = empty<number>();  // grey nodes to be processed
    const colour = build_array(size, _ => white);
    let current_fastest_time = Infinity;

    // visit a white node
    function bfs_visit(current: number) {
        colour[current] = grey;
        enqueue(current, result);
        enqueue(current, pending);
    }

    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial);

    while (!is_empty(pending)) {
        // dequeue the head node of the grey queue
        const current = qhead(pending);
        dequeue(pending);

        // Paint all white nodes adjacent to current node grey and enqueue them.
        const adjacent_white_nodes = filter(node => colour[node] === white,
            adj[current]);
        for_each(bfs_visit, adjacent_white_nodes);

        // paint current node black; the node is now done.
        colour[current] = black;
    }

    return result;
}

//console.log(shortest_path(roads, 0, 5));