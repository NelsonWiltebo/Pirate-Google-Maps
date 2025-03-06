import { for_each, List, pair, head, tail, list, append, Pair, filter } from './lib/list';
import { empty, is_empty, enqueue, dequeue, head as qhead, display_queue } from './lib/queue_array';
import { build_array } from "../lib/graphs";

type Position = {
    x: number,
    y: number
}

type IntersectionID = number;

/**
 * An intersection.
 * @param id the id of the intersection
 * @param pos the x and y coordinates of the intersection
 */
export type Intersection = {
    id: IntersectionID,
    pos: Position
};

/**
 * {Road} represents an edge in the {RoadConnections} graph.
 * @param name the name of the road.
 * @param speed the speed limit (km/h) of the road.
 * @param travel_time the time (minutes) it takes to travel the entire road according to
 *  the speed limit.
 * @param average_speed the average speed (km/h) of cars on the road.
 */
export type Road = {
    connection: Pair<Intersection, Intersection>
    name: string,
    speed_limit: number,
    travel_time: number,
    average_speed: number,
    one_way: boolean
}

/**
 * A path from one intersection to another.
 * @param path the path between the two intersections
 * @param time the time it will take to travel the path
 */
export type Path = {
    path: Array<IntersectionID>,
    time: number
}

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
export function make_road(from: Intersection, to: Intersection, _name: string, _speed_limit: number, _travel_time: number, _average_speed: number, _one_way: boolean = false): Road {
    return {
        connection: pair(from, to),
        name: _name,
        speed_limit: _speed_limit,
        travel_time: _travel_time,
        average_speed: _average_speed,
        one_way: _one_way
    }
}

/**
 * Retrieves the name of the road.
 * @param road the road from which to get the name
 * @returns the name of the road
 */
export function road_name(road: Road): string {
    return road.name;
}

/**
 * Retrieves the speed limit of the road.
 * @param road the road from which to get the speed limit
 * @returns the speed limit of the road
 */
export function road_speed_limit(road: Road): number {
    return road.speed_limit;
}

/**
 * Retrieves the ID of the intersection from which the road is going from.
 * @param road the road from which to get the starting intersection
 * @returns the ID of the intersection from which the road is going
 */
export function road_going_from(road: Road): Intersection {
    return head(road.connection);
}

/**
 * Retrieves the ID of the intersection to which the road is going to.
 * @param road the road from which to get the destination intersection
 * @returns the ID of the intersection to which the road is going
 */
export function road_going_to(road: Road): Intersection {
    return tail(road.connection);
}

/**
 * Retrieves if the road is one way traffic.
 * @param road the road from which to check
 * @returns the if the road is one way traffic or not
 */
export function is_one_way(road: Road): boolean {
    return road.one_way;
}

/**
 * Retrieves the base travel time for the road according to the speed limit.
 * @param road the road from which to get the base travel time
 * @returns the base travel time of the road
 */
export function base_travel_time(road: Road): number {
    return road.travel_time;
}

/**
 * Retrieves the time it takes the travel the road according to the amount of 
 *  traffic on the road, and the speed limit.
 * @param road the road to get the current travel time of
 * @returns the time it takes to travel the road
 */
export function current_travel_time(road: Road): number {
    const average_speed: number = road.average_speed;
    const speed: number = road_speed_limit(road);
    const travel_time: number = base_travel_time(road);

    return average_speed < speed ? (speed / average_speed) * travel_time : travel_time;
}

/**
 * All intersections and roads.
 * @param adj every intersection and their corresponding adjacent intersections
 * @param edges every road, found by the indexes of the array and nested array,
 *  specified as the ID of the intersections connected by the road.
 * @param size the amount of intersections.
 */
export type RoadNetwork = {
    intersections: Array<Intersection>,
    adj: Array<List<IntersectionID>>,
    edges: Array<Array<Road | undefined>>,
    size: number
}

/**
 * Creates an empty road network.
 * @returns an empty road network
 */
export function empty_road_network(): RoadNetwork {
    return {
        intersections: [],
        adj: [],
        edges: [[]],
        size: 0
    }
}

/**
 * Makes an intersection with a specified position.
 * @param x the x coordinate for the intersection
 * @param y the y coordinate for the intersection
 * @returns an intersection with the specified position and id.
*/
export function make_intersection(_id: IntersectionID, x: number, y: number) {
    return {
        id: _id,
        pos: {x, y}
    }
}

/**
 * Adds an intersection to a road-network.
 * @precondition intersection.id <= road_network.size
 * @param road_network the road network to add the intersection to
 * @param intersection the intersection to be added
 */
export function add_intersection(road_network: RoadNetwork, intersection: Intersection): void {
    const intersection_id: number = intersection.id;
    if(intersection_id > road_network.size + 1) {
        console.log("Intersection id is out of the range of the size of the road-network");
    } else if(road_network.intersections[intersection_id] === undefined) {
        road_network.intersections[intersection_id] = intersection;
        road_network.size++;
    } else {
        console.log("Intersection " + intersection_id + " already exists.")
    }
}

/**
 * Adds a road to a road network.
 * @param road_network the road network to add the road to
 * @param road the road to be added
 */
export function add_road(road_network: RoadNetwork, road: Road): void {
    const going_from: IntersectionID = road_going_from(road);
    const going_to: IntersectionID = road_going_to(road);
    if(road_network.intersections[going_from] !== undefined
            || road_network.intersections[going_to] !== undefined) {
        
        const adj = road_network.adj;

        if(adj[going_from] === undefined) {
            road_network.adj[going_from] = null;
            road_network.edges[going_from] = [];
        } else { }
        road_network.adj[going_from] = pair(going_to, adj[going_from]);
        
        if(!is_one_way(road)) {
            if(adj[going_to] === undefined) {
                road_network.adj[going_to] = null;
                road_network.edges[going_to] = [];
            } else { }
            road_network.adj[going_to] = pair(going_from, adj[going_to]);
            road_network.edges[going_to][going_from] = road;
        } else { }
    
        road_network.edges[going_from][going_to] = road;
    } else {
        console.log("The intersections the road is either going from or to doesn't exist");
    }
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
export function fastest_path({ adj, edges, size }: RoadNetwork,
    initial: IntersectionID, end: IntersectionID): Path {
    const pending = empty<number>();  // nodes to be processed
    let parents: Array<Array<number>> = Array(size).fill(null); // track parent nodes
    let time_to_get_to_node: Array<number> = Array(size).fill(Infinity);
    let fastest_way: Array<number> = [];
    let fastest_time: number = 0;
    
    // visit a node
    function bfs_visit(current: number, parent: Array<number>, time: number) {
        if (time < time_to_get_to_node[current]) {
            parents[current] = parent;
            time_to_get_to_node[current] = time;
            if (current === end) {
                fastest_way = [...parent, current];
                fastest_time = time;
            }
            enqueue(current, pending);
        }
    }

    // visit initial intersection, and set the time it took to get there to 0
    bfs_visit(initial, [], 0);

    while (!is_empty(pending)) {
        // dequeue the head node of the queue
        const current = qhead(pending);
        dequeue(pending);

        const adjacent_nodes = adj[current];

        for_each(node => {
            const parent: Array<number> = parents[current] || [];
            let previous_travel_time = time_to_get_to_node[current];
            let travel_time = current_travel_time(edges[current][node]!);
            bfs_visit(node, [...parent, current], previous_travel_time + travel_time);
        }, adjacent_nodes);
    }

    return { path: fastest_way, time: fastest_time };
}