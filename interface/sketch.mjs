import { for_each } from "../lib/list.mjs";
import { add_intersection, add_road, empty_road_network, make_intersection, make_road, fastest_path } from "../backend/main.mjs";

const _road_network = empty_road_network();

const intersections = [
  make_intersection(0, 300, 30),
  make_intersection(1, 150, 120),
  make_intersection(2, 450, 120),
  make_intersection(3, 90, 240),
  make_intersection(4, 210, 240),
  make_intersection(5, 390, 240),
  make_intersection(6, 510, 240),
  make_intersection(7, 30, 360),
  make_intersection(8, 120, 360),
  make_intersection(9, 180, 360),
  make_intersection(10, 360, 360),
  make_intersection(11, 480, 360)
];

intersections.forEach(intersection => add_intersection(_road_network, intersection));

const roads = [
  make_road(0, 1, "0-1", 60, 60, 60),
  make_road(0, 2, "0-1", 60, 60, 60),
  make_road(1, 3, "0-1", 60, 60, 60),
  make_road(1, 4, "0-1", 60, 60, 60),
  make_road(2, 5, "0-1", 60, 60, 60),
  make_road(2, 6, "0-1", 60, 60, 60),
  make_road(3, 7, "0-1", 60, 60, 60),
  make_road(3, 8, "0-1", 60, 60, 60),
  make_road(4, 8, "0-1", 60, 60, 60),
  make_road(4, 9, "0-1", 60, 60, 60),
  make_road(5, 9, "0-1", 60, 60, 60),
  make_road(5, 10, "0-1", 60, 60, 60),
  make_road(6, 10, "0-1", 60, 60, 60),
  make_road(6, 11, "0-1", 60, 60, 60),
  make_road(7, 8, "0-1", 60, 60, 60),
  make_road(8, 9, "0-1", 60, 60, 60),
  make_road(9, 10, "0-1", 60, 60, 60),
  make_road(10, 11, "0-1", 60, 60, 60)
];

roads.forEach(road => add_road(_road_network, road));

let current_road_network = _road_network;

function draw_road_network(p, road_network) {
  const intersections_size = road_network.size;
  const intersections = road_network.intersections;

  for (let i = 0; i < intersections_size; i++) {
    const pos = intersections[i].pos;
    draw_node(p, i, pos.x, pos.y);
  }
}

function draw_node(p, i, x, y) {
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(20);
  p.fill(0);
  p.fill(255);
  p.text(i, x, y - 20);
}

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

function draw_edge(p, from_node, to_node, color = "black") {
  p.stroke(color);
  p.strokeWeight(6);
  const pos_from = from_node.pos;
  const pos_to = to_node.pos;
  p.line(pos_from.x, pos_from.y, pos_to.x, pos_to.y);
}

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

function setup_sketch(width, height, road_network) {
  const sketch = new p5((p) => {
    p.setup = function () {
      const canvas = p.createCanvas(width, height);
      canvas.parent('map_area');
      p.noLoop();
    };

    p.draw = function () {
      p.clear();

      draw_graph_edges(p, road_network);
    };
  });

  return sketch;
}

const main_sketch = setup_sketch(600, 400, current_road_network);

window.onload = () => {
  setup();
};

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

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

function setup() {
  console.log(current_road_network.intersections);
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

  function set_start_destination_from_position(x, y) {
    const closest_node = get_closest_intersection_from_point({x: x, y: y});
    return closest_node.id;
  }

  function updatePath() {
    if (starting_node !== undefined && destination_node !== undefined) {
      const directions = fastest_path(current_road_network, starting_node, destination_node);
      color_path(main_sketch, current_road_network, directions.path);
    }
  }

  const start_pin = document.getElementById('start_pin');
  function set_start_pin_position(x, y) {
    const map_area_bbox = document.getElementById("map_area").getBoundingClientRect();
  
    const pin_bbox = start_pin.getBoundingClientRect();
    start_pin.style.visibility = 'visible';
    start_pin.style.left = x - pin_bbox.width / 2 - map_area_bbox.x + 'px';
    start_pin.style.top = y - pin_bbox.height / 2 - map_area_bbox.y + 'px';
  }
  
  const destination_pin = document.getElementById('destination_pin');
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

  map_area.addEventListener('click', (e) => {
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
  });

  starting_point_input.x.addEventListener('input', (e) => {
    if(starting_point === undefined) {
      starting_point = {x: undefined, y: undefined};
    }
    starting_point.x = e.target.value;
    if(starting_point.x !== undefined && starting_point.y !== undefined) {
      starting_node = set_start_destination_from_position(starting_point.x, starting_point.y);
      set_start_pin_position(starting_point.x, starting_point.y);
      updatePath();
    }
  });
  starting_point_input.y.addEventListener('input', (e) => {
    if(starting_point === undefined) {
      starting_point = {x: undefined, y: undefined};
      updatePath();
    }
    starting_point.y = e.target.value;
    if(starting_point.x !== undefined && starting_point.y !== undefined) {
      starting_node = set_start_destination_from_position(starting_point.x, starting_point.y);
      set_start_pin_position(starting_point.x, starting_point.y);
      updatePath();
    }
  });
  destination_input.x.addEventListener('input', (e) => {
    if(destination_point === undefined) {
      destination_point = {x: undefined, y: undefined};
    }
    destination_point.x = e.target.value;
    if(destination_point.x !== undefined && destination_point.y !== undefined) {
      destination_node = set_start_destination_from_position(destination_point.x, destination_point.y);
      set_destination_pin_position(destination_point.x, destination_point.y);
      updatePath();
    }
  });
  destination_input.y.addEventListener('input', (e) => {
    if(destination_point === undefined) {
      destination_point = {x: undefined, y: undefined};
    }
    destination_point.y = e.target.value;
    if(destination_point.x !== undefined && destination_point.y !== undefined) {
      destination_node = set_start_destination_from_position(destination_point.x, destination_point.y);
      set_destination_pin_position(destination_point.x, destination_point.y);
      updatePath();
    }
    updatePath();
  });

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