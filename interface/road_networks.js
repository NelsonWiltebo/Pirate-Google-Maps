import { add_intersection, add_road, empty_road_network, make_intersection, make_road } from "../backend/main.mjs";

export const all_road_networks = [];

// Road-network 1

const road_network_1 = empty_road_network();

const intersections_1 = [
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

intersections_1.forEach(intersection => add_intersection(road_network_1, intersection));

const roads_1 = [
  make_road(0, 1, "0-1", 60, 60, 60),
  make_road(0, 2, "0-2", 60, 60, 60),
  make_road(1, 3, "1-3", 60, 60, 60),
  make_road(1, 4, "1-4", 60, 60, 60),
  make_road(2, 5, "2-5", 60, 60, 60),
  make_road(2, 6, "2-6", 60, 60, 60),
  make_road(3, 7, "3-7", 60, 60, 60),
  make_road(3, 8, "3-8", 60, 60, 60),
  make_road(4, 8, "4-8", 60, 60, 60),
  make_road(4, 9, "4-9", 60, 60, 60),
  make_road(5, 9, "5-9", 60, 60, 60),
  make_road(5, 10, "5-10", 60, 60, 60),
  make_road(6, 10, "6-10", 60, 60, 60),
  make_road(6, 11, "6-11", 60, 60, 60),
  make_road(7, 8, "7-8", 60, 60, 60),
  make_road(8, 9, "7-9", 60, 60, 60),
  make_road(9, 10, "9-10", 60, 60, 60),
  make_road(10, 11, "10-11", 60, 60, 60)
];

roads_1.forEach(road => add_road(road_network_1, road));

all_road_networks.push(road_network_1);

// Road-network 2

const road_network_2 = empty_road_network();

const intersections_2 = [
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
  make_intersection(10, 360, 360)
];

intersections_2.forEach(intersection => add_intersection(road_network_2, intersection));

const roads_2 = [
  make_road(0, 1, "0-1", 60, 60, 60),
  make_road(0, 2, "0-2", 60, 60, 60),
  make_road(1, 3, "1-3", 60, 60, 60),
  make_road(1, 4, "1-4", 60, 60, 60),
  make_road(2, 5, "2-5", 60, 60, 60),
  make_road(2, 6, "2-6", 60, 60, 60),
  make_road(3, 7, "3-7", 60, 60, 60),
  make_road(3, 8, "3-8", 60, 60, 60),
  make_road(4, 8, "4-8", 60, 60, 60),
  make_road(4, 9, "4-9", 60, 60, 60),
  make_road(5, 9, "5-9", 60, 60, 60),
  make_road(5, 10, "5-10", 60, 60, 60)
];

roads_2.forEach(road => add_road(road_network_2, road));

all_road_networks.push(road_network_2);