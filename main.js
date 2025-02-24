"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lg_shortest_path = lg_shortest_path;
var list_1 = require("../lib/list");
var queue_array_1 = require("../lib/queue_array");
var graphs_1 = require("../lib/graphs");
/**
 * Get the visit order of a breadth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param initial the id of the starting node. Default 0.
 * @returns A queue with the visited nodes in visiting order.
 */
function lg_shortest_path(_a, initial, end) {
    var adj = _a.adj, size = _a.size;
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
var roads = {
    adj: [
        (0, list_1.list)(1, 2),
        (0, list_1.list)(0, 3, 5),
        (0, list_1.list)(0, 3, 4),
        (0, list_1.list)(1, 2),
        (0, list_1.list)(2, 5),
        (0, list_1.list)(1, 4)
    ],
    size: 6
};
console.log(lg_shortest_path(roads, 0, 5));
