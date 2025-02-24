import {
    for_each, filter,
    List,
    pair,
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

type Intersection = number;

type Roads = {
    adj: Array<List<Intersection>>,
    size: number
};

type Road = { // Edge in a graph
    connection: Pair<Intersection, Intersection>
    name: string,
    speed: number,
    length: number,
    traffic: number // Amount of cars on the road
};

/**
 * Get the visit order of a breadth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param initial the id of the starting node. Default 0.
 * @returns A queue with the visited nodes in visiting order.
 */
export function shortest_path({ adj, size }: ListGraph,
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

const roads: Roads = {
    adj: [
        list(1, 2),
        list(0, 3, 5),
        list(0, 3, 4),
        list(1, 2),
        list(2, 5),
        list(1, 4)
    ],
    size: 6
}

console.log(shortest_path(roads, 0, 5));