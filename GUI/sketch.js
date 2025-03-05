//import { lg_shortest_path } from "../main";
//import { shortest_path } from "../main";
// import { fastest_path, make_road, empty_road_network, add_road } from '../main'

let width = 600;
let height = 600;
let positions = [];

// Implementation to have nodes with positions
function graph_node(connections = [], pos = []) {
    this.connections = connections;
    this.pos = pos;
}

const graph = [  // [[...connections], [x, y]]
  graph_node([1, 2], [50, 50]),  //[1, 2],
  graph_node([0, 3, 5], [100, 50]), // [0, 3, 5],
  graph_node([0, 3, 4], [50, 100]), // [0, 3, 4],
  graph_node([1, 2], [150, 50]), // [1, 2],
  graph_node([2, 5], [100, 150]), // [2, 5],
  graph_node([1, 4], [150, 150]) // [1, 4]
];

// const road_0_1 = make_road(0, 1, "0-1", 80, 60, 70);
// const road_0_2 = make_road(0, 2, "0-2", 80, 60, 70);
// const road_1_3 = make_road(1, 3, "1-3", 80, 60, 70);
// const road_1_5 = make_road(1, 5, "1-5", 80, 60, 70);
// const road_2_3 = make_road(2, 3, "2-3", 80, 60, 70);
// const road_2_4 = make_road(2, 4, "2-4", 80, 60, 70);
// const road_4_5 = make_road(4, 5, "2-4", 80, 60, 70);

// const _roads0 = empty_road_network();
// add_road(_roads0, road_0_1);
// add_road(_roads0, road_0_2);
// add_road(_roads0, road_1_3);
// add_road(_roads0, road_1_5);
// add_road(_roads0, road_2_3);
// add_road(_roads0, road_2_4);
// add_road(_roads0, road_4_5);

const graph2 = [
  [1, 2, 3],      // Node 0 is connected to Node 1, 2, 3
  [0, 4, 5],      // Node 1 is connected to Node 0, 4, 5
  [0, 6, 7],      // Node 2 is connected to Node 0, 6, 7
  [0, 8, 9],      // Node 3 is connected to Node 0, 8, 9
  [1, 10, 11],    // Node 4 is connected to Node 1, 10, 11
  [1, 12],        // Node 5 is connected to Node 1, 12
  [2, 13],        // Node 6 is connected to Node 2, 13
  [2, 14],        // Node 7 is connected to Node 2, 14
  [3, 15],        // Node 8 is connected to Node 3, 15
  [3, 16],        // Node 9 is connected to Node 3, 16
  [4, 17],        // Node 10 is connected to Node 4, 17
  [4, 18],        // Node 11 is connected to Node 4, 18
  [5, 19],        // Node 12 is connected to Node 5, 19
  [6],            // Node 13 is connected to Node 6
  [7],            // Node 14 is connected to Node 7
  [8],            // Node 15 is connected to Node 8
  [9],            // Node 16 is connected to Node 9
  [10],           // Node 17 is connected to Node 10
  [11],           // Node 18 is connected to Node 11
  [12],           // Node 19 is connected to Node 12
];

function setup() {
  // put setup code here
  createCanvas(width, height);
}

function draw_node(i, x, y, graph){
    fill(0);
    stroke(0, 0, 0, 0);
    textAlign(CENTER,CENTER);
    textSize(20);
      
    fill(255);

    let radius = 100 / graph.length;
    radius = Math.max(radius, 30);
    circle(x, y, round(radius));
    fill(0);
    text(i, x, y);
    positions.push([x, y]);
}

function draw_edge(from_node, to_node, color="black") {
  //
  stroke(color);
  const pos_from = positions[from_node];
  const pos_to = positions[to_node];
  line(pos_from[0], pos_from[1], pos_to[0], pos_to[1]);
  //line(100, 100, 400, 400);
}

// TODO: adapt functions for objects

function draw_graph(graph) {
  let circle_x = width / 2;
  let circle_y = height / 2;

  let total_nodes = graph.length;
  let radius = 30 * total_nodes / 3;
  radius = Math.max(radius, 120);

  for (let i = 0; i < total_nodes; i++) {

    // Circle
    /*
    let angle = map(i,0,total_nodes,0,2*Math.PI)
    let x = circle_x + radius * Math.cos(angle);
    let y = circle_y + radius * Math.sin(angle);
    */
    const pos = graph[0].pos;
    const x = pos[0];
    const y = pos[1];
    
    draw_node(i, x, y, graph);

  }
}


function draw_graph_edges(graph){
  // loopa igenom grafen
  
  // för varje index i graph
    // för varje child node i index
      // rita edge
  

  let total_nodes = graph.length;

  for (let i = 0; i < total_nodes; i++) {
    let child_nodes = graph[i].connections.length;
    for (let j = 0; j < child_nodes; j++) {
      draw_edge(i, graph[i][j]);
    }
  }
}

// rita kortast väg

function draw_shortest_path(graph, path){

  
  for (let i = 0; i < path.length; i++) {
    if (i > 0) {
      draw_edge(path[i - 1], path[i], "red");
    }
  }
}

function draw() {
  // put drawing code here
  background("grey");

  draw_graph(graph);
  draw_graph_edges(graph);

  // const path = fastest_path(_roads0, 0, 5)[2];
  const path = [0, 2, 4];
  console.log(path);

  draw_shortest_path(graph, path);
}


// Scale the pos of node according to height of graph