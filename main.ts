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
    type Queue, empty, is_empty, enqueue, dequeue, head as qhead,
    display_queue
} from '../lib/queue_array';
import {
    black,
    build_array,
    grey,
    ListGraph,
    white
} from "../lib/graphs";

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
type RoadNetwork = {
    adj: Array<List<IntersectionID>>,
    edges: Array<Array<Road | undefined>>,
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
    average_speed: 0
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

const _roads: RoadNetwork = {
    adj: [
        list(1, 2, 5),
        list(0, 3, 5),
        list(0, 3, 4),
        list(1, 2),
        list(2, 5),
        list(1, 4)
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
}

function base_travel_time(road: Road): number {
    return road.travel_time;
}

function current_travel_time(road: Road): number {
    const average_speed: number = road.average_speed;
    const speed: number = road.speed;
    const travel_time: number = road.travel_time;

    return average_speed < speed ? (speed / average_speed) * travel_time : travel_time;
}

/**
 * Get the fastest path from one location (intersection) to another.
 * @param adj the network of intersections adjacent to each other.
 * @param edges the network of roads.
 * @param initial the id of the starting location (intersection).
 * @param end the id of the end location (intersection).
 * @returns A list with the intersections in the order of the fastest path.
 */
function fastest_path({ adj, edges, size }: RoadNetwork,
    initial: IntersectionID, end: IntersectionID): [Array<List<number>>, Array<number>, List<number>] {
    const fastest_path_to_node: Array<List<number>> = [];  // the fastest paths to each node
    const pending = empty<number>();  // nodes to be processed
    let parents: Array<List<number>> = []; // track parent nodes
    let time_to_get_to_node: Array<number> = build_array(size, _ => Infinity);
    
    // visit an node
    function bfs_visit(current: number, parent: List<number>, time: number) {
        if (time < time_to_get_to_node[current]) {
            parents[current] = parent;
            time_to_get_to_node[current] = time;
            if(current === end) {
                fastest_path_to_node[time] = append(parent, list(current));
            }
            enqueue(current, pending);
        }
    }

    // visit initial intersection, and set the time it took to get their to 0
    bfs_visit(initial, null, 0);

    while (!is_empty(pending)) {
        // dequeue the head node of the grey queue
        const current = qhead(pending);
        dequeue(pending);
        console.log("Current node: " + current);

        const adjacent_white_nodes = adj[current];

        for_each(node => {
            const parent: List<number> = parents[current];
            let previous_travel_time = 0;
            let travel_time = 0;
            previous_travel_time = time_to_get_to_node[current];
            travel_time = current_travel_time(edges[current][node]!);
            console.log(current + "-" + node);
            bfs_visit(node, append(parent, list(current)), previous_travel_time + travel_time);
        }, adjacent_white_nodes);
    }

    return [parents, time_to_get_to_node, fastest_path_to_node[time_to_get_to_node[end]]];
}

const t = fastest_path(_roads, 2, 5);

console.log(t[1]);
console.log(t[2]);