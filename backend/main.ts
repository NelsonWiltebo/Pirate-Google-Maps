import { for_each, List, pair, head, tail, list, append, Pair, filter } from './lib/list';
import { empty, is_empty, enqueue, dequeue, head as qhead, display_queue } from './lib/queue_array';
import { build_array } from "./lib/graphs";

/**
 * An intersection, represented as an ID, i.e a number.
 */
type IntersectionID = number;

/**
 * {Road} represents an edge in the {RoadConnections} graph.
 * @param name the name of the road.
 * @param speed the speed limit (km/h) of the road.
 * @param travel_time the time (minutes) it takes to travel the entire road according to
 *  the speed limit.
 * @param average_speed the average speed (km/h) of cars on the road.
 */
export type Road = {
    connection: Pair<IntersectionID, IntersectionID>
    name: string,
    speed_limit: number,
    travel_time: number,
    average_speed: number,
    one_way: boolean
}

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
export function make_road(from: IntersectionID, to: IntersectionID, _name: string, _speed_limit: number, _travel_time: number, _average_speed: number, _one_way: boolean = false): Road {
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
export function road_going_from(road: Road): IntersectionID {
    return head(road.connection);
}

/**
 * Retrieves the ID of the intersection to which the road is going to.
 * @param road the road from which to get the destination intersection
 * @returns the ID of the intersection to which the road is going
 */
export function road_going_to(road: Road): IntersectionID {
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
        adj: [],
        edges: [[]],
        size: 0
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

    road_network.size = road_network.adj.length;
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
    initial: IntersectionID, end: IntersectionID): [Array<List<number>>, Array<number>, List<IntersectionID>] {
    const pending = empty<number>();  // nodes to be processed
    let parents: Array<List<number>> = []; // track parent nodes
    let time_to_get_to_node: Array<number> = build_array(size, _ => Infinity);
    let fastest_way: List<IntersectionID> = null;
    
    // visit an node
    function bfs_visit(current: number, parent: List<number>, time: number) {
        if (time < time_to_get_to_node[current]) {
            parents[current] = parent;
            time_to_get_to_node[current] = time;
            if(current === end) {
                fastest_way = append(parent, list(current));
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

        const adjacent_nodes = adj[current];

        for_each(node => {
            const parent: List<number> = parents[current];
            let previous_travel_time = 0;
            let travel_time = 0;
            previous_travel_time = time_to_get_to_node[current];
            travel_time = current_travel_time(edges[current][node]!);
            bfs_visit(node, append(parent, list(current)), previous_travel_time + travel_time);
        }, adjacent_nodes);
    }

    return [parents, time_to_get_to_node, fastest_way];
}
