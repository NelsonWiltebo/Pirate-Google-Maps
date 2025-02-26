let width = 600;
let height = 600;

const graph = [
  [1, 2],
  [0, 3, 5],
  [0, 3, 4],
  [1, 2],
  [2, 5],
  [1, 4]
];

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

let positions = [];

function draw_node(i, x, y, graph){
    fill(0);
    textAlign(CENTER,CENTER);
      
    fill(200);
    circle(x, y, round(200 / graph.length));
    text(i, x, y - 30);
    positions.push({x, y});
}

function draw_edge(from_node, to_node) {
  //
  stroke(0, 0, 0);
  let {from_x, from_y} = positions[from_node];
  let {to_x, to_y} = positions[to_node];
  line(from_x, from_y, to_x, to_y);
}

function draw_graph(graph) {
  let circle_x = width / 2;
  let circle_y = height / 2;

  let radius = 150;
  let totalNodes = graph.length;

  for (let i = 0; i < totalNodes; i++) {
    let angle = map(i,0,totalNodes,0,2*Math.PI)
    let x = circle_x + radius * Math.cos(angle);
    let y = circle_y + radius * Math.sin(angle);
    

    draw_node(i, x, y, graph);
  }
}

// 

function draw() {
  // put drawing code here
  background("grey");

  draw_graph(graph);
  draw_edge(0, 5);
}


// Scale the pos of node according to height of graph