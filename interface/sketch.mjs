import { for_each } from "../lib/list.mjs";
import { current_travel_time, fastest_path } from "../backend/main.mjs";

let current_road_network = undefined;
let current_road_network_width = undefined;
let current_road_network_height = undefined;

/**
 * Changes the current road network to the specified new road network.
 * @param {Object} new_road_network - The new road network to be set.
 */
export function change_current_road_network(new_road_network) {
  if (new_road_network !== undefined) {
    current_road_network = new_road_network.road_network;
    current_road_network_width = new_road_network.width;
    current_road_network_height = new_road_network.height;

  } else {
    console.log("Did not find map");
  }
}

// Retrieve stored road network when map_page.html loads
window.onload = () => {
  const savedMap = localStorage.getItem("selectedRoadNetwork");
  if (savedMap) {
    change_current_road_network(JSON.parse(savedMap));
  }
  setup();
};

/**
 * Draws the road network by displaying its intersections.
 * @param {Object} p - The p5.js instance.
 * @param {Object} road_network - The road network to be drawn.
 */
function draw_road_network_travel_time(p, road_network) {
  const intersections_size = road_network.size;
  const intersection_adjs = road_network.adj;
  const intersections = road_network.intersections;
  const roads = road_network.edges;

  for (let i = 0; i < intersections_size; i++) {
    const intersection_adj = intersection_adjs[i];
    for_each(intersection => {
      const road = roads[i][intersection];
      const from_intersection = intersections[i];
      const to_intersection = intersections[intersection];

      const middle_x = (from_intersection.pos.x + to_intersection.pos.x) / 2;
      const middle_y = (from_intersection.pos.y + to_intersection.pos.y) / 2;

      draw_text(p, Math.round(current_travel_time(road)) + " min", middle_x, middle_y);

    }, intersection_adj);
  }
}

function draw_road_time(p, road_network) {
  const size = road_network.size;
  const roads = road_network.roads;

  for (let i = 0; i < size; i++) {
    const pos = intersections[i].pos;
    draw_text(p, i, pos.x, pos.y);
  }
}

/**
 * Draws an intersection node on the map.
 * @param {Object} p - The p5.js instance.
 * @param {number} i - The index of the node.
 * @param {number} x - The x-coordinate of the node.
 * @param {number} y - The y-coordinate of the node.
 */
function draw_text(p, i, x, y) {
  p.fill(255);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(20);
  p.text(i, x, y - 20);
}

/**
 * Colors the specified path on the road network.
 * @param {Object} p - The p5.js instance.
 * @param {Object} road_network - The road network containing the path.
 * @param {Array} path - The path to be highlighted.
 * @param {string} [color='blue'] - The color used to highlight the path.
 */
function color_path(p, road_network, path, color = "blue") {
  p.redraw();
  for (let i = 0; i < path.length - 1; i++) {
    let from_id = path[i];
    let to_id = path[i + 1];

    const from_intersection = road_network.intersections[from_id];
    const to_intersection = road_network.intersections[to_id];

    draw_edge(p, from_intersection, to_intersection, color);
  }
}

/**
 * Draws an edge between two intersections.
 * @param {Object} p - The p5.js instance.
 * @param {Object} from_node - The starting node of the edge.
 * @param {Object} to_node - The ending node of the edge.
 * @param {string} [color='black'] - The color of the edge.
 */
function draw_edge(p, from_node, to_node, color = "black") {
  p.stroke(color);
  p.strokeWeight(6);
  p.line(from_node.pos.x, from_node.pos.y, to_node.pos.x, to_node.pos.y);
}

/**
 * Draws the edges of the graph based on the road network.
 * @param {Object} p - The p5.js instance.
 * @param {Object} road_network - The road network to be drawn.
 */
function draw_graph_edges(p, road_network) {
  const road_network_size = road_network.size;
  const intersections = road_network.intersections;
  for (let i = 0; i < road_network_size; i++) {
    const from_intersection = intersections[i];
    const adjacent_intersections = road_network.adj[i];

    for_each(intersection_id => {
      const to_intersection = intersections[intersection_id];
      draw_edge(p, from_intersection, to_intersection);
    }, adjacent_intersections);
  }
}

/**
 * Initializes a p5.js sketch for rendering the road network.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {Object} road_network - The road network to be displayed.
 * @returns {Object} The p5.js sketch instance.
 */
function setup_sketch(width, height, road_network) {
  if (road_network !== undefined) {
    const sketch = new p5((p) => {
      p.setup = function () {
        const canvas = p.createCanvas(width, height);
        canvas.parent('map_area');
        p.noLoop();
      };

      p.draw = function () {
        p.clear();
        draw_graph_edges(p, road_network);
        draw_road_network_travel_time(p, road_network);
      };
    });

    return sketch;
  } else {
    console.log("road-network is undefined");
  }
}

/**
 * Calculates the Euclidean distance between two points.
 * @param {number} x1 - X-coordinate of the first point.
 * @param {number} y1 - Y-coordinate of the first point.
 * @param {number} x2 - X-coordinate of the second point.
 * @param {number} y2 - Y-coordinate of the second point.
 * @returns {number} The Euclidean distance between the points.
 */
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Finds the closest intersection to a given point.
 * @param {Object} point - The point to check.
 * @returns {Object} The closest intersection.
 */
function get_closest_intersection_from_point(point) {
  const map_bbox = document.querySelector('#map_area canvas').getBoundingClientRect();

  let closest_intersection = undefined;
  let shortest_distance = Infinity;
  const all_intersections = current_road_network.intersections;

  all_intersections.forEach(intersection => {
    const intersection_pos = {
      x: intersection.pos.x + map_bbox.x,
      y: intersection.pos.y + map_bbox.y
    }
    const distance = getDistance(point.x, point.y, intersection_pos.x, intersection_pos.y)

    if (distance < shortest_distance) {
      closest_intersection = intersection;
      shortest_distance = distance;
    }
  });

  return closest_intersection;
}

let is_selecting_starting_point = false;
let is_selecting_destination_point = false;

/**
 * Sets up the website to use interface.
 */
function setup() {
  const main_sketch = setup_sketch(current_road_network_width, current_road_network_height, current_road_network);

  const map_area = document.getElementById("map_area");

  const starting_point_button = document.getElementById('starting_point_button');
  const destination_point_button = document.getElementById('destination_point_button');

  const reset_map_button = document.getElementById('reset_map');

  let starting_point = undefined;
  let destination_point = undefined;

  let starting_node = undefined;
  let destination_node = undefined;

  const starting_point_input = {
    x: document.getElementById('starting_point_input_x'),
    y: document.getElementById('starting_point_input_y')
  }
  const destination_input = {
    x: document.getElementById('destination_input_x'),
    y: document.getElementById('destination_input_y')
  }

  /**
   * Gets the node closest to a specified coordinate.
   * @param {number} x the x coordinate to check for the closest node
   * @param {number} y the y coordinate to check for the closest node
   * @returns the ID of the closest node to the specified coordinate.
   */
  function set_start_destination_from_position(x, y) {
    const closest_node = get_closest_intersection_from_point({ x: x, y: y });
    return closest_node.id;
  }

  /**
   * Updates the fastest path, and recolors that path in the main_sketch.
   */
  function updatePath() {
    if (starting_node !== undefined &&
      destination_node !== undefined) {
      const directions = fastest_path(current_road_network,
        starting_node,
        destination_node);
      color_path(main_sketch,
        current_road_network,
        directions.path);
    }
  }

  const start_pin = document.getElementById('start_pin');
  /**
   * Placed the graphical representation of the start pin at the specified 
   *  position.
   * @param {number} x the x coordinate of the specified position
   * @param {number} y the y coordinate of the specified position
   */
  function set_start_pin_position(x, y) {
    const map_area_bbox = document.getElementById("map_area").getBoundingClientRect();

    const pin_bbox = start_pin.getBoundingClientRect();
    start_pin.style.visibility = 'visible';
    start_pin.style.left = x - pin_bbox.width / 2 - map_area_bbox.x + 'px';
    start_pin.style.top = y - pin_bbox.height / 2 - map_area_bbox.y + 'px';
  }

  const destination_pin = document.getElementById('destination_pin');
  /**
   * Placed the graphical representation of the destination pin at the specified 
   *  position.
   * @param {number} x the x coordinate of the specified position
   * @param {number} y the y coordinate of the specified position
   */
  function set_destination_pin_position(x, y) {
    const map_area_bbox = document.getElementById("map_area").getBoundingClientRect();

    const pin_bbox = destination_pin.getBoundingClientRect();
    destination_pin.style.visibility = 'visible';
    destination_pin.style.left = x - pin_bbox.width / 2 - map_area_bbox.x + 'px';
    destination_pin.style.top = y - pin_bbox.height - map_area_bbox.y + 'px';
  }

  starting_point_button.addEventListener('click', () => {
    is_selecting_destination_point = false;
    is_selecting_starting_point = !is_selecting_starting_point;
  });
  destination_point_button.addEventListener('click', () => {
    is_selecting_starting_point = false;
    is_selecting_destination_point = !is_selecting_destination_point;
  });

  /**
   * Handles the logic of selecting a point (start/destination) with the cursor.
   * @param {MouseEvent} e the event when the mouse click event is triggered
   */
  function cursor_select_point(e) {
    if (is_selecting_starting_point) {
      starting_point = { x: e.x, y: e.y };
      set_start_pin_position(starting_point.x, starting_point.y);

      starting_point_input.x.value = starting_point.x;
      starting_point_input.y.value = starting_point.y;

      starting_node = set_start_destination_from_position(starting_point.x, starting_point.y);

      is_selecting_starting_point = false;
      updatePath();
    } else if (is_selecting_destination_point) {
      destination_point = { x: e.x, y: e.y };
      set_destination_pin_position(destination_point.x, destination_point.y);

      destination_input.x.value = destination_point.x;
      destination_input.y.value = destination_point.y;

      destination_node = set_start_destination_from_position(destination_point.x, destination_point.y);

      is_selecting_destination_point = false;
      updatePath();
    } else { }
  }

  map_area.addEventListener('click', cursor_select_point);

  /**
 * Updates the selected point (starting or destination) based on user input.
 * @param {Event} e The event triggered by the input change
 * @param {string} pointType Either 'starting' or 'destination'
 */
  function updatePoint(e, pointType) {
    let point, input, nodeSetter, pinSetter;

    if (pointType === 'starting') {
      if (!starting_point) starting_point = { x: undefined, y: undefined };
      point = starting_point;
      input = starting_point_input;
      nodeSetter = (x, y) => (starting_node = set_start_destination_from_position(x, y));
      pinSetter = set_start_pin_position;
    } else {
      if (!destination_point) destination_point = { x: undefined, y: undefined };
      point = destination_point;
      input = destination_input;
      nodeSetter = (x, y) => (destination_node = set_start_destination_from_position(x, y));
      pinSetter = set_destination_pin_position;
    }

    point[e.target.name] = e.target.value;

    if (point.x !== undefined && point.y !== undefined) {
      nodeSetter(point.x, point.y);
      pinSetter(point.x, point.y);
      updatePath();
    }
  }

  ['x', 'y'].forEach((axis) => {
    starting_point_input[axis].name = axis;
    starting_point_input[axis].addEventListener('input', (e) => updatePoint(e, 'starting'));

    destination_input[axis].name = axis;
    destination_input[axis].addEventListener('input', (e) => updatePoint(e, 'destination'));
  });


  /**
   * Resets the start/destination points and redraws the map to it's base state.
   */
  function reset_map() {
    starting_point = undefined;
    destination_point = undefined;

    starting_node = undefined;
    destination_node = undefined;

    starting_point_input.x.value = "";
    starting_point_input.y.value = "";

    destination_input.x.value = "";
    destination_input.y.value = "";

    destination_pin.style.visibility = 'hidden';
    start_pin.style.visibility = 'hidden';

    main_sketch.redraw();
  }

  reset_map_button.addEventListener('click', reset_map);
}