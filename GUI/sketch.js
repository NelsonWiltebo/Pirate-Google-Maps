//import { lg_shortest_path } from "../main";
//import { shortest_path } from "../main";
// import { fastest_path, make_road, empty_road_network, add_road } from '../main'

let width = 600;
let height = 600;

// let positions = [];
let drawn_nodes = [];

// Implementation to have nodes with positions
function graph_node(connections = [], pos = []) {
    this.connections = connections;
    this.pos = pos;
}

// Maps position for each node according to each procentage for the c
function get_pos(px, py) {
  const margin = 0.02;
  const margin_x = px > 0.5 ? -margin : margin;
  const margin_y = py > 0.5 ? -margin : margin;
  return [width * (px + margin_x), height * (py + margin_y)];
}


const graph = [  // [[...connections], [x, y]]
  new graph_node([1, 2], get_pos(0.5, 0.1)),  //[1, 2],
  new graph_node([0, 3, 5], get_pos(0.1, 0.25)), // [0, 3, 5],
  new graph_node([0, 3, 4], get_pos(0.9, 0.25)), // [0, 3, 4],
  new graph_node([1, 2], get_pos(0.5, 0.5)), // [1, 2],
  new graph_node([2, 5], get_pos(0.9, 0.5)), // [2, 5],
  new graph_node([1, 4], get_pos(0.5, 0.9)) // [1, 4]
];

// const graph2 = [
//   [1, 2, 3],      // Node 0 is connected to Node 1, 2, 3
//   [0, 4, 5],      // Node 1 is connected to Node 0, 4, 5
//   [0, 6, 7],      // Node 2 is connected to Node 0, 6, 7
//   [0, 8, 9],      // Node 3 is connected to Node 0, 8, 9
//   [1, 10, 11],    // Node 4 is connected to Node 1, 10, 11
//   [1, 12],        // Node 5 is connected to Node 1, 12
//   [2, 13],        // Node 6 is connected to Node 2, 13
//   [2, 14],        // Node 7 is connected to Node 2, 14
//   [3, 15],        // Node 8 is connected to Node 3, 15
//   [3, 16],        // Node 9 is connected to Node 3, 16
//   [4, 17],        // Node 10 is connected to Node 4, 17
//   [4, 18],        // Node 11 is connected to Node 4, 18
//   [5, 19],        // Node 12 is connected to Node 5, 19
//   [6],            // Node 13 is connected to Node 6
//   [7],            // Node 14 is connected to Node 7
//   [8],            // Node 15 is connected to Node 8
//   [9],            // Node 16 is connected to Node 9
//   [10],           // Node 17 is connected to Node 10
//   [11],           // Node 18 is connected to Node 11
//   [12],           // Node 19 is connected to Node 12
// ];

const graph2 = [
  new graph_node([1, 2, 3], get_pos(0.5, 0.05)),      // Node 0 is connected to Node 1, 2, 3 (top level)
  new graph_node([0, 4, 5], get_pos(0.25, 0.2)),      // Node 1 is connected to Node 0, 4, 5 (left)
  new graph_node([0, 6, 7], get_pos(0.75, 0.2)),      // Node 2 is connected to Node 0, 6, 7 (right)
  new graph_node([0, 8, 9], get_pos(0.5, 0.35)),      // Node 3 is connected to Node 0, 8, 9 (below Node 0)
  new graph_node([1, 10, 11], get_pos(0.2, 0.5)),     // Node 4 is connected to Node 1, 10, 11 (left of Node 1)
  new graph_node([1, 12], get_pos(0.3, 0.6)),         // Node 5 is connected to Node 1, 12 (right of Node 4)
  new graph_node([2, 13], get_pos(0.7, 0.5)),         // Node 6 is connected to Node 2, 13 (left of Node 2)
  new graph_node([2, 14], get_pos(0.8, 0.6)),         // Node 7 is connected to Node 2, 14 (right of Node 6)
  new graph_node([3, 15], get_pos(0.25, 0.75)),       // Node 8 is connected to Node 3, 15 (left of Node 3)
  new graph_node([3, 16], get_pos(0.75, 0.75)),       // Node 9 is connected to Node 3, 16 (right of Node 8)
  new graph_node([4, 17], get_pos(0.15, 0.9)),        // Node 10 is connected to Node 4, 17 (left of Node 4)
  new graph_node([4, 18], get_pos(0.25, 0.9)),        // Node 11 is connected to Node 4, 18 (right of Node 10)
  new graph_node([5, 19], get_pos(0.35, 0.9)),        // Node 12 is connected to Node 5, 19 (right of Node 5)
  new graph_node([6], get_pos(0.7, 0.9)),             // Node 13 is connected to Node 6 (below Node 6)
  new graph_node([7], get_pos(0.8, 0.9)),             // Node 14 is connected to Node 7 (below Node 7)
  new graph_node([8], get_pos(0.25, 1.0)),            // Node 15 is connected to Node 8 (below Node 8)
  new graph_node([9], get_pos(0.75, 1.0)),            // Node 16 is connected to Node 9 (below Node 9)
  new graph_node([10], get_pos(0.1, 1.0)),            // Node 17 is connected to Node 10 (left of Node 10)
  new graph_node([11], get_pos(0.2, 1.0)),            // Node 18 is connected to Node 11 (right of Node 17)
  new graph_node([12], get_pos(0.3, 1.0))             // Node 19 is connected to Node 12 (right of Node 18)
];

const graph3 = [
  new graph_node([1, 2], get_pos(0.5, 0.05)),      // Node 0 is connected to Node 1, 2 (top level)
  new graph_node([0, 3, 4], get_pos(0.25, 0.2)),    // Node 1 is connected to Node 0, 3, 4 (left)
  new graph_node([0, 5, 6], get_pos(0.75, 0.2)),    // Node 2 is connected to Node 0, 5, 6 (right)
  new graph_node([1, 7], get_pos(0.15, 0.4)),       // Node 3 is connected to Node 1, 7 (left of Node 1)
  new graph_node([1, 8], get_pos(0.35, 0.4)),       // Node 4 is connected to Node 1, 8 (right of Node 3)
  new graph_node([2, 9], get_pos(0.65, 0.4)),       // Node 5 is connected to Node 2, 9 (left of Node 2)
  new graph_node([2, 10], get_pos(0.85, 0.4)),      // Node 6 is connected to Node 2, 10 (right of Node 5)
  new graph_node([3, 11], get_pos(0.1, 0.6)),       // Node 7 is connected to Node 3, 11 (below Node 3)
  new graph_node([3], get_pos(0.2, 0.6)),           // Node 8 is connected to Node 3 (right of Node 7)
  new graph_node([4], get_pos(0.3, 0.6)),           // Node 9 is connected to Node 4 (right of Node 8)
  new graph_node([5], get_pos(0.6, 0.6)),           // Node 10 is connected to Node 5 (left of Node 10)
  new graph_node([6], get_pos(0.8, 0.6))            // Node 11 is connected to Node 6 (right of Node 10)
];



function setup() {
  createCanvas(width, height);
}

function draw_node(i, x, y, graph){
    fill(0);
    stroke(0, 0, 0, 0);
    textAlign(CENTER,CENTER);
    textSize(20);
    fill(0);
    // circle(x, y, round();
    fill(255);
    text(i, x, y-20);
    drawn_nodes.push(graph[i]);
}

function draw_edge(from_node, to_node, color="black") {
  stroke(color);
  strokeWeight(6);
  const pos_from = from_node.pos;
  const pos_to = to_node.pos;
  line(pos_from[0], pos_from[1], pos_to[0], pos_to[1]);
}


function draw_graph(graph) {
  let total_nodes = graph.length;
  let radius = 30 * total_nodes / 3;
  radius = Math.max(radius, 120);

  for (let i = 0; i < total_nodes; i++) {
    const pos = graph[i].pos;
    const x = pos[0];
    const y = pos[1];
    
    draw_node(i, x, y, graph);
  }
}

function draw_graph_edges(graph, shortest_path = []) {
  let total_nodes = graph.length;

  for (let i = 0; i < total_nodes; i++) {
    let child_nodes = graph[i].connections.length;
    for (let j = 0; j < child_nodes; j++) {
      if (shortest_path.includes(i) && shortest_path.includes(graph[i].connections[j])) {
        draw_edge(graph[i], graph[graph[i].connections[j]], "lime");
      }
      else {
        draw_edge(graph[i], graph[graph[i].connections[j]], "black");
      }
    }
  }
}


function draw() {
  background("grey");

  // const path = fastest_path(_roads0, 0, 5)[2];
  const path = [0, 1, 4, 8];

  draw_graph_edges(graph3, path);
  draw_graph(graph3);

  // draw_shortest_path(graph, path);
}


// Scale the pos of node according to height of graph