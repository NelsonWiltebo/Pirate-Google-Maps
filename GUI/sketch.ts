//import { lg_shortest_path } from "../main";
//import { shortest_path } from "../main";
//import "../lib/"
import { fastest_path, make_road, empty_road_network, add_road } from '../main'
//import P5 from "p5";
import * as P5 from "p5";
import "./stylesheet.scss";

const width = 600;
const height = 600;

/*const graph = [
  [1, 2],
  [0, 3, 5],
  [0, 3, 4],
  [1, 2],W
  [2, 5],
  [1, 4]
];*/

const road_0_1 = make_road(0, 1, "0-1", 80, 60, 70);
const road_0_2 = make_road(0, 2, "0-2", 80, 60, 70);
const road_1_3 = make_road(1, 3, "1-3", 80, 60, 70);
const road_1_5 = make_road(1, 5, "1-5", 80, 60, 70);
const road_2_3 = make_road(2, 3, "2-3", 80, 60, 70);
const road_2_4 = make_road(2, 4, "2-4", 80, 60, 70);
const road_4_5 = make_road(4, 5, "2-4", 80, 60, 70);

const _roads0 = empty_road_network();
add_road(_roads0, road_0_1);
add_road(_roads0, road_0_2);
add_road(_roads0, road_1_3);
add_road(_roads0, road_1_5);
add_road(_roads0, road_2_3);
add_road(_roads0, road_2_4);
add_road(_roads0, road_4_5);

/*const graph2 = [
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
];*/

/*
function setup() {
  // put setup code here
  createCanvas(width, height);
  
}
  */

/*
let positions = [];

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

function draw_edge(from_node, to_node) {
  //
  stroke(0, 0, 0);
  const pos_from = positions[from_node];
  const pos_to = positions[to_node];
  line(pos_from[0], pos_from[1], pos_to[0], pos_to[1]);
  //line(100, 100, 400, 400);
}

function draw_graph(graph) {
  let circle_x = width / 2;
  let circle_y = height / 2;

  let total_nodes = graph.length;
  let radius = 30 * total_nodes / 3;
  radius = Math.max(radius, 120);

  let x = width / 2;
  let y = width / 10;

  for (let i = 0; i < total_nodes; i++) {

    // Circle
    let angle = map(i,0,total_nodes,0,2*Math.PI)
    let x = circle_x + radius * Math.cos(angle);
    let y = circle_y + radius * Math.sin(angle);
    
    draw_node(i, x, y, graph);
    if (i > 0) {
      draw_edge(i, i - 1);
    }
    if (i === total_nodes - 1) {
      draw_edge(0, total_nodes - 1);
    }

  }
}


function draw_graph_edges(graph){
  // loopa igenom grafen
  
  // för varje index i graph
    // för varje child node i index
      // rita edge
  

  let total_nodes = graph.length;

  for (let i = 0; i < total_nodes; i++) {
    let child_nodes = graph[i].length;
    for (let j = 0; j < child_nodes; j++) {
      draw_edge(i, graph[i][j]);
    }
  }
}
*/

/*
function draw() {
  // put drawing code here
  background("grey");

  draw_graph(graph);
  draw_graph_edges(graph);

  const path = fastest_path(_roads0, 0, 5)[2];
  console.log(path);
}
*/


// Scale the pos of node according to height of graph


//----------------

const sketch = (p5: P5) => {
	// Setup
	p5.setup = () => {
        // put setup code here
        // p5.createCanvas(width, height);
        const canvas = p5.createCanvas(width, height);
		    canvas.parent("app");


        p5.background("grey");
    }

    // Functions
    let positions: Array<number[]> = [];

    function draw_node(i : number, x : number, y : number, graph: Array<number[]>){
        p5.fill(0);
        p5.stroke(0, 0, 0, 0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(20);
        
        p5.fill(255);

        let radius = 100 / graph.length;
        radius = Math.max(radius, 30);
        p5.circle(x, y, p5.round(radius));
        p5.fill(0);
        p5.text(i, x, y);
        positions.push([x, y]);
    }

    function draw_edge(from_node: number, to_node: number) {
        p5.stroke(0, 0, 0);
        const pos_from = positions[from_node];
        const pos_to = positions[to_node];
        p5.line(pos_from[0], pos_from[1], pos_to[0], pos_to[1]);
    }

    function draw_graph(graph: Array<number[]>) {
        let circle_x = width / 2;
        let circle_y = height / 2;

        let total_nodes = graph.length;
        let radius = 30 * total_nodes / 3;
        radius = Math.max(radius, 120);

        //let x = width / 2;
        //let y = width / 10;

        for (let i = 0; i < total_nodes; i++) {
            // Circle
            let angle = p5.map(i,0,total_nodes,0,2*Math.PI)
            let x = circle_x + radius * Math.cos(angle);
            let y = circle_y + radius * Math.sin(angle);
            
            draw_node(i, x, y, graph);
            if (i > 0) {
                draw_edge(i, i - 1);
            }
            if (i === total_nodes - 1) {
                draw_edge(0, total_nodes - 1);
            }
        }
    }


    function draw_graph_edges(graph : Array<number[]>){
    // loopa igenom grafen
    
    // för varje index i graph
        // för varje child node i index
        // rita edge
    

    let total_nodes = graph.length;

    for (let i = 0; i < total_nodes; i++) {
        let child_nodes = graph[i].length;
        for (let j = 0; j < child_nodes; j++) {
            draw_edge(i, graph[i][j]);
        }
    }
    }

	// Draw
	p5.draw = () => {
		// put drawing code here
        // p5.background("grey");

        const graph = [
        [1, 2],
        [0, 3, 5],
        [0, 3, 4],
        [1, 2],
        [2, 5],
        [1, 4]
        ];

        draw_graph(graph);
        draw_graph_edges(graph);
      
        const path = fastest_path(_roads0, 0, 5)[2];
        console.log(path);
	};
};

new P5(sketch);
